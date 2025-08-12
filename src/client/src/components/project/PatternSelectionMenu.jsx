import { Button, Menu } from '@chakra-ui/react';

export const PatternMenu = ({
  onPatternSelect,
  patterns,
  selectedPatternName,
}) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          bg="input.bg"
          width="100%"
          borderRadius="md"
          p={4}
          border="1px solid"
          borderColor="input.border"
          color="fg.default"
        >
          {selectedPatternName || 'Select a pattern'}
        </Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item onClick={() => onPatternSelect('', '')} value="">
            No pattern
          </Menu.Item>
          {patterns.map((pattern) => (
            <Menu.Item
              key={pattern.id}
              onClick={() => onPatternSelect(pattern.id, pattern.name)}
              value={pattern.id}
            >
              {pattern.name}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
