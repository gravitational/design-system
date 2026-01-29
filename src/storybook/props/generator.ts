import ts from 'typescript';

import type { ComponentProp, RefInfo, TypeInfo } from '../components/PropTypes';

const PRESERVE_TYPE_NAMES = new Set([
  'ReactNode',
  'ReactElement',
  'CSSProperties',
  'Ref',
  'RefObject',
  'MutableRefObject',
  'HTMLAttributes',
  'AriaAttributes',
]);

const IGNORED_PROPS = new Set(['key', 'ref', '__css', 'css']);

const PRIMITIVE_KINDS = new Set([
  ts.SyntaxKind.StringKeyword,
  ts.SyntaxKind.NumberKeyword,
  ts.SyntaxKind.BooleanKeyword,
  ts.SyntaxKind.BigIntKeyword,
  ts.SyntaxKind.SymbolKeyword,
  ts.SyntaxKind.VoidKeyword,
  ts.SyntaxKind.UndefinedKeyword,
  ts.SyntaxKind.NullKeyword,
  ts.SyntaxKind.NeverKeyword,
  ts.SyntaxKind.AnyKeyword,
  ts.SyntaxKind.UnknownKeyword,
]);

const KEYWORD_MAP = new Map([
  [ts.SyntaxKind.StringKeyword, 'string'],
  [ts.SyntaxKind.NumberKeyword, 'number'],
  [ts.SyntaxKind.BooleanKeyword, 'boolean'],
  [ts.SyntaxKind.UndefinedKeyword, 'undefined'],
  [ts.SyntaxKind.NullKeyword, 'null'],
  [ts.SyntaxKind.VoidKeyword, 'void'],
  [ts.SyntaxKind.AnyKeyword, 'any'],
  [ts.SyntaxKind.UnknownKeyword, 'unknown'],
  [ts.SyntaxKind.NeverKeyword, 'never'],
  [ts.SyntaxKind.ObjectKeyword, 'object'],
  [ts.SyntaxKind.BigIntKeyword, 'bigint'],
  [ts.SyntaxKind.SymbolKeyword, 'symbol'],
]);

const REF_TYPE_NAMES = new Set([
  'Ref',
  'RefObject',
  'MutableRefObject',
  'ForwardedRef',
  'LegacyRef',
]);

interface DiscoveredComponent {
  name: string;
  propsTypeName: string;
  sourceFile: ts.SourceFile;
  typeNode: ts.TypeAliasDeclaration | ts.InterfaceDeclaration | null;
  symbol: ts.Symbol;
}

interface JSDocInfo {
  description: string | null;
  defaultValue: string | null;
}

function findInTypeMembers<T>(
  type: ts.Type,
  checker: (member: ts.Type) => T | null
): T | null {
  if (type.isUnion() || type.isIntersection()) {
    for (const member of type.types) {
      const result = checker(member);
      if (result) return result;
    }
  }
  return null;
}

function findInTypeNodeMembers<T>(
  typeNode: ts.TypeNode,
  checker: (member: ts.TypeNode) => T | null,
  kinds: ('union' | 'intersection')[] = ['union', 'intersection']
): T | null {
  const isUnion = kinds.includes('union') && ts.isUnionTypeNode(typeNode);
  const isIntersection =
    kinds.includes('intersection') && ts.isIntersectionTypeNode(typeNode);

  if (isUnion || isIntersection) {
    for (const member of typeNode.types) {
      const result = checker(member);
      if (result) return result;
    }
  }
  return null;
}

function getTypeName(type: ts.Type): string | undefined {
  return (type.getSymbol() ?? type.aliasSymbol)?.getName();
}

export class PropsGenerator {
  private readonly typeChecker: ts.TypeChecker;
  private readonly sourceFiles: readonly ts.SourceFile[];

  constructor(
    rootPath: string,
    tsconfigPath: string,
    componentFiles: string[]
  ) {
    const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

    if (configFile.error) {
      throw new Error(
        `Failed to read tsconfig: ${ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n')}`
      );
    }

    const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      rootPath
    );

