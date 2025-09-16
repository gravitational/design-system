import {
  Box,
  Center,
  chakra,
  Grid,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
  type GridProps,
  type TokenInterface,
} from '@chakra-ui/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { Tooltip } from '../../../../components';
import { ArrowLineUpRightIcon, AtIcon } from '../../../../icons';
import type { Recursive, TokenSchema } from '../../../../theme/legacy';
import { THEMES, UiThemeMode } from '../../../../themes';
import { system } from '../../../../themes/teleport';
import type { UiThemeWithSingleColor } from '../../../../themes/theme';
import { Token } from './Token';

const colors =
  system.tokens.categoryMap.get('colors') ?? new Map<string, TokenInterface>();
const allColors = Array.from(colors.values());

const colorKeys = [
  'amber',
  'blue',
  'blueGrey',
  'brown',
  'common',
  'cyan',
  'deepOrange',
  'deepPurple',
  'green',
  'grey',
  'indigo',
  'lightBlue',
  'lightGreen',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
  'blackAlpha',
  'whiteAlpha',
];

const singleColorThemes = THEMES.filter(
  theme => theme.mode === UiThemeMode.SingleColor
);

type PrimitiveTokenValue = string | number;

interface ProcessedToken extends TokenInterface {
  displayName: string;
  isSemantic: boolean;
  conditions?: { key: string; value: string }[];
  themeValues?: { themeName: string; value: string }[];
  primitiveValue?: string;
  maxDisplayLength: number;
}

function resolveThemeValue(
  theme: UiThemeWithSingleColor,
  tokenPath: string
): string | null {
  const path = tokenPath.replace('colors.', '').split('.');
  const themeColors = theme.config.theme?.tokens?.colors;
  if (!themeColors) return null;

  let current = themeColors as
    | Recursive<TokenSchema<PrimitiveTokenValue>>
    | undefined;
  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment] as
        | Recursive<TokenSchema<PrimitiveTokenValue>>
        | undefined;
      continue;
    }
    return null;
  }

  if (
    current &&
    typeof current === 'object' &&
    'value' in current &&
    typeof current.value === 'string'
  ) {
    return current.value;
  }
  return null;
}

function processToken(token: TokenInterface): ProcessedToken {
  const displayName = token.name.replace('colors.', '');
  const isSemantic = !!token.extensions.conditions;

  const conditions =
    isSemantic && token.extensions.conditions
      ? Object.entries(token.extensions.conditions).map(([key, value]) => ({
          key: key.replace('_', ''),
          value: value as string,
        }))
      : undefined;

  const themeValues = isSemantic
    ? singleColorThemes
        .map(theme => {
          const value = resolveThemeValue(theme, token.name);
          return value
            ? {
                themeName: theme.name,
                value,
              }
            : null;
        })
        .filter((v): v is NonNullable<typeof v> => v !== null)
    : undefined;

  const primitiveValue = !isSemantic
    ? (token.originalValue as string)
    : undefined;

  let maxDisplayLength = displayName.length;
  conditions?.forEach(({ key, value }) => {
    maxDisplayLength = Math.max(maxDisplayLength, `${key}: ${value}`.length);
  });
  themeValues?.forEach(({ themeName, value }) => {
    maxDisplayLength = Math.max(
      maxDisplayLength,
      `${themeName}: ${value}`.length
    );
  });
  if (primitiveValue) {
    maxDisplayLength = Math.max(maxDisplayLength, primitiveValue.length);
  }

  return {
    ...token,
    displayName,
    isSemantic,
    conditions,
    themeValues,
    primitiveValue,
    maxDisplayLength,
  };
}

const processedColors = allColors.map(processToken);

const primitiveTokens = colorKeys.map(key => ({
  key,
  tokens: processedColors.filter(
    token => token.name.startsWith(`colors.${key}.`) && !token.isSemantic
  ),
}));

const semanticTokenCategories = Array.from(
  new Set(
    processedColors
      .filter(token => token.isSemantic)
      .map(token => token.name.split('.')[1])
  )
).sort();

const semanticTokens = semanticTokenCategories.map(key => ({
  key,
  tokens: processedColors.filter(
    token => token.name.startsWith(`colors.${key}`) && token.isSemantic
  ),
}));

interface CopyableTextProps {
  value: string;
  tooltip?: string;
  children?: ReactNode;
}

