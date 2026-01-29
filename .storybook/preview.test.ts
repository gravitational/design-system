import type { IndexEntry } from 'storybook/internal/types';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./StorybookThemeProvider', () => ({
  StorybookThemeProvider: vi.fn(),
}));
vi.mock('./docs/DocsContainerWrapper', () => ({
  DocsContainerWrapper: vi.fn(),
}));
vi.mock('./docs/Story', () => ({
  DocsStory: vi.fn(),
}));
vi.mock('./themes', () => ({
  getThemes: () => ({}),
}));

const { default: preview } = await import('./preview');

const storySort = preview.parameters.options.storySort;

interface EntryOptions {
  title: string;
  type?: 'story' | 'docs';
  name?: string;
  tags?: string[];
}

function entry(options: EntryOptions | string): IndexEntry {
  const opts: EntryOptions =
    typeof options === 'string' ? { title: options } : options;
  const { title, type = 'docs', name, tags = [] } = opts;
  const parts = title.split('/');

  if (type === 'docs') {
    return {
      id: title.replace(/\s+/g, '-').toLowerCase(),
      importPath: '',
      storiesImports: [],
      title,
      type,
      name: name ?? parts[parts.length - 1],
      tags,
    };
  }

  return {
    id: title.replace(/\s+/g, '-').toLowerCase(),
    importPath: '',
    subtype: 'story',
    title,
    type,
    name: name ?? parts[parts.length - 1],
    tags,
  };
}

describe('storySort', () => {
  describe('Components category ordering', () => {
    it('should sort Layout before Buttons', () => {
      const layout = entry('Components/Layout/Box');
      const buttons = entry('Components/Buttons/Button');

      expect(storySort(layout, buttons)).toBeLessThan(0);
      expect(storySort(buttons, layout)).toBeGreaterThan(0);
    });

    it('should sort Layout before Forms', () => {
      const layout = entry('Components/Layout/Box');
      const forms = entry('Components/Forms/Input');

      expect(storySort(layout, forms)).toBeLessThan(0);
      expect(storySort(forms, layout)).toBeGreaterThan(0);
    });

    it('should sort Buttons before Forms', () => {
      const buttons = entry('Components/Buttons/Button');
      const forms = entry('Components/Forms/Input');

      expect(storySort(buttons, forms)).toBeLessThan(0);
      expect(storySort(forms, buttons)).toBeGreaterThan(0);
    });
  });

  describe('Guides category ordering', () => {
    it('should sort Introduction before Styling', () => {
      const intro = entry('Guides/Introduction');
      const styling = entry('Guides/Styling');

      expect(storySort(intro, styling)).toBeLessThan(0);
    });

    it('should sort Styling before Theming', () => {
      const styling = entry('Guides/Styling');
      const theming = entry('Guides/Theming');

      expect(storySort(styling, theming)).toBeLessThan(0);
    });
  });

  describe('top-level category ordering', () => {
    it('should sort Guides before Components', () => {
      const guides = entry('Guides/Introduction');
      const components = entry('Components/Layout/Box');

      expect(storySort(guides, components)).toBeLessThan(0);
      expect(storySort(components, guides)).toBeGreaterThan(0);
    });
  });

  describe('Components/Buttons ordering', () => {
    it('should sort Button before Close Button', () => {
      const button = entry('Components/Buttons/Button');
      const closeButton = entry('Components/Buttons/Close Button');

      expect(storySort(button, closeButton)).toBeLessThan(0);
      expect(storySort(closeButton, button)).toBeGreaterThan(0);
    });
  });

  describe('Docs entries', () => {
    it('should sort Docs before other story names within the same path', () => {
      const docs = entry({
        title: 'Components/Layout/Box',
        type: 'docs',
        name: 'Docs',
      });
      const story = entry({
        title: 'Components/Layout/Box',
        type: 'story',
        name: 'Example',
      });

      expect(storySort(docs, story)).toBeLessThan(0);
      expect(storySort(story, docs)).toBeGreaterThan(0);
    });
  });

  describe('attached-mdx vs unattached-mdx', () => {
    it('should sort Layout before Buttons even with different mdx attachment status', () => {
      const layout = entry({
        title: 'Components/Layout/Box',
        name: 'Docs',
        tags: ['dev', 'test', 'unattached-mdx'],
      });
      const buttons = entry({
        title: 'Components/Buttons/Button',
        name: 'Docs',
        tags: ['dev', 'test', 'attached-mdx'],
      });

      expect(storySort(layout, buttons)).toBeLessThan(0);
      expect(storySort(buttons, layout)).toBeGreaterThan(0);
    });

    it('should sort attached-mdx before unattached-mdx within the same subcategory', () => {
      const attached = entry({
        title: 'Components/Layout/Box',
        name: 'Docs',
        tags: ['dev', 'test', 'attached-mdx'],
      });
      const unattached = entry({
        title: 'Components/Layout/Center',
        name: 'Docs',
        tags: ['dev', 'test', 'unattached-mdx'],
      });

      // attached-mdx entries have name='Docs', unattached use path name
      // So attached should come first due to 'Docs' sorting
      expect(storySort(attached, unattached)).toBeLessThan(0);
      expect(storySort(unattached, attached)).toBeGreaterThan(0);
    });
  });
});
