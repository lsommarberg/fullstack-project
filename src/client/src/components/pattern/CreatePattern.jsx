import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Input,
  Textarea,
  Box,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import SidebarLayout from '../layout/SidebarLayout';
import patternService from '../../services/pattern';
import { toaster } from '../ui/toaster';
import ImageManager from '../ImageManager';

const PatternForm = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleImageUpload = (uploadedImageUrl, fullResult) => {
    if (uploadedImageUrl === null) {
      return;
    }
    const newFile = {
      url: uploadedImageUrl,
      publicId: fullResult.publicId,
      uploadedAt: new Date(),
    };
    setFiles((prev) => [...prev, newFile]);
    toaster.success({
      description: 'Image uploaded successfully',
      duration: 3000,
    });
  };

  const handleImageDelete = (publicId) => {
    setFiles((prev) => prev.filter((file) => file.publicId !== publicId));
  };

  const handleImageError = (error) => {
    console.error('Image upload failed:', error);
    toaster.error({
      description: `Image upload failed: ${error}`,
      duration: 5000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tagsString
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    try {
      await patternService.createPattern({
        name,
        text,
        link,
        tags: tagsArray,
        notes,
        files: files,
      });
      toaster.success({
        description: 'Pattern created successfully',
        duration: 5000,
      });
      navigate(`/users/${id}`);
    } catch (error) {
      console.error('Error creating pattern:', error);
      toaster.error({ description: 'Error creating pattern', duration: 5000 });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <SidebarLayout userId={id}>
      <Box
        p={8}
        shadow="lg"
        borderWidth="1px"
        borderRadius="xl"
        bg="card.bg"
        color="fg.default"
      >
        <form onSubmit={handleSubmit}>
          <Fieldset.Root>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center" mb={2}>
                <Fieldset.Legend
                  fontSize="2xl"
                  fontWeight="bold"
                  color="fg.default"
                >
                  Create a New Pattern
                </Fieldset.Legend>
                <Fieldset.HelperText fontSize="md" color="fg.muted" mt={2}>
                  Add a new pattern to your collection with detailed
                  instructions
                </Fieldset.HelperText>
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <VStack spacing={4} align="stretch">
                  <Field label="Pattern Name" required>
                    <Input
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter a name for your pattern"
                      size="lg"
                      bg="input.bg"
                      color="fg.default"
                      borderColor="input.border"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </Field>

                  <Field label="Pattern Link (optional)">
                    <Input
                      name="link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Link to pattern source or website"
                      size="lg"
                      bg="input.bg"
                      color="fg.default"
                      borderColor="input.border"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </Field>

                  <Field
                    label="Tags (optional)"
                    helperText="Separate tags with commas (e.g., knitting, scarf, beginner)"
                  >
                    <Input
                      name="tags"
                      value={tagsString}
                      onChange={(e) => setTagsString(e.target.value)}
                      placeholder="Tags separated by commas"
                      size="lg"
                      bg="input.bg"
                      color="fg.default"
                      borderColor="input.border"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </Field>
                </VStack>
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Field label="Pattern Instructions" required>
                  <Textarea
                    name="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    minH="200px"
                    placeholder="Enter detailed pattern instructions, stitch counts, and step-by-step directions"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                  />
                </Field>
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Field helperText="Upload reference images, charts, or visual guides for your pattern">
                  <ImageManager
                    files={files}
                    headerText="Pattern Images"
                    showUpload={true}
                    showDelete={true}
                    type="patterns"
                    onImageUpload={handleImageUpload}
                    onImageDelete={handleImageDelete}
                    onUploadError={handleImageError}
                    buttonText="Upload Pattern Image"
                    userId={id}
                  />
                </Field>
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Field label="Additional Notes (optional)">
                  <Textarea
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    minH="120px"
                    placeholder="Add any additional notes, modifications, or personal reminders about this pattern"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                  />
                </Field>
              </Box>

              <HStack mt={8} spacing={4} justify="center">
                <Button
                  type="submit"
                  size="lg"
                  colorScheme="blue"
                  px={8}
                  py={6}
                  fontSize="md"
                  fontWeight="semibold"
                  data-testid="create-pattern-button"
                >
                  Create Pattern
                </Button>
                <Button
                  onClick={handleCancel}
                  size="lg"
                  px={8}
                  py={6}
                  fontSize="md"
                  bg={'cancelButton'}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </Fieldset.Root>
        </form>
      </Box>
    </SidebarLayout>
  );
};

export default PatternForm;
