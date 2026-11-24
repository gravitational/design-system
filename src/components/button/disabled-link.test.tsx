import { ChakraProvider } from '@chakra-ui/react';
import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { system } from '../../themes/teleport';
import { ButtonSecondary } from './Button';
import { buttonRecipe } from './recipe';

describe('disabled link button (#47)', () => {
  it('stops pointer events while the control looks disabled', () => {
    expect(buttonRecipe.base._disabled).toMatchObject({
      pointerEvents: 'none',
    });
  });

  it('keeps the href but drops a disabled anchor out of the tab order', () => {
    let seen: Record<string, unknown> = {};

    function Anchor(props: Record<string, unknown>) {
      seen = props;
      return createElement('a', props, props.children as ReactNode);
    }

    const html = renderToStaticMarkup(
      createElement(
        ChakraProvider,
        { value: system },
        createElement(
          ButtonSecondary,
          { asChild: true, disabled: true },
          createElement(Anchor, { href: 'https://goteleport.com' }, 'disabled'),
        ),
      ),
    );

    expect(html).toContain('href="https://goteleport.com"');
    expect(seen.tabIndex).toBe(-1);
    expect(seen['aria-disabled']).toBe(true);
    expect(typeof seen.onClick).toBe('function');

    const event = {
      preventDefault: () => {
        event.defaultPrevented = true;
      },
      defaultPrevented: false,
    };
    (seen.onClick as (event: typeof event) => void)(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
