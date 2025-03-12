import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Helper function to generate random location
export function getRandomLocation() {
  const locations = [
    'New York, NY',
    'San Francisco, CA',
    'Seattle, WA',
    'Austin, TX',
    'Boston, MA',
    'Chicago, IL',
    'Los Angeles, CA',
    'Denver, CO',
    'Miami, FL',
    'Portland, OR',
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

// Helper function to generate random experience
export function getRandomExperience() {
  const experiences = [
    '1+ years exp',
    '2+ years exp',
    '3-5 years exp',
    '5+ years exp',
    'Entry level',
    'Mid-level',
    'Senior level',
  ];
  return experiences[Math.floor(Math.random() * experiences.length)];
}

// Helper function to generate random company
export function getRandomCompany() {
  const companies = [
    'TechCorp',
    'InnovateSoft',
    'DataSphere',
    'CloudNine',
    'PixelPerfect',
    'CodeCraft',
    'ByteWorks',
    'NexGen Solutions',
    'Quantum Tech',
    'FutureSystems',
  ];
  return companies[Math.floor(Math.random() * companies.length)];
}

// Helper function to generate random stage
export function getRandomStage() {
  const stages = [
    'Early Stage',
    'Growing',
    'Established',
    'Scaling',
    'Enterprise',
  ];
  return stages[Math.floor(Math.random() * stages.length)];
}
