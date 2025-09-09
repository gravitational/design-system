declare module 'eslint-plugin-react-hooks' {
  export const plugin: {
    meta: {
      name: string;
    };
    configs: {
      recommended: {
        rules: Record<string, string>;
      };
    };
  };

  export default plugin;
}
