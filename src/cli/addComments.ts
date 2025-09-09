import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The Chakra UI CLI only emits a JSDoc comment with the default value of each component
 * variant.
 *
 * This script enhances the generated `recipes.gen.d.ts` file by adding JSDoc comments
 * extracted from the original recipe files. It scans the `theme/recipes` and
 * `theme/slot-recipes` directories for recipe definitions, extracts variant information,
 * and updates the generated type definitions with relevant comments.
 *
 * This ensures that the generated types are self-documenting and their description can
 * be viewed in Storybook or IDEs.
 *
 * @param ext - The file extension to look for recipe files (`ts` during development,
 * `js` for production). Default is `js`.
 * @returns A promise that resolves when the comments have been added.
 */
export async function addComments(ext = 'js') {
  const baseDir = join(__dirname, '..');
  const recipesIndexPath = join(baseDir, 'theme', 'recipes', `index.${ext}`);
  const slotRecipesIndexPath = join(
    baseDir,
    'theme',
    'slot-recipes',
    `index.${ext}`
  );

  const allRecipes = new Map<string, string>();

  if (existsSync(recipesIndexPath)) {
    const recipes = await parseRecipeIndexFile(recipesIndexPath);

    for (const [name, path] of recipes) {
      allRecipes.set(name, path);
    }
  }

  if (existsSync(slotRecipesIndexPath)) {
    const slotRecipes = await parseRecipeIndexFile(slotRecipesIndexPath);

    for (const [name, path] of slotRecipes) {
      allRecipes.set(name, path);
    }
  }

  const allRecipeVariants = new Map<string, Map<string, string>>();

  for (const [recipeName, _recipePath] of allRecipes) {
    const recipePath = ext === 'js' ? _recipePath : `${_recipePath}.ts`;

    if (!existsSync(recipePath)) {
      continue;
    }

    const variants = await extractRecipeVariants(recipePath);

    if (variants.size > 0) {
      allRecipeVariants.set(recipeName, variants);
    }
  }

  const typeFilePath = findGeneratedTypeFile();

  if (typeFilePath && allRecipeVariants.size > 0) {
    await updateGeneratedTypes(typeFilePath, allRecipeVariants);
  }
}

