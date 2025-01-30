import { createSystem, defaultBaseConfig } from '@chakra-ui/react';

const customConfig = {
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
      '.container': {
        bg: 'gray.100',
        border: '1px solid',
        borderColor: 'gray.300',
        borderRadius: 'md',
        padding: 4,
      },
    },
  },
};

export const system = createSystem(defaultBaseConfig, customConfig);
