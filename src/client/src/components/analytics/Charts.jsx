import { Box, Text, VStack, HStack } from '@chakra-ui/react';

const SimpleBarChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="fg.muted">No data available</Text>
      </Box>
    );
  }

  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.started || 0, item.finished || 0)),
  );

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        {title}
      </Text>
      <VStack spacing={3} align="stretch">
        {data.map((item, index) => {
          const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
          const label = `${monthNames[item._id.month - 1]} ${item._id.year}`;

          return (
            <VStack key={index} spacing={1} align="stretch">
              <Text fontSize="sm" fontWeight="medium">
                {label}
              </Text>
              <HStack spacing={2}>
                <Text fontSize="xs" minW="60px">
                  Started:
                </Text>
                <Box
                  flex="1"
                  height="8px"
                  bg="gray.200"
                  borderRadius="4px"
                  overflow="hidden"
                >
                  <Box
                    height="100%"
                    bg="blue.500"
                    width={`${(item.started / maxValue) * 100}%`}
                  />
                </Box>
                <Text fontSize="xs" minW="30px">
                  {item.started}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Text fontSize="xs" minW="60px">
                  Finished:
                </Text>
                <Box
                  flex="1"
                  height="8px"
                  bg="gray.200"
                  borderRadius="4px"
                  overflow="hidden"
                >
                  <Box
                    height="100%"
                    bg="green.500"
                    width={`${(item.finished / maxValue) * 100}%`}
                  />
                </Box>
                <Text fontSize="xs" minW="30px">
                  {item.finished}
                </Text>
              </HStack>
            </VStack>
          );
        })}
      </VStack>
    </Box>
  );
};

const SimpleProgressChart = ({ value, total, label }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <VStack spacing={2} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="medium">
          {label}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          {value}/{total} ({percentage}%)
        </Text>
      </HStack>
      <Box height="12px" bg="gray.200" borderRadius="6px" overflow="hidden">
        <Box
          height="100%"
          bg="green.500"
          width={`${percentage}%`}
          transition="width 0.3s ease"
        />
      </Box>
    </VStack>
  );
};

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <Box
      p={4}
      bg="section.bg"
      borderRadius="lg"
      border="1px solid"
      borderColor="section.border"
      shadow="sm"
    >
      <VStack spacing={2} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="sm" color="fg.muted" fontWeight="medium">
            {title}
          </Text>
          {icon && <Box color="fg.muted">{icon}</Box>}
        </HStack>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
        {subtitle && (
          <Text fontSize="sm" color="fg.muted">
            {subtitle}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export { SimpleBarChart, SimpleProgressChart, StatCard };

export default { SimpleBarChart, SimpleProgressChart, StatCard };
