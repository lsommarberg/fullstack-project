import { Stack, Text, Flex, Card, Input, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';

const ListPage = ({
  userId,
  title,
  items = [],
  searchPlaceholder = 'Search...',
  createButtonText = 'Create New',
  createPath,
  onCreateClick,
  renderItem,
  getItemPath,
  isLoading = false,
  emptyStateText = 'No items yet',
}) => {
  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    }
  };

  return (
    <SidebarLayout userId={userId}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {title}
      </Text>
      <Flex mb={4} justify="space-between" align="center">
        <Input placeholder={searchPlaceholder} size="md" width="60%" />
        {(createPath || onCreateClick) && (
          <Button
            as={createPath ? RouterLink : undefined}
            to={createPath}
            onClick={onCreateClick ? handleCreateClick : undefined}
          >
            {createButtonText}
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : items.length === 0 ? (
          <Text>{emptyStateText}</Text>
        ) : (
          items.map((item, index) => (
            <Card.Root
              key={item.id || index}
              variant="outline"
              bg="card.bg"
              color="fg.default"
              as={getItemPath ? RouterLink : undefined}
              to={getItemPath ? getItemPath(item) : undefined}
            >
              <Card.Body>
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">
                      {item.name || item.title}
                    </Text>
                  </Flex>
                )}
              </Card.Body>
            </Card.Root>
          ))
        )}
      </Stack>
    </SidebarLayout>
  );
};

export default ListPage;
