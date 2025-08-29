import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from '@chakra-ui/react';

const inputRecipe = defineRecipe({
  base: {
    size: 'lg',
    bg: 'input.bg',
    color: 'fg.default',
    borderColor: 'input.border',
    borderWidth: '1px',
    _focus: {
      borderColor: '{colors.input.borderFocus}',
      boxShadow: '0 0 0 1px {colors.input.borderFocus}',
    },
  },
});

const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'semibold',
    fontSize: 'md',
    borderRadius: 'lg',
    px: 6,
    py: 4,
    transition: 'background 0.2s ease, box-shadow 0.2s ease',
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  variants: {
    variant: {
      primary: {
        bg: 'primaryButton',
        color: 'primaryButtonText',
        _hover: { bg: 'blue.500' },
        _active: { bg: 'blue.700' },
        _focusVisible: { boxShadow: '0 0 0 3px #93c5fd' },
      },
      secondary: {
        bg: 'secondaryButton',
        color: 'secondaryButtonText',
        _hover: { bg: 'blue.400' },
        _active: { bg: 'blue.600' },
        _focusVisible: { boxShadow: '0 0 0 3px #bfdbfe' },
      },
      cancel: {
        bg: 'cancelButton',
        color: 'white',
        _hover: { bg: 'gray.600' },
        _active: { bg: 'gray.700' },
        _focusVisible: { boxShadow: '0 0 0 3px #cbd5e1' },
      },
      delete: {
        bg: 'deleteButton',
        color: 'white',
        _hover: { bg: 'red.600' },
        _active: { bg: 'red.700' },
        _focusVisible: { boxShadow: '0 0 0 3px #fecaca' },
      },
      ghost: {
        bg: 'transparent',
        color: 'fg.default',
        _hover: { bg: 'section.bg' },
        _active: { bg: 'blue.100' },
        _focusVisible: { boxShadow: '0 0 0 2px #cbd5e1' },
      },
    },
  },
  defaultVariant: 'primary',
});

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '#8cbffcff' },
        secondary: { value: '#68a0eeff' },
        tertiary: { value: '#CDE5FE' },
        sectionLight: { value: '#f1f5f9' },
        dark: { value: '#0f172a' },
        light: { value: '#ffffff' },
      },
    },
    semanticTokens: {
      colors: {
        'nav.bg': {
          value: { base: '{colors.primary}', _dark: '{colors.dark}' },
        },
        'card.bg': {
          value: { base: '{colors.tertiary}', _dark: '{colors.dark}' },
        },
        'card.border': {
          value: { base: '{colors.blue.200}', _dark: '{colors.blue.700}' },
        },
        'input.bg': {
          value: { base: '#eff6ff', _dark: '{colors.blue.900}' },
        },
        'input.border': {
          value: { base: '{colors.blue.400}', _dark: '{colors.blue.700}' },
        },
        'input.borderFocus': {
          value: { base: '{colors.blue.600}', _dark: '{colors.blue.400}' },
        },
        'fg.default': {
          value: { base: '{colors.dark}', _dark: '{colors.light}' },
        },
        'fg.muted': {
          value: { base: '{colors.blue.700}', _dark: '{colors.blue.200}' },
        },
        primaryButton: {
          value: { base: '#2563eb', _dark: '#60a5fa' },
        },
        primaryButtonText: {
          value: { base: '#ffffff', _dark: '#0f172a' },
        },
        secondaryButton: {
          value: { base: '#60a5fa', _dark: '#2563eb' },
        },
        secondaryButtonText: {
          value: { base: '#0f172a', _dark: '#ffffff' },
        },
        deleteButton: {
          value: { base: '#ef4444', _dark: '#b91c1c' },
        },
        cancelButton: {
          value: { base: '#64748b', _dark: '#334155' },
        },
        'section.bg': {
          value: { base: '{colors.sectionLight}', _dark: '{colors.dark}' },
        },
        'section.border': {
          value: { base: '{colors.blue.200}', _dark: '{colors.blue.700}' },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
