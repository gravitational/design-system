import { describe, expect, it } from 'vitest';

import { createThemeSystem } from './index';
import { resolveColorToken } from './resolveColorToken';
import { BBLP_THEME, TELEPORT_THEME } from '../themes';

const teleportSystem = createThemeSystem(TELEPORT_THEME.config);
const bblpSystem = createThemeSystem(BBLP_THEME.config);

describe('resolveColorToken (teleport theme, conditional tokens)', () => {
  it('resolves a `{_light, _dark}` token to its dark value', () => {
    // terminal.foreground is defined as { _light: '#000', _dark: '#FFF' }
    expect(
      resolveColorToken(teleportSystem, 'colors.terminal.foreground', 'dark')
    ).toBe('#FFF');
  });

  it('resolves a `{_light, _dark}` token to its light value', () => {
    expect(
      resolveColorToken(teleportSystem, 'colors.terminal.foreground', 'light')
    ).toBe('#000');
  });

  it('resolves a token whose conditional value references another conditional token', () => {
    // terminal.red references colors.dataVisualisation.{primary|tertiary}.abbey,
    // which itself is conditional. The result must follow the same mode.
    const dark = resolveColorToken(
      teleportSystem,
      'colors.terminal.red',
      'dark'
    );
    const light = resolveColorToken(
      teleportSystem,
      'colors.terminal.red',
      'light'
    );

    // Both should be defined hex strings; sanity-check the format rather than
    // duplicating the palette values here.
    expect(dark).toMatch(/^#[0-9A-F]{6}$/i);
    expect(light).toMatch(/^#[0-9A-F]{6}$/i);
    expect(dark).not.toBe(light);
  });

  it('resolves the brand token in both modes', () => {
    // brand is defined as { _light: '#512FC9', _dark: '#9F85FF' }
    expect(resolveColorToken(teleportSystem, 'colors.brand', 'dark')).toBe(
      '#9F85FF'
    );
    expect(resolveColorToken(teleportSystem, 'colors.brand', 'light')).toBe(
      '#512FC9'
    );
  });

  it('resolves a token whose value is a CSS expression with an embedded reference', () => {
    // tooltip.background is defined as
    //   `color-mix(in srgb, white|black 80%, {colors.levels.sunken})`.
    // The inner reference must be substituted while the surrounding
    // `color-mix(...)` expression is preserved verbatim.
    const result = resolveColorToken(
      teleportSystem,
      'colors.tooltip.background',
      'dark'
    );
    expect(result).toBeDefined();
    expect(result).toContain('color-mix');
    expect(result).not.toContain('{');
  });

  it('returns undefined for a token that does not exist', () => {
    expect(
      resolveColorToken(teleportSystem, 'colors.does.not.exist', 'dark')
    ).toBeUndefined();
  });
});

describe('resolveColorToken (bblp theme, single-color tokens)', () => {
  it('resolves a base-only token to its value regardless of mode', () => {
    // bblp brand is `{ value: '#FFA028' }` — no `_light`/`_dark` split.
    expect(resolveColorToken(bblpSystem, 'colors.brand', 'dark')).toBe(
      '#FFA028'
    );
    expect(resolveColorToken(bblpSystem, 'colors.brand', 'light')).toBe(
      '#FFA028'
    );
  });

  it('resolves a nested base-only token', () => {
    // levels.surface is `{ value: '#232323' }`
    expect(resolveColorToken(bblpSystem, 'colors.levels.surface', 'dark')).toBe(
      '#232323'
    );
  });

  it('resolves a base-only token that references another base-only token', () => {
    // terminal.background references `{colors.levels.sunken}` which is a
    // base-only hex. The reference must be substituted to the final color.
    const result = resolveColorToken(
      bblpSystem,
      'colors.terminal.background',
      'dark'
    );
    expect(result).toBeDefined();
    expect(result).not.toContain('{');
    expect(result).not.toContain('var(');
  });

  it('returns undefined for a token that does not exist', () => {
    expect(
      resolveColorToken(bblpSystem, 'colors.does.not.exist', 'light')
    ).toBeUndefined();
  });
});