async function parseRecipeIndexFile(indexPath: string) {
  const recipeMap = new Map<string, string>();
  const sourceText = await readFile(indexPath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    indexPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const importClause = node.importClause;
      const moduleSpecifier = node.moduleSpecifier;

      if (importClause && ts.isStringLiteral(moduleSpecifier)) {
        const importPath = moduleSpecifier.text;

        if (
          importClause.namedBindings &&
          ts.isNamedImports(importClause.namedBindings)
        ) {
          for (const element of importClause.namedBindings.elements) {
            const importName = element.name.text;

            if (importName.endsWith('Recipe')) {
              const resolvedPath = resolve(dirname(indexPath), importPath);

              recipeMap.set(importName, resolvedPath);
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return recipeMap;
}

async function extractRecipeVariants(filePath: string) {
  const variants = new Map<string, string>();
  const sourceText = await readFile(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  function extractJSDoc(node: ts.Node) {
    const sourceText = sourceFile.getFullText();
    const nodeStart = node.getFullStart();
    const nodeActualStart = node.getStart(sourceFile);
    const leadingText = sourceText.substring(nodeStart, nodeActualStart);

    const jsDocMatch = /\/\*\*([\s\S]*?)\*\//.exec(leadingText);

    if (jsDocMatch) {
      return jsDocMatch[0];
    }

    return undefined;
  }

  function visitDefineRecipeCall(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const expression = node.expression;
      if (ts.isIdentifier(expression) && expression.text === 'defineRecipe') {
        const arg = node.arguments[0];
        if (ts.isObjectLiteralExpression(arg)) {
          visitRecipeConfig(arg);
        }
      }
    }

    ts.forEachChild(node, visitDefineRecipeCall);
  }

  function visitRecipeConfig(config: ts.ObjectLiteralExpression) {
    for (const prop of config.properties) {
      if (
        !ts.isPropertyAssignment(prop) ||
        !ts.isIdentifier(prop.name) ||
        prop.name.text !== 'variants' ||
        !ts.isObjectLiteralExpression(prop.initializer)
      ) {
        continue;
      }

      visitVariantsObject(prop.initializer);
    }
  }

  function visitVariantsObject(variantsObj: ts.ObjectLiteralExpression) {
    for (const prop of variantsObj.properties) {
      if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) {
        continue;
      }

      const variantName = prop.name.text;
      const jsDoc = extractJSDoc(prop);

      if (jsDoc) {
        variants.set(variantName, jsDoc);
      }
    }
  }

  visitDefineRecipeCall(sourceFile);

  return variants;
}

function findGeneratedTypeFile() {
  const styledSystem = fileURLToPath(
    import.meta.resolve('@chakra-ui/react/styled-system')
  );
  const styledSystemTypes = styledSystem.replace('/esm/', '/types/');

  return join(dirname(styledSystemTypes), 'generated', `recipes.gen.d.ts`);
}

async function updateGeneratedTypes(
  typeFilePath: string,
  allRecipeVariants: Map<string, Map<string, string>>
) {
  const sourceText = await readFile(typeFilePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    typeFilePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  });

  const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    return sourceFile => {
      const visitor: ts.Visitor = node => {
        if (
          ts.isInterfaceDeclaration(node) &&
          (node.name.text.endsWith('Variant') ||
            node.name.text.endsWith('VariantProps'))
        ) {
          let recipeVariants: Map<string, string> | undefined;

          for (const [recipeName, variants] of allRecipeVariants) {
            const componentName = recipeName.replace(/Recipe$/, '');

            if (
              node.name.text.toLowerCase() === `${componentName}variant` ||
              node.name.text.toLowerCase() === `${componentName}variantprops`
            ) {
              recipeVariants = variants;
              break;
            }
          }

          if (!recipeVariants) {
            return node;
          }

          const updatedMembers = node.members.map(member => {
            if (
              !ts.isPropertySignature(member) ||
              !ts.isIdentifier(member.name)
            ) {
              return member;
            }

            const variantName = member.name.text;
            const variantInfo = recipeVariants.get(variantName);

            if (!variantInfo) {
              return member;
            }

            const jsDocText = variantInfo
              .replace(/^\/\*\*\s*/, '')
              .replace(/\s*\*\/$/, '')
              .replace(/^\s*\*\s?/gm, '')
              .trim();

            const sourceText = sourceFile.text;
            const memberFullStart = member.getFullStart();
            const leadingText = sourceText.substring(
              memberFullStart,
              member.getStart(sourceFile)
            );

            let existingJSDocContent: string | null = null;

            const existingJSDocMatch = /\/\*\*([\s\S]*?)\*\//.exec(leadingText);
            if (existingJSDocMatch) {
              existingJSDocContent = existingJSDocMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*\*\s?/, '').trim())
                .filter(line => line.length > 0)
                .join('\n * ');
            }

            const newMember = ts.factory.updatePropertySignature(
              member,
              member.modifiers,
              member.name,
              member.questionToken,
              member.type
            );

            let mergedComment: string;
            if (existingJSDocContent) {
              mergedComment = `*\n * ${jsDocText}\n * ${existingJSDocContent}\n `;
            } else {
              mergedComment = `*\n * ${jsDocText}\n `;
            }

            ts.setSyntheticLeadingComments(newMember, []);
            ts.addSyntheticLeadingComment(
              newMember,
              ts.SyntaxKind.MultiLineCommentTrivia,
              mergedComment,
              true
            );

            ts.setEmitFlags(newMember, ts.EmitFlags.NoLeadingComments);

            return newMember;
          });

          return ts.factory.updateInterfaceDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            updatedMembers
          );
        }

        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
    };
  };

  const result = ts.transform(sourceFile, [transformer]);
  const transformedSourceFile = result.transformed[0];
  const output = printer.printFile(transformedSourceFile);

  await writeFile(typeFilePath, output, 'utf-8');

  result.dispose();
}
