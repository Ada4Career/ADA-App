import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { PlusCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { ResumeFormSectionProps } from '@/types/entities/cv.types';

const Experience = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.Experience');
  const { control } = form;

  // Main experience field array
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experience',
  });

  // Function to handle adding a responsibility to a specific experience
  const handleAddResponsibility = (experienceIndex: number) => {
    const currentResponsibilities =
      form.getValues(`experience.${experienceIndex}.responsibilities`) || [];
    form.setValue(`experience.${experienceIndex}.responsibilities`, [
      ...currentResponsibilities,
      '',
    ]);
  };

  // Function to handle removing a responsibility
  const handleRemoveResponsibility = (
    experienceIndex: number,
    responsibilityIndex: number
  ) => {
    const currentResponsibilities =
      form.getValues(`experience.${experienceIndex}.responsibilities`) || [];
    const updatedResponsibilities = currentResponsibilities.filter(
      (_, i) => i !== responsibilityIndex
    );
    form.setValue(
      `experience.${experienceIndex}.responsibilities`,
      updatedResponsibilities
    );
  };

  // Function to handle reordering responsibilities within an experience
  const handleReorderResponsibilities = (
    experienceIndex: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const currentResponsibilities =
      form.getValues(`experience.${experienceIndex}.responsibilities`) || [];

    const reorderedResponsibilities = [...currentResponsibilities];
    const [removed] = reorderedResponsibilities.splice(sourceIndex, 1);
    reorderedResponsibilities.splice(destinationIndex, 0, removed);

    form.setValue(
      `experience.${experienceIndex}.responsibilities`,
      reorderedResponsibilities
    );
  };

  // Handle drag end for experience items and responsibilities
  const handleExperienceDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    // Handle experience reordering
    if (result.type === 'experience') {
      move(result.source.index, result.destination.index);
      return;
    }

    // Handle responsibility reordering
    if (result.type.startsWith('responsibility-')) {
      // Extract experienceIndex from the type (format: "responsibility-{experienceIndex}")
      const experienceIndex = parseInt(result.type.split('-')[1], 10);

      handleReorderResponsibilities(
        experienceIndex,
        result.source.index,
        result.destination.index
      );
    }
  };

  return (
    <div className='w-full space-y-6'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>

      <DragDropContext onDragEnd={handleExperienceDragEnd}>
        <Droppable droppableId='experience-items' type='experience'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='space-y-6'
            >
              {fields.map((field, index) => {
                // Need to get responsibilities for this experience
                const watchedResponsibilities = form.watch(
                  `experience.${index}.responsibilities`
                ) || [''];

                return (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? 'opacity-60' : ''}`}
                        style={provided.draggableProps.style}
                      >
                        <Card className='w-full'>
                          <CardHeader className='flex flex-row items-center justify-between pb-2'>
                            <div className='flex items-center'>
                              <div
                                {...provided.dragHandleProps}
                                className='w-8 h-8 mr-2 flex items-center justify-center cursor-grab'
                              >
                                {/* Drag handle dots */}
                                <div className='flex flex-col space-y-1'>
                                  <div className='flex space-x-1'>
                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                  </div>
                                  <div className='flex space-x-1'>
                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                  </div>
                                  <div className='flex space-x-1'>
                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                  </div>
                                </div>
                              </div>
                              <CardTitle className='text-md'>
                                {t('experience')} #{index + 1}
                              </CardTitle>
                            </div>
                            {fields.length > 1 && (
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                onClick={() => remove(index)}
                              >
                                {t('remove')}
                              </Button>
                            )}
                          </CardHeader>
                          <CardContent className='space-y-4'>
                            {/* Job Title */}
                            <FormField
                              control={control}
                              name={`experience.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('title')}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t('titlePlaceholder')}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Company */}
                            <FormField
                              control={control}
                              name={`experience.${index}.company`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('company')}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t('companyPlaceholder')}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className='grid grid-cols-2 gap-4'>
                              {/* Start Date */}
                              <FormField
                                control={control}
                                name={`experience.${index}.start_date`}
                                render={({
                                  field: { value, onChange, ...field },
                                }) => (
                                  <FormItem>
                                    <FormLabel>{t('startDate')}</FormLabel>
                                    <FormControl>
                                      <Input
                                        type='date'
                                        value={
                                          value
                                            ? new Date(value)
                                                .toISOString()
                                                .split('T')[0]
                                            : ''
                                        }
                                        onChange={(e) =>
                                          onChange(e.target.value)
                                        }
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* End Date */}
                              <FormField
                                control={control}
                                name={`experience.${index}.end_date`}
                                render={({
                                  field: { value, onChange, ...field },
                                }) => (
                                  <FormItem>
                                    <FormLabel>{t('endDate')}</FormLabel>
                                    <FormControl>
                                      <Input
                                        type='date'
                                        value={
                                          value
                                            ? new Date(value)
                                                .toISOString()
                                                .split('T')[0]
                                            : ''
                                        }
                                        onChange={(e) =>
                                          onChange(e.target.value)
                                        }
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {/* Responsibilities */}
                            <div className='space-y-3'>
                              <FormLabel>{t('responsibilities')}</FormLabel>

                              {/* Use a unique type for each experience's responsibilities droppable */}
                              <Droppable
                                droppableId={`responsibilities-${index}`}
                                type={`responsibility-${index}`}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className='space-y-3'
                                  >
                                    {watchedResponsibilities.map(
                                      (_, respIndex) => (
                                        <Draggable
                                          key={`${field.id}-resp-${respIndex}`}
                                          draggableId={`${field.id}-resp-${respIndex}`}
                                          index={respIndex}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              style={
                                                provided.draggableProps.style
                                              }
                                              className={`flex gap-2 ${
                                                snapshot.isDragging
                                                  ? 'opacity-60'
                                                  : ''
                                              }`}
                                            >
                                              <div
                                                {...provided.dragHandleProps}
                                                className='w-8 h-10 flex items-center justify-center cursor-grab self-start mt-3'
                                              >
                                                {/* Drag handle dots */}
                                                <div className='flex flex-col space-y-1'>
                                                  <div className='flex space-x-1'>
                                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                                  </div>
                                                  <div className='flex space-x-1'>
                                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                                  </div>
                                                  <div className='flex space-x-1'>
                                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                                    <div className='w-1 h-1 bg-gray-400 rounded-full'></div>
                                                  </div>
                                                </div>
                                              </div>

                                              <FormField
                                                control={control}
                                                name={`experience.${index}.responsibilities.${respIndex}`}
                                                render={({ field }) => (
                                                  <FormItem className='flex-1'>
                                                    <FormControl>
                                                      <Textarea
                                                        placeholder={t(
                                                          'responsibilityPlaceholder'
                                                        )}
                                                        className='resize-none'
                                                        {...field}
                                                      />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                )}
                                              />

                                              {watchedResponsibilities.length >
                                                1 && (
                                                <Button
                                                  type='button'
                                                  variant='ghost'
                                                  size='icon'
                                                  onClick={() =>
                                                    handleRemoveResponsibility(
                                                      index,
                                                      respIndex
                                                    )
                                                  }
                                                  className='self-start mt-3'
                                                >
                                                  <X className='h-4 w-4' />
                                                </Button>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>

                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                className='flex items-center gap-1'
                                onClick={() => handleAddResponsibility(index)}
                              >
                                <PlusCircle className='h-4 w-4' />
                                {t('addResponsibility')}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type='button'
        variant='outline'
        className='w-full'
        onClick={() =>
          append({
            title: '',
            company: '',
            start_date: '',
            end_date: '',
            responsibilities: [''],
          })
        }
      >
        {t('addExperience')}
      </Button>
    </div>
  );
};

export default Experience;
