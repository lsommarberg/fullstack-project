import { defineConfig } from '@chakra-ui/react';

export const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#a5bcf8' },
        secondary: { value: '#e9d5ff' },
        tertiary: { value: '#f3e8ff' },
        // tertiary: { value: '#bbf7d0' },

        dark: { value: '#000000' },
        light: { value: '#ffffff' },
      },
    },
    semanticTokens: {
      colors: {
        nav: {
          value: { base: '{colors.primary}', _dark: '{colors.dark}' },
        },
        text: {
          value: { base: '{colors.dark}', _dark: '{colors.light}' },
        },
        box: {
          value: { base: '{colors.secondary}', _dark: '{colors.dark}' },
        },
        secondaryBox: {
          value: { base: '{colors.tertiary}', _dark: '{colors.light}' },
        },
        secondaryBoxText: {
          value: { base: '{colors.dark}', _dark: '{colors.dark}' },
        },
        deleteButton: {
          value: { base: '#ff6b6b', _dark: '#B30000' },
        },
        cancelButton: {
          value: { base: '#4a5568', _dark: '#a0aec0' },
        },
        link: {
          value: { base: '#1A4670', _dark: '#3182ce' },
        },
      },
    },
  },
});
