import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Personal Info Schema
export const personalInfoSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  contact_info: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(5, 'Invalid phone number'),
    address: z.string().min(5, 'Invalid address'),
    linkedin: z.string().url('Invalid LinkedIn URL'),
  }),
  summary_objective: z
    .string()
    .min(10, 'Summary/Objective should be at least 10 characters'),
});

// Education Schema
export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name too short'),
  degree: z.string().min(2, 'Degree name too short'),
  field_of_study: z.string().min(2, 'Field of study too short'),
  start_date: z.string().min(1, 'Start date required'),
  end_date: z.string().min(1, 'End date required'),
  gpa: z.string().optional(), // optional because sometimes people don't include GPA
});

// Experience Schema
export const experienceSchema = z.object({
  title: z.string().min(2, 'Title too short'),
  company: z.string().min(2, 'Company name too short'),
  start_date: z.string().min(1, 'Start date required'),
  end_date: z.string().min(1, 'End date required'),
  responsibilities: z.array(
    z.string().min(1, 'Responsibility cannot be empty')
  ),
});

// Skills Schema
export const skillsSchema = z.object({
  technical: z.array(z.string().min(1, 'Technical skill required')),
  research: z.array(z.string().min(1, 'Research skill required')),
  soft: z.array(z.string().min(1, 'Soft skill required')),
});

// Resume Schema (the full form)
export const resumeSchema = z.object({
  personal_info: personalInfoSchema,
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: skillsSchema,
});

// Types from schema
export type ResumeData = z.infer<typeof resumeSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type SkillsData = z.infer<typeof skillsSchema>;

// Props for react-hook-form
export interface ResumeFormSectionProps {
  form: UseFormReturn<ResumeData>;
}
