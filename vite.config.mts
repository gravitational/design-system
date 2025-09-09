import react from '@vitejs/plugin-react-swc';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [
    react({
      plugins: [['@ryanclark/swc-plugin-jsx-marker', {}]],
    }),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@chakra-ui/react/styled-system',
    ],
  },
};

export { config as default };
