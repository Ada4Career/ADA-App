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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ResumeFormSectionProps } from '@/types/entities/cv.types';

const Skills = ({ form }: ResumeFormSectionProps) => {
  const t = useTranslations('Resume.Skills');
  const { control } = form;

  // Technical skills field array
  const {
    fields: technicalFields,
    append: appendTechnical,
    remove: removeTechnical,
    move: moveTechnical,
  } = useFieldArray({
    control,
    name: 'skills.technical',
  });

  // Research skills field array
  const {
    fields: researchFields,
    append: appendResearch,
    remove: removeResearch,
    move: moveResearch,
  } = useFieldArray({
    control,
    name: 'skills.research',
  });

  // Soft skills field array
  const {
    fields: softFields,
    append: appendSoft,
    remove: removeSoft,
    move: moveSoft,
  } = useFieldArray({
    control,
    name: 'skills.soft',
  });

  // Handle drag end for all skill lists
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    // Determine which skill list to update based on the droppable ID
    switch (result.type) {
      case 'technical-skills':
        moveTechnical(result.source.index, result.destination.index);
        break;
      case 'research-skills':
        moveResearch(result.source.index, result.destination.index);
        break;
      case 'soft-skills':
        moveSoft(result.source.index, result.destination.index);
        break;
      default:
        break;
    }
  };

  return (
    <div className='w-full space-y-6'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Technical Skills */}
        <Card>
          <CardHeader>
            <CardTitle>{t('technicalSkills')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Droppable
              droppableId='technical-skills-list'
              type='technical-skills'
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='space-y-3'
                >
                  {technicalFields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                          className={`flex items-center gap-2 ${
                            snapshot.isDragging ? 'opacity-60' : ''
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className='w-8 h-8 flex items-center justify-center cursor-grab'
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
                            name={`skills.technical.${index}`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <Input
                                    placeholder={t('technicalSkillPlaceholder')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {technicalFields.length > 1 && (
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() => removeTechnical(index)}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Button
              type='button'
              variant='outline'
              size='sm'
              className='flex items-center gap-1'
              onClick={() => appendTechnical('')}
            >
              <PlusCircle className='h-4 w-4' />
              {t('addTechnicalSkill')}
            </Button>
          </CardContent>
        </Card>

        {/* Research Skills */}
        <Card>
          <CardHeader>
            <CardTitle>{t('researchSkills')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Droppable
              droppableId='research-skills-list'
              type='research-skills'
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='space-y-3'
                >
                  {researchFields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                          className={`flex items-center gap-2 ${
                            snapshot.isDragging ? 'opacity-60' : ''
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className='w-8 h-8 flex items-center justify-center cursor-grab'
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
                            name={`skills.research.${index}`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <Input
                                    placeholder={t('researchSkillPlaceholder')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {researchFields.length > 1 && (
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() => removeResearch(index)}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Button
              type='button'
              variant='outline'
              size='sm'
              className='flex items-center gap-1'
              onClick={() => appendResearch('')}
            >
              <PlusCircle className='h-4 w-4' />
              {t('addResearchSkill')}
            </Button>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card>
          <CardHeader>
            <CardTitle>{t('softSkills')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Droppable droppableId='soft-skills-list' type='soft-skills'>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='space-y-3'
                >
                  {softFields.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                          className={`flex items-center gap-2 ${
                            snapshot.isDragging ? 'opacity-60' : ''
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className='w-8 h-8 flex items-center justify-center cursor-grab'
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
                            name={`skills.soft.${index}`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <Input
                                    placeholder={t('softSkillPlaceholder')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {softFields.length > 1 && (
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              onClick={() => removeSoft(index)}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Button
              type='button'
              variant='outline'
              size='sm'
              className='flex items-center gap-1'
              onClick={() => appendSoft('')}
            >
              <PlusCircle className='h-4 w-4' />
              {t('addSoftSkill')}
            </Button>
          </CardContent>
        </Card>
      </DragDropContext>
    </div>
  );
};

export default Skills;
