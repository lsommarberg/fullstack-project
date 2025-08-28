import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { SimpleBarChart, SimpleProgressChart, StatCard } from './Charts';
import analyticsService from '../../services/analytics';

const UserAnalytics = ({ userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAnalytics(userId);
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
        <Text mt={4}>Loading analytics...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        p={4}
        bg="red.50"
        borderColor="red.200"
        borderWidth={1}
        borderRadius="md"
        color="red.800"
      >
        {error}
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box
        p={4}
        bg="blue.50"
        borderColor="blue.200"
        borderWidth={1}
        borderRadius="md"
        color="blue.800"
      >
        No analytics data available
      </Box>
    );
  }

  const formatDuration = (days) => {
    if (days < 1) return '< 1 day';
    if (days < 7) {
      const roundedDays = Math.round(days);
      return roundedDays === 1 ? '1 day' : `${roundedDays} days`;
    }
    if (days < 30) {
      const roundedWeeks = Math.round(days / 7);
      return roundedWeeks === 1 ? '1 week' : `${roundedWeeks} weeks`;
    }
    const roundedMonths = Math.round(days / 30);
    return roundedMonths === 1 ? '1 month' : `${roundedMonths} months`;
  };

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Analytics & Statistics
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <StatCard
          title="Total Projects"
          value={analytics.currentProjects.total}
          subtitle={`${analytics.currentProjects.inProgress} in progress`}
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate.percentage}%`}
          subtitle={`${analytics.completionRate.completed} completed`}
        />
        <StatCard
          title="Recent Activity (30d)"
          value={analytics.recentActivity.projectsStarted}
          subtitle="projects started"
        />
        <StatCard
          title="Average Duration"
          value={
            analytics.averageDuration.count > 0
              ? formatDuration(analytics.averageDuration.avgDuration)
              : 'N/A'
          }
          subtitle={
            analytics.averageDuration.count > 0
              ? `${analytics.averageDuration.count} completed projects`
              : 'No completed projects'
          }
        />
      </SimpleGrid>

      <Box
        p={6}
        bg="section.bg"
        borderRadius="lg"
        border="1px solid"
        borderColor="section.border"
        shadow="sm"
      >
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Project Progress
        </Text>
        <SimpleProgressChart
          value={analytics.completionRate.completed}
          total={analytics.completionRate.total}
          label="Overall Completion Rate"
        />
      </Box>

      {analytics.activityByMonth.length > 0 && (
        <Box
          p={6}
          bg="section.bg"
          borderRadius="lg"
          border="1px solid"
          borderColor="section.border"
          shadow="sm"
        >
          <SimpleBarChart
            data={analytics.activityByMonth}
            title="Activity Over Time (Last 12 Months)"
          />
        </Box>
      )}

      {analytics.mostUsedPatterns.length > 0 && (
        <Box
          p={6}
          bg="section.bg"
          borderRadius="lg"
          border="1px solid"
          borderColor="section.border"
          shadow="sm"
        >
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Most Used Patterns
          </Text>
          <VStack spacing={3} align="stretch">
            {analytics.mostUsedPatterns.slice(0, 5).map((pattern, index) => (
              <HStack key={pattern.patternId} justify="space-between">
                <Text fontSize="md">{pattern.patternName}</Text>
                <HStack>
                  <Text fontSize="sm" color="fg.muted">
                    {pattern.projectCount} project
                    {pattern.projectCount !== 1 ? 's' : ''}
                  </Text>
                  <Box
                    w={`${
                      (pattern.projectCount /
                        analytics.mostUsedPatterns[0].projectCount) *
                      100
                    }px`}
                    h="4px"
                    bg="blue.500"
                    borderRadius="2px"
                    minW="20px"
                  />
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}

      <Box
        p={6}
        bg="section.bg"
        borderRadius="lg"
        border="1px solid"
        borderColor="section.border"
        shadow="sm"
      >
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Recent Activity (Last 30 Days)
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {analytics.recentActivity.projectsStarted}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Projects Started
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {analytics.recentActivity.projectsCompleted}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Projects Completed
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              {analytics.recentActivity.patternsCreated}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Patterns Created
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>

      {analytics.averageDuration.count > 0 && (
        <Box
          p={6}
          bg="section.bg"
          borderRadius="lg"
          border="1px solid"
          borderColor="section.border"
          shadow="sm"
        >
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Project Duration Statistics
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <VStack>
              <Text fontSize="xl" fontWeight="bold">
                {formatDuration(analytics.averageDuration.avgDuration)}
              </Text>
              <Text fontSize="sm" color="fg.muted">
                Average Duration
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="xl" fontWeight="bold">
                {formatDuration(analytics.averageDuration.minDuration)}
              </Text>
              <Text fontSize="sm" color="fg.muted">
                Fastest Completion
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="xl" fontWeight="bold">
                {formatDuration(analytics.averageDuration.maxDuration)}
              </Text>
              <Text fontSize="sm" color="fg.muted">
                Longest Duration
              </Text>
            </VStack>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

export default UserAnalytics;
