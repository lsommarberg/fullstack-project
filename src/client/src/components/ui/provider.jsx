'use client';

import { ColorModeProvider } from './color-mode';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@/theme';

export function Provider(props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
