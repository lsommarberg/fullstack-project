import { createSystem, defaultBaseConfig } from '@chakra-ui/react';

const customConfig = {
  styles: {
    global: {
      // Global styles applied to all components
      body: {
        bg: 'gray.50', // Background for the entire app
        color: 'gray.800', // Default text color
      },
      '.container': {
        bg: 'gray.100', // Default container background
        border: '1px solid',
        borderColor: 'gray.300', // Default border color
        borderRadius: 'md',
        padding: 4,
      },
    },
  },
};

export const system = createSystem(defaultBaseConfig, customConfig);