function CopyableText({
  value,
  tooltip = 'Copy to clipboard',
  children,
}: CopyableTextProps) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();
  const timeoutRef = useRef<number>(null);

  async function handleClick() {
    await copy(value);

    setCopied(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Tooltip
      content={copied ? 'Copied' : tooltip}
      openDelay={0}
      positioning={{ placement: 'right' }}
      closeDelay={0}
      closeOnClick={false}
    >
      <Box
        as="span"
        cursor="pointer"
        onClick={() => {
          void handleClick();
        }}
      >
        {children ?? value}
      </Box>
    </Tooltip>
  );
}

const ThemeValueContainer = chakra('div', {
  base: {
    border: '1px solid {colors.interactive.tonal.neutral.2}',
    fontFamily: 'mono',
    fontSize: '11px',
    display: 'inline-flex',
    alignItems: 'center',
    color: 'text.main',
    lineHeight: 1,
    py: '6px',
    cursor: 'pointer',
    px: 2,
    borderRadius: 'md',
    _hover: {
      bg: 'interactive.tonal.neutral.1',
    },
  },
});

function ThemeValue({ value }: { value: string }) {
  const isReference = value.startsWith('{');

  function handleScrollToToken(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const tokenPath = value.replace(/[{}]/g, '').replace('colors.', '');
    const targetElement = document.querySelector(
      `[data-token-name="${tokenPath}"]`
    );

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      targetElement.classList.add('highlight-token');

      window.setTimeout(() => {
        targetElement.classList.remove('highlight-token');
      }, 6500);
    }
  }

  const [tooltipContent, setTooltipContent] = useState('Copy to clipboard');

  const handleMouseEnter = useCallback(() => {
    if (isReference) {
      setTooltipContent('Scroll to token');
    }
  }, [isReference]);

  const handleMouseLeave = useCallback(() => {
    setTooltipContent('Copy to clipboard');
  }, []);

  if (isReference) {
    return (
      <CopyableText value={value} tooltip={tooltipContent}>
        <ThemeValueContainer>
          <AtIcon size="xs" mr={2} color="text.slightlyMuted" />

          {value.replace('colors.', '')}

          <IconButton
            fill="border"
            intent="neutral"
            size="sm"
            aria-label="Scroll to token"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            borderWidth={0}
            onClick={handleScrollToToken}
            mt="-1px"
            color="text.muted"
            borderRadius="md"
            my={-1}
            ml={1}
            mr="-6px"
          >
            <ArrowLineUpRightIcon />
          </IconButton>
        </ThemeValueContainer>
      </CopyableText>
    );
  }

  return (
    <CopyableText value={value}>
      <ThemeValueContainer>
        <Box
          bg={value}
          w="3"
          h="3"
          borderRadius="sm"
          display="inline-block"
          mr="2"
          border="1px solid {colors.interactive.tonal.neutral.2}"
        />
        {value.replace('colors.', '')}
      </ThemeValueContainer>
    </CopyableText>
  );
}

interface ColorSwatchProps {
  token: ProcessedToken;
  variant?: 'border' | 'background' | 'text';
}

function ColorSwatch({ token, variant = 'background' }: ColorSwatchProps) {
  const value = token.extensions.cssVar?.ref;
  const isInvertedText =
    variant === 'text' && token.name.toLowerCase().includes('inverse');

  return (
    <Center
      borderWidth={variant === 'border' ? '1.5px' : '1px'}
      bg={
        isInvertedText
          ? 'tooltip.background'
          : variant === 'background'
            ? value
            : undefined
      }
      w="full"
      h="20"
      minW="20"
      rounded="lg"
      gap={4}
      color={variant === 'text' ? value : undefined}
      borderColor={
        variant === 'border'
          ? value
          : variant === 'text'
            ? 'interactive.tonal.neutral.0'
            : 'interactive.tonal.neutral.2'
      }
    >
      {variant === 'text' && (
        <>
          <Text fontSize="xl">Ag</Text>
          <Text fontSize="lg">Ag</Text>
          <Text fontSize="md">Ag</Text>
          <Text fontSize="sm">Ag</Text>
        </>
      )}
    </Center>
  );
}

interface ColorTokenItemProps {
  token: ProcessedToken;
  variant?: 'border' | 'background' | 'text';
}

