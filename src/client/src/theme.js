import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : '#e3c2e7',
        color: props.colorMode === 'dark' ? '#e3c2e7' : 'gray.800',
      },
    }),
  },
});

export default theme;
