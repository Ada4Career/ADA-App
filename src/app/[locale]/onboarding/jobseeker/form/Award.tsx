import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
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

const Awards = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.Awards');
  const { control } = form;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'awards',
  });

  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // Moved to the same position
    if (result.destination.index === result.source.index) {
      return;
    }

    // Move the item in the field array
    move(result.source.index, result.destination.index);
  };

  return (
    <div className='w-full space-y-6'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='awards-items'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='space-y-6'
            >
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'opacity-60' : ''}`}
                      style={provided.draggableProps.style}
                    >
                      <Card className='w-full'>
                        <CardHeader className='flex flex-row items-center justify-between pb-2'>
                          {/* Drag Handle */}
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
                              {t('award')} #{index + 1}
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
                          {/* Award Title */}
                          <FormField
                            control={control}
                            name={`awards.${index}.title`}
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

                          {/* Issuer */}
                          <FormField
                            control={control}
                            name={`awards.${index}.issuer`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('issuer')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('issuerPlaceholder')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Date */}
                          <FormField
                            control={control}
                            name={`awards.${index}.date`}
                            render={({
                              field: { value, onChange, ...field },
                            }) => (
                              <FormItem>
                                <FormLabel>{t('date')}</FormLabel>
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
                                    onChange={(e) => onChange(e.target.value)}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Description */}
                          <FormField
                            control={control}
                            name={`awards.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('description')}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t('descriptionPlaceholder')}
                                    className='min-h-24'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
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
            issuer: '',
            date: '',
            description: '',
          })
        }
      >
        {t('addAward')}
      </Button>
    </div>
  );
};

export default Awards;
