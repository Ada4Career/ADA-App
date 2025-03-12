export type JobType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'fixed_term'
  | 'casual';
export type WorkplaceType = 'remote' | 'hybrid' | 'on_site';

export interface JobPostingData {
  id: string;
  email: string;
  division: string;
  job_type: JobType; // Add more types if needed
  workplace_type: WorkplaceType; // Assuming these are the possible values
  start_date: string; // ISO date format (YYYY-MM-DD)
  end_date: string; // ISO date format (YYYY-MM-DD)
  responsibilities: string;
  qualification: string;
  additionalImageUrl: string;
}

export interface JobPostingDataExtended extends JobPostingData {
  // Added dummy data fields
  company?: string;
  department?: string;
  stage?: string;
  location?: string;
  experience?: string;
  logo?: string;
  match_percentage?: number;
  posted_time?: string;
}
