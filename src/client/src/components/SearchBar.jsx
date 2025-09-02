import {
  Input,
  Button,
  HStack,
  Flex,
  VStack,
  Fieldset,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { useState } from 'react';

/**
 * Search and filter component for projects and patterns with advanced filtering options.
 * Provides text search, date range filtering, and status-based filtering capabilities.
 * Includes collapsible advanced filters for date ranges and project completion status.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.searchQuery - Current search query text
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {Function} props.handleSearch - Function to execute search with current filters
 * @param {string} props.startedAfter - Start date filter (after this date)
 * @param {Function} props.setStartedAfter - Function to update start date filter
 * @param {string} props.startedBefore - Start date filter (before this date)
 * @param {Function} props.setStartedBefore - Function to update start date filter
 * @param {string} props.finishedAfter - Finish date filter (after this date)
 * @param {Function} props.setFinishedAfter - Function to update finish date filter
 * @param {string} props.finishedBefore - Finish date filter (before this date)
 * @param {Function} props.setFinishedBefore - Function to update finish date filter
 * @param {Object} props.status - Current status filter object with value property
 * @param {Function} props.handleClearSearch - Function to reset all search filters
 * @param {string} props.placeHolderText - Placeholder text for search input
 * @param {string} props.labelText - Label text for search input field
 * @returns {JSX.Element} Search form with text input and optional advanced filters
 */
const SearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  startedAfter,
  setStartedAfter,
  startedBefore,
  setStartedBefore,
  finishedAfter,
  setFinishedAfter,
  finishedBefore,
  setFinishedBefore,
  status,
  handleClearSearch,
  placeHolderText = 'Search projects...',
  labelText = 'Search Projects',
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <Flex mb={4} w="full" align="center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        style={{ width: '100%' }}
      >
        <Fieldset.Root>
          <VStack align="stretch" spacing={4}>
            <Field label={labelText}>
              <Input
                placeholder={placeHolderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                variant="input"
              />
            </Field>
            {status.value !== 'pattern' && (
              <>
                <Button
                  variant="ghost"
                  borderColor={'section.border'}
                  size="sm"
                  alignSelf="flex-start"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  mb={2}
                >
                  {showAdvanced
                    ? 'Hide Advanced Filters'
                    : 'Show Advanced Filters'}
                </Button>
                {showAdvanced && (
                  <>
                    <HStack spacing={4}>
                      <Field label="Started Between">
                        <HStack>
                          <Input
                            type="date"
                            value={startedAfter}
                            onChange={(e) => setStartedAfter(e.target.value)}
                            borderColor={'input.border'}
                            data-testid="started-after-input"
                          />
                          <Input
                            type="date"
                            value={startedBefore}
                            onChange={(e) => setStartedBefore(e.target.value)}
                            borderColor={'input.border'}
                            data-testid="started-before-input"
                          />
                        </HStack>
                      </Field>
                    </HStack>

                    {status.value !== 'inprogress' && (
                      <HStack spacing={4}>
                        <Field label="Finished Between">
                          <HStack>
                            <Input
                              type="date"
                              value={finishedAfter}
                              onChange={(e) => setFinishedAfter(e.target.value)}
                              borderColor={'input.border'}
                              data-testid="finished-after-input"
                            />
                            <Input
                              type="date"
                              value={finishedBefore}
                              onChange={(e) =>
                                setFinishedBefore(e.target.value)
                              }
                              borderColor={'input.border'}
                              data-testid="finished-before-input"
                            />
                          </HStack>
                        </Field>
                      </HStack>
                    )}
                  </>
                )}
              </>
            )}

            <HStack spacing={4} justify="flex-end">
              <Button
                variant="ghost"
                borderColor={'section.border'}
                onClick={handleClearSearch}
                aria-label="Clear search filters"
              >
                Clear Search
              </Button>
              <Button
                type="submit"
                variant="primary"
                data-testid="projects-search-button"
                aria-label="Search projects"
              >
                Search
              </Button>
            </HStack>
          </VStack>
        </Fieldset.Root>
      </form>
    </Flex>
  );
};

export default SearchBar;
