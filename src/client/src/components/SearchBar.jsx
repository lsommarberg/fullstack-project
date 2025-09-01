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
              >
                Clear Search
              </Button>
              <Button
                type="submit"
                variant="primary"
                data-testid="projects-search-button"
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
