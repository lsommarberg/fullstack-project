import { defineConfig } from '@chakra-ui/react';

export const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#a5bcf8' },
        secondary: { value: '#e9d5ff' },
        tertiary: { value: '#f3e8ff' },
        sectionLight: { value: '#f8f5ff' }, // Much lighter, better contrast
        // tertiary: { value: '#bbf7d0' },

        dark: { value: '#000000' },
        light: { value: '#ffffff' },
      },
    },
    semanticTokens: {
      colors: {
        'nav.bg': {
          value: { base: '{colors.primary}', _dark: '{colors.dark}' },
        },
        'card.bg': {
          value: { base: '{colors.secondary}', _dark: '{colors.dark}' },
        },
        'card.border': {
          value: { base: 'gray.200', _dark: 'gray.500' },
        },
        'input.bg': {
          value: { base: '{colors.tertiary}', _dark: 'gray.700' },
        },
        'input.border': {
          value: { base: 'gray.300', _dark: 'gray.500' },
        },

        'fg.default': {
          value: { base: '{colors.dark}', _dark: '{colors.light}' },
        },
        'fg.muted': {
          value: { base: 'gray.600', _dark: 'gray.400' },
        },
        deleteButton: {
          value: { base: '#ff6b6b', _dark: '#B30000' },
        },
        cancelButton: {
          value: { base: '#4a5568', _dark: '#a0aec0' },
        },
        'section.bg': {
          value: { base: 'white', _dark: 'gray.900' },
        },
        'section.border': {
          value: { base: 'gray.300', _dark: 'gray.600' },
        },
      },
    },
  },
});