    if (errors.length > 0) {
      const errorMessages = errors
        .map(e => ts.flattenDiagnosticMessageText(e.messageText, '\n'))
        .join('\n');

      throw new Error(`Failed to parse tsconfig: ${errorMessages}`);
    }

    const allFiles = [...new Set([...fileNames, ...componentFiles])];

    const program = ts.createProgram(allFiles, {
      ...options,
      noEmit: true,
    });

    this.typeChecker = program.getTypeChecker();
    this.sourceFiles = program.getSourceFiles();
  }

  discoverExportedPropsTypes(sourceFile: ts.SourceFile): DiscoveredComponent[] {
    const results: DiscoveredComponent[] = [];

    const moduleSymbol = this.typeChecker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) {
      return results;
    }

    const exports = this.typeChecker.getExportsOfModule(moduleSymbol);

    for (const exportedSymbol of exports) {
      const name = exportedSymbol.getName();

      if (!name.endsWith('Props')) {
        continue;
      }

      const componentName = name.replace(/Props$/, '');

      let resolvedSymbol = exportedSymbol;
      if (exportedSymbol.flags & ts.SymbolFlags.Alias) {
        resolvedSymbol = this.typeChecker.getAliasedSymbol(exportedSymbol);
      }

      const declarations = resolvedSymbol.getDeclarations();
      if (!declarations || declarations.length === 0) {
        continue;
      }

      for (const declaration of declarations) {
        let typeNode: ts.TypeAliasDeclaration | ts.InterfaceDeclaration | null =
          null;

        if (ts.isTypeAliasDeclaration(declaration)) {
          typeNode = declaration;
        } else if (ts.isInterfaceDeclaration(declaration)) {
          typeNode = declaration;
        }

        if (
          !(resolvedSymbol.flags & ts.SymbolFlags.TypeAlias) &&
          !(resolvedSymbol.flags & ts.SymbolFlags.Interface)
        ) {
          continue;
        }

        results.push({
          name: componentName,
          propsTypeName: name,
          sourceFile,
          typeNode,
          symbol: resolvedSymbol,
        });
      }
    }

    return results;
  }

  getSourceFiles(): readonly ts.SourceFile[] {
    return this.sourceFiles;
  }

  resolvePropsType(
    symbol: ts.Symbol,
    sourceFile: ts.SourceFile
  ): ComponentProp[] {
    const properties: ComponentProp[] = [];

    const declaredType = this.typeChecker.getDeclaredTypeOfSymbol(symbol);
    const typeProperties = this.typeChecker.getPropertiesOfType(declaredType);

    for (const property of typeProperties) {
      const propName = property.getName();

      if (IGNORED_PROPS.has(propName)) {
        continue;
      }

      const { typeInfo, conditional } = this.getTypeInfo(property, sourceFile);

      const jsdoc = this.extractJSDoc(property);
      const optional = (property.flags & ts.SymbolFlags.Optional) !== 0;
      const readonly = checkReadonly(property);
      const propSourceFile = getPropertySourceFile(property);

      properties.push({
        name: propName,
        typeInfo,
        conditional,
        required: !optional,
        readonly,
        description: jsdoc.description,
        defaultValue: jsdoc.defaultValue,
        sourceFile: propSourceFile,
      });
    }

    return properties;
  }

  extractRefType(
    propsSymbol: ts.Symbol,
    sourceFile: ts.SourceFile
  ): RefInfo | null {
    const declarations = propsSymbol.getDeclarations();
    if (!declarations || declarations.length === 0) {
      return null;
    }

    for (const declaration of declarations) {
      let typeNode: ts.TypeNode | undefined;

      if (ts.isTypeAliasDeclaration(declaration)) {
        typeNode = declaration.type;
      } else if (ts.isInterfaceDeclaration(declaration)) {
        const refType = this.extractRefFromInterfaceHeritage(declaration);

        if (refType) {
          return refType;
        }
      }

      if (typeNode) {
        const refType = this.extractRefFromTypeNode(typeNode);

        if (refType) {
          return refType;
        }
      }
    }

    const componentName = propsSymbol.getName().replace(/Props$/, '');
    const refFromComponent = this.extractRefFromComponent(
      componentName,
      sourceFile
    );

    if (refFromComponent) {
      return refFromComponent;
    }

    return this.extractRefFromRefProperty(propsSymbol);
  }

  private getTypeArgsOrNull(type: ts.Type): readonly ts.Type[] | null {
    const typeArgs = this.typeChecker.getTypeArguments(
      type as ts.TypeReference
    );
    return typeArgs.length > 0 ? typeArgs : null;
  }

  private formatType(type: ts.Type, multiline = false): string {
    const flags =
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias;
    return this.typeChecker.typeToString(
      type,
      undefined,
      multiline ? flags | ts.TypeFormatFlags.MultilineObjectLiterals : flags
    );
  }

  private extractRefFromComponent(
    componentName: string,
    sourceFile: ts.SourceFile
  ): RefInfo | null {
    const moduleSymbol = this.typeChecker.getSymbolAtLocation(sourceFile);
    if (!moduleSymbol) return null;

    const exports = this.typeChecker.getExportsOfModule(moduleSymbol);
    const componentSymbol = exports.find(s => s.getName() === componentName);
    if (!componentSymbol) return null;

    let resolvedSymbol = componentSymbol;
    if (componentSymbol.flags & ts.SymbolFlags.Alias) {
      resolvedSymbol = this.typeChecker.getAliasedSymbol(componentSymbol);
    }

    const componentType = this.typeChecker.getTypeOfSymbol(resolvedSymbol);

    return this.extractRefFromComponentType(componentType);
  }

  private extractRefFromComponentType(type: ts.Type): RefInfo | null {
    const typeArgs = this.getTypeArgsOrNull(type);

    if (typeArgs) {
      for (const arg of typeArgs) {
        const result = this.extractRefFromPropsIntersection(arg);

        if (result) {
          return result;
        }
      }
    }

    if (type.isIntersection()) {
      return this.extractRefFromPropsIntersection(type);
    }

    const aliasArgs = type.aliasTypeArguments as ts.Type[] | undefined;

    if (aliasArgs) {
      for (const arg of aliasArgs) {
        const result = this.extractRefFromPropsIntersection(arg);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  private extractRefFromPropsIntersection(type: ts.Type): RefInfo | null {
    const fromMembers = findInTypeMembers(type, member =>
      this.extractRefFromResolvedType(member)
    );
    if (fromMembers) return fromMembers;

    return this.extractRefFromResolvedType(type);
  }

  private extractRefFromTypeNode(typeNode: ts.TypeNode): RefInfo | null {
    const fromMembers = findInTypeNodeMembers(
      typeNode,
      member => this.extractRefFromTypeNode(member),
      ['intersection']
    );
    if (fromMembers) return fromMembers;

    if (ts.isTypeReferenceNode(typeNode)) {
      const typeName = getTypeReferenceName(typeNode);

      if (typeName === 'RefAttributes' && typeNode.typeArguments?.length) {
        return this.createRefInfo(typeNode.typeArguments[0]);
      }

      const resolvedType = this.typeChecker.getTypeFromTypeNode(typeNode);

      const fromResolvedMembers = findInTypeMembers(resolvedType, member =>
        this.extractRefFromResolvedType(member)
      );
      if (fromResolvedMembers) return fromResolvedMembers;

      return this.extractRefFromResolvedType(resolvedType);
    }

    if (ts.isParenthesizedTypeNode(typeNode)) {
      return this.extractRefFromTypeNode(typeNode.type);
    }

    return null;
  }

  private extractRefFromInterfaceHeritage(
    declaration: ts.InterfaceDeclaration
  ): RefInfo | null {
    if (!declaration.heritageClauses) {
      return null;
    }

    for (const clause of declaration.heritageClauses) {
      for (const type of clause.types) {
        if (!ts.isExpressionWithTypeArguments(type)) {
          continue;
        }

        const typeName = type.expression.getText();

        if (typeName === 'RefAttributes' && type.typeArguments?.length) {
          return this.createRefInfo(type.typeArguments[0]);
        }
      }
    }

    return null;
  }

  private extractRefFromResolvedType(type: ts.Type): RefInfo | null {
    const name = getTypeName(type);

    if (name !== 'RefAttributes') {
      return null;
    }

    const typeArgs = this.getTypeArgsOrNull(type);
    if (!typeArgs) {
      return null;
    }

    const elementType = this.typeChecker.typeToString(typeArgs[0]);
    const isHtmlElement = isHtmlElementType(elementType);

    let expandedType: string | null = null;
    if (!isHtmlElement) {
      expandedType = this.formatType(typeArgs[0], true);
    }

    return {
      type: `RefAttributes<${elementType}>`,
      elementType,
      expandedType,
      imperative: !isHtmlElement,
    };
  }

  private extractRefFromRefProperty(propsSymbol: ts.Symbol): RefInfo | null {
    const declaredType = this.typeChecker.getDeclaredTypeOfSymbol(propsSymbol);
    const typeProperties = this.typeChecker.getPropertiesOfType(declaredType);

    const refProperty = typeProperties.find(p => p.getName() === 'ref');
    if (!refProperty) {
      return null;
    }

    const declarations = refProperty.getDeclarations();
    if (!declarations || declarations.length === 0) {
      return null;
    }

    const declaration = declarations[0];

    if (
      !(
        ts.isPropertySignature(declaration) ||
        ts.isPropertyDeclaration(declaration)
      ) ||
      !declaration.type
    ) {
      return null;
    }

    const typeNode = declaration.type;

    const elementType = this.extractRefElementType(typeNode);
    if (!elementType) {
      return null;
    }

    return this.createRefInfoFromElementType(elementType, typeNode);
  }

  private createRefInfo(typeArg: ts.TypeNode): RefInfo {
    const elementType = this.typeNodeToString(typeArg);
    const isHtmlElement = isHtmlElementType(elementType);

    let expandedType: string | null = null;

    if (!isHtmlElement) {
      const resolvedType = this.typeChecker.getTypeFromTypeNode(typeArg);
      expandedType = this.formatType(resolvedType, true);
    }

    return {
      type: `RefAttributes<${elementType}>`,
      elementType,
      expandedType,
      imperative: !isHtmlElement,
    };
  }

  private createRefInfoFromElementType(
    elementType: string,
    originalTypeNode: ts.TypeNode
  ): RefInfo {
    const isHtmlElement = isHtmlElementType(elementType);
    const fullTypeString = this.typeNodeToString(originalTypeNode);

    let expandedType: string | null = null;

    if (!isHtmlElement) {
      const resolvedType =
        this.typeChecker.getTypeFromTypeNode(originalTypeNode);
      const innerType = this.extractInnerRefType(resolvedType);

      if (innerType) {
        expandedType = this.formatType(innerType, true);
      }
    }

    return {
      type: fullTypeString,
      elementType,
      expandedType,
      imperative: !isHtmlElement,
    };
  }

  private extractRefElementType(typeNode: ts.TypeNode): string | null {
    const fromMembers = findInTypeNodeMembers(
      typeNode,
      member => this.extractRefElementType(member),
      ['union']
    );
    if (fromMembers) return fromMembers;

    if (ts.isTypeReferenceNode(typeNode)) {
      const typeName = getTypeReferenceName(typeNode);

      if (
        typeName &&
        REF_TYPE_NAMES.has(typeName) &&
        typeNode.typeArguments?.length
      ) {
        return this.typeNodeToString(typeNode.typeArguments[0]);
      }

      const resolvedType = this.typeChecker.getTypeFromTypeNode(typeNode);

      return this.extractElementTypeFromResolvedType(resolvedType);
    }

    return null;
  }

  private extractElementTypeFromResolvedType(type: ts.Type): string | null {
    const fromMembers = findInTypeMembers(type, member =>
      this.extractElementTypeFromResolvedType(member)
    );
    if (fromMembers) return fromMembers;

    const typeArgs = this.getTypeArgsOrNull(type);
    if (!typeArgs) {
      return null;
    }

    const name = getTypeName(type);
    if (name && REF_TYPE_NAMES.has(name)) {
      return this.typeChecker.typeToString(typeArgs[0]);
    }

    return null;
  }

  private extractInnerRefType(type: ts.Type): ts.Type | null {
    const fromMembers = findInTypeMembers(type, member =>
      this.extractInnerRefType(member)
    );
    if (fromMembers) return fromMembers;

    const typeArgs = this.getTypeArgsOrNull(type);
    if (!typeArgs) {
      return null;
    }

    return typeArgs[0];
  }

  private extractJSDoc(symbol: ts.Symbol): JSDocInfo {
    const documentation = symbol.getDocumentationComment(this.typeChecker);
    const description =
      documentation.length > 0
        ? documentation
            .map(part => part.text)
            .join('')
            .trim()
        : null;

    const jsdocTags = symbol.getJsDocTags(this.typeChecker);

    let defaultValue: string | null = null;

    for (const tag of jsdocTags) {
      const tagName = tag.name;
      const tagText = tag.text?.map(t => t.text).join('') ?? '';

      if (tagName === 'default') {
        defaultValue = parseDefaultValue(tagText);
      }
    }

    return { description, defaultValue };
  }

  private getTypeInfo(
    property: ts.Symbol,
    sourceFile: ts.SourceFile
  ): {
    typeInfo: TypeInfo;
    conditional: boolean;
  } {
    const declarations = property.getDeclarations();

    if (declarations && declarations.length > 0) {
      const declaration = declarations[0];

      if (
        (ts.isPropertySignature(declaration) ||
          ts.isPropertyDeclaration(declaration)) &&
        declaration.type
      ) {
        return this.processTypeNode(declaration.type);
      }
    }

    const propertyType = this.typeChecker.getTypeOfSymbolAtLocation(
      property,
      sourceFile
    );
    const nonNullableType = this.typeChecker.getNonNullableType(propertyType);

    return {
      typeInfo: this.getTypeInfoFromType(nonNullableType),
      conditional: false,
    };
  }

  private processTypeNode(typeNode: ts.TypeNode): {
    typeInfo: TypeInfo;
    conditional: boolean;
  } {
    if (ts.isTypeReferenceNode(typeNode)) {
      const typeName = getTypeReferenceName(typeNode);

      if (typeName === 'ConditionalValue' && typeNode.typeArguments?.length) {
        const inner = this.processTypeNode(typeNode.typeArguments[0]);
        return { ...inner, conditional: true };
      }

      if (typeName && PRESERVE_TYPE_NAMES.has(typeName)) {
        return {
          typeInfo: { kind: 'reference', type: typeName, expanded: typeName },
          conditional: false,
        };
      }

      const originalType = this.typeNodeToString(typeNode);
      const resolvedType = this.typeChecker.getTypeFromTypeNode(typeNode);
      const expanded = this.formatType(resolvedType);

      return {
        typeInfo: { kind: 'reference', type: originalType, expanded },
        conditional: false,
      };
    }

    if (ts.isUnionTypeNode(typeNode)) {
      const filteredTypes = typeNode.types.filter(
        t =>
          t.kind !== ts.SyntaxKind.UndefinedKeyword &&
          t.kind !== ts.SyntaxKind.NullKeyword
      );

      if (filteredTypes.length === 1) {
        return this.processTypeNode(filteredTypes[0]);
      }

      const members = filteredTypes.map(t => this.typeNodeToString(t));

      return {
        typeInfo: {
          kind: 'union',
          type: members.join(' | '),
          members,
        },
        conditional: false,
      };
    }

    if (ts.isIntersectionTypeNode(typeNode)) {
      const members = typeNode.types.map(t => this.typeNodeToString(t));

      return {
        typeInfo: {
          kind: 'intersection',
          type: members.join(' & '),
          members,
        },
        conditional: false,
      };
    }

    if (ts.isParenthesizedTypeNode(typeNode)) {
      return this.processTypeNode(typeNode.type);
    }

    return {
      typeInfo: this.getTypeInfoFromNode(typeNode),
      conditional: false,
    };
  }

  private getTypeInfoFromNode(typeNode: ts.TypeNode): TypeInfo {
    const type = this.typeNodeToString(typeNode);

    if (PRIMITIVE_KINDS.has(typeNode.kind)) {
      return { kind: 'primitive', type };
    }

    if (ts.isLiteralTypeNode(typeNode)) {
      return { kind: 'literal', type };
    }

    if (ts.isFunctionTypeNode(typeNode)) {
      return { kind: 'function', type };
    }

    if (ts.isArrayTypeNode(typeNode)) {
      return { kind: 'array', type };
    }

    if (ts.isTupleTypeNode(typeNode)) {
      return { kind: 'tuple', type };
    }

    if (ts.isTypeLiteralNode(typeNode)) {
      return { kind: 'object', type };
    }

    if (ts.isTypeReferenceNode(typeNode)) {
      const resolvedType = this.typeChecker.getTypeFromTypeNode(typeNode);
      const expanded = this.formatType(resolvedType);

      return { kind: 'reference', type, expanded };
    }

    return { kind: 'unknown', type };
  }

  private getTypeInfoFromType(type: ts.Type): TypeInfo {
    const typeString = this.formatType(type);

    if (type.isUnion()) {
      const members = type.types.map(t =>
        this.typeChecker.typeToString(
          t,
          undefined,
          ts.TypeFormatFlags.NoTruncation
        )
      );

      return { kind: 'union', type: typeString, members };
    }

    if (type.isIntersection()) {
      const members = type.types.map(t =>
        this.typeChecker.typeToString(
          t,
          undefined,
          ts.TypeFormatFlags.NoTruncation
        )
      );

      return { kind: 'intersection', type: typeString, members };
    }

    const flags = type.getFlags();

    if (
      flags & ts.TypeFlags.String ||
      flags & ts.TypeFlags.Number ||
      flags & ts.TypeFlags.Boolean ||
      flags & ts.TypeFlags.BigInt ||
      flags & ts.TypeFlags.ESSymbol ||
      flags & ts.TypeFlags.Void ||
      flags & ts.TypeFlags.Undefined ||
      flags & ts.TypeFlags.Null ||
      flags & ts.TypeFlags.Never ||
      flags & ts.TypeFlags.Any ||
      flags & ts.TypeFlags.Unknown
    ) {
      return { kind: 'primitive', type: typeString };
    }

    if (
      flags & ts.TypeFlags.StringLiteral ||
      flags & ts.TypeFlags.NumberLiteral ||
      flags & ts.TypeFlags.BooleanLiteral
    ) {
      return { kind: 'literal', type: typeString };
    }

    const callSignatures = type.getCallSignatures();

    if (callSignatures.length > 0) {
      return { kind: 'function', type: typeString };
    }

    if (
      type.getSymbol()?.getName() === 'Array' ||
      this.typeChecker.isArrayType(type)
    ) {
      return { kind: 'array', type: typeString };
    }

    if (this.typeChecker.isTupleType(type)) {
      return { kind: 'tuple', type: typeString };
    }

    if (flags & ts.TypeFlags.Object) {
      const symbol = type.getSymbol();

      if (symbol) {
        return { kind: 'reference', type: typeString, expanded: typeString };
      }

      return { kind: 'object', type: typeString };
    }

    return { kind: 'unknown', type: typeString };
  }

  private typeNodeToString(typeNode: ts.TypeNode): string {
    if (ts.isTypeReferenceNode(typeNode)) {
      const typeName = getTypeReferenceName(typeNode);
      if (typeName) {
        if (typeNode.typeArguments?.length) {
          const args = typeNode.typeArguments
            .map(a => this.typeNodeToString(a))
            .join(', ');

          return `${typeName}<${args}>`;
        }

        return typeName;
      }
    }

    if (ts.isLiteralTypeNode(typeNode)) {
      const lit = typeNode.literal;

      if (ts.isStringLiteral(lit)) {
        return `'${lit.text}'`;
      }
      if (ts.isNumericLiteral(lit)) {
        return lit.text;
      }
      if (lit.kind === ts.SyntaxKind.TrueKeyword) {
        return 'true';
      }
      if (lit.kind === ts.SyntaxKind.FalseKeyword) {
        return 'false';
      }
      if (lit.kind === ts.SyntaxKind.NullKeyword) {
        return 'null';
      }
    }

    const mapValue = KEYWORD_MAP.get(typeNode.kind);

    if (mapValue) {
      return mapValue;
    }

    if (ts.isArrayTypeNode(typeNode)) {
      return `${this.typeNodeToString(typeNode.elementType)}[]`;
    }

    if (ts.isTupleTypeNode(typeNode)) {
      const elements = typeNode.elements.map(e => this.typeNodeToString(e));

      return `[${elements.join(', ')}]`;
    }

    if (ts.isFunctionTypeNode(typeNode)) {
      const params = typeNode.parameters
        .map(p => {
          const name = p.name.getText();
          const type = p.type ? this.typeNodeToString(p.type) : 'any';
          return `${name}: ${type}`;
        })
        .join(', ');

      const returnType = this.typeNodeToString(typeNode.type);

      return `(${params}) => ${returnType}`;
    }

    if (ts.isUnionTypeNode(typeNode)) {
      return typeNode.types.map(t => this.typeNodeToString(t)).join(' | ');
    }

    if (ts.isIntersectionTypeNode(typeNode)) {
      return typeNode.types.map(t => this.typeNodeToString(t)).join(' & ');
    }

    if (ts.isParenthesizedTypeNode(typeNode)) {
      return `(${this.typeNodeToString(typeNode.type)})`;
    }

    const printer = ts.createPrinter({ removeComments: true });

    return printer.printNode(
      ts.EmitHint.Unspecified,
      typeNode,
      typeNode.getSourceFile()
    );
  }
}

function checkReadonly(property: ts.Symbol) {
  const declarations = property.getDeclarations();

  if (!declarations || declarations.length === 0) {
    return false;
  }

  const declaration = declarations[0];

  if (
    ts.isPropertySignature(declaration) ||
    ts.isPropertyDeclaration(declaration)
  ) {
    return (
      declaration.modifiers?.some(
        mod => mod.kind === ts.SyntaxKind.ReadonlyKeyword
      ) ?? false
    );
  }

  return false;
}

function isHtmlElementType(typeName: string) {
  const htmlElementPatterns = [
    /^HTML\w*Element$/,
    /^SVG\w*Element$/,
    /^Element$/,
    /^Document$/,
    /^Window$/,
    /^Node$/,
  ];

  return htmlElementPatterns.some(pattern => pattern.test(typeName));
}

function parseDefaultValue(value: string) {
  let cleaned = value.trim();

  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }

  if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.slice(1, -1);
  }

  return cleaned;
}

function getTypeReferenceName(typeRef: ts.TypeReferenceNode) {
  if (ts.isIdentifier(typeRef.typeName)) {
    return typeRef.typeName.text;
  }
  if (ts.isQualifiedName(typeRef.typeName)) {
    return typeRef.typeName.right.text;
  }
  return null;
}

function getPropertySourceFile(property: ts.Symbol) {
  const declarations = property.getDeclarations();
  if (!declarations || declarations.length === 0) {
    return null;
  }

  return declarations[0].getSourceFile().fileName;
}