function ColorTokenItem({
  token,
  variant = 'background',
}: ColorTokenItemProps) {
  const swatchVariant = token.name.startsWith('colors.text.')
    ? 'text'
    : token.name.includes('.border.')
      ? 'border'
      : variant;

  return (
    <VStack
      gap="2"
      minW="fit-content"
      data-token-name={token.displayName}
      borderRadius="lg"
      className="token-item"
      border="2px solid transparent"
      px={2}
      py={2}
      css={{
        '&.highlight-token': {
          animation:
            'highlight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          bg: 'interactive.tonal.neutral.1',
          borderColor: 'color-mix(in srgb, {colors.brand} 50%, transparent)',
          animationDelay: '4s',
        },
      }}
    >
      <ColorSwatch token={token} variant={swatchVariant} />
      <Box
        _hover={{ bg: 'interactive.tonal.neutral.1' }}
        borderRadius="md"
        cursor="pointer"
      >
        <CopyableText value={token.displayName}>
          <Text
            lineHeight={1}
            textStyle="xs"
            textAlign="center"
            fontFamily="mono"
            px={1}
            py={1}
            whiteSpace="nowrap"
            title={token.displayName}
          >
            {token.displayName}
          </Text>
        </CopyableText>
      </Box>
      {token.isSemantic ? (
        <Stack gap="1" align="center" w="full">
          {token.conditions?.map(({ key, value }) => (
            <HStack
              key={key}
              color="text.slightlyMuted"
              fontSize="sm"
              textAlign="center"
              whiteSpace="nowrap"
            >
              {key}: <ThemeValue value={value} />
            </HStack>
          ))}
          {token.themeValues?.map(({ themeName, value }) => (
            <HStack
              key={themeName}
              color="text.slightlyMuted"
              fontSize="sm"
              textAlign="center"
              whiteSpace="nowrap"
              title={`${themeName}: ${value}`}
            >
              {themeName}: <ThemeValue value={value} />
            </HStack>
          ))}
        </Stack>
      ) : (
        token.primitiveValue && <ThemeValue value={token.primitiveValue} />
      )}
    </VStack>
  );
}

interface ColorGridProps extends GridProps {
  tokens: ProcessedToken[];
  variant?: 'border' | 'background' | 'text';
}

function ColorGrid({
  tokens,
  variant = 'background',
  ...rest
}: ColorGridProps) {
  const minWidth = useMemo(() => {
    const maxLength = Math.max(...tokens.map(t => t.maxDisplayLength));
    const charWidth = 7.2;
    const baseWidth = 90;
    return Math.max(160, Math.min(maxLength * charWidth + baseWidth, 400));
  }, [tokens]);

  return (
    <Grid
      templateColumns={`repeat(auto-fit, minmax(${minWidth}px, 1fr))`}
      gap={2}
      w="full"
      {...rest}
    >
      {tokens.map(token => (
        <ColorTokenItem key={token.name} token={token} variant={variant} />
      ))}
    </Grid>
  );
}

function getTextSize(level: number) {
  switch (level) {
    case 0:
      return '19px';
    case 1:
      return '15px';
    default:
      return 'sm';
  }
}

interface NestedColorGridsProps {
  tokens: ProcessedToken[];
  pathDepth?: number;
  nestingLevel?: number;
}

function NestedColorGrids({
  tokens,
  pathDepth = 2,
  nestingLevel = 0,
}: NestedColorGridsProps) {
  const { groups, leaves } = useMemo(() => {
    const groups: Record<string, ProcessedToken[]> = {};
    const leaves: ProcessedToken[] = [];

    for (const token of tokens) {
      const parts = token.name.split('.');

      if (parts.length > pathDepth + 1) {
        const groupKey = parts[pathDepth];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }

        groups[groupKey].push(token);
      } else {
        leaves.push(token);
      }
    }

    return { groups, leaves };
  }, [tokens, pathDepth]);

  if (Object.keys(groups).length === 0) {
    return <ColorGrid tokens={tokens} />;
  }

  return (
    <Stack gap="6">
      {leaves.length > 0 && <ColorGrid tokens={leaves} />}
      {Object.entries(groups).map(([groupName, groupTokens]) => (
        <Stack key={groupName} gap="2">
          <Text
            fontSize={getTextSize(nestingLevel)}
            mb={Math.max(0, 2 - nestingLevel)}
            fontWeight="medium"
            color="fg.muted"
          >
            {groupName}
          </Text>
          <NestedColorGrids
            tokens={groupTokens}
            pathDepth={pathDepth + 1}
            nestingLevel={nestingLevel + 1}
          />
        </Stack>
      ))}
    </Stack>
  );
}

export function ColorTokens() {
  return (
    <Stack gap="8" my="8">
      {primitiveTokens.map(({ key, tokens }) => (
        <Token key={key} title={key}>
          <ColorGrid tokens={tokens} />
        </Token>
      ))}
    </Stack>
  );
}

export function ColorSemanticTokens() {
  return (
    <Stack gap="8" my="8">
      {semanticTokens.map(({ key, tokens }) => (
        <Token key={key} title={key}>
          <NestedColorGrids tokens={tokens} />
        </Token>
      ))}
    </Stack>
  );
}
