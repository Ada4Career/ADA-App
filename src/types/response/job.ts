export type JobType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'fixed_term'
  | 'casual';
export type WorkplaceType = 'remote' | 'hybrid' | 'on_site';
export type AccessibilityLevel = 'high' | 'medium' | 'standard';

export interface Accommodation {
  type: string;
  description: string;
}

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

  // Accessibility and inclusivity fields
  accessibility_level?: AccessibilityLevel;
  accommodations?: Accommodation[];
  disability_friendly?: boolean;
  inclusive_hiring_statement?: string;
}

export interface JobPostingWithApplicants extends JobPostingDataExtended {
  applicants?: JobApplicant[]; // Store all applicants for the job
  acceptedApplicant?: JobApplicant[]; // Store only accepted applicants
  rejectedApplicant?: JobApplicant[]; // Store only rejected applicants
  appliedApplicant?: JobApplicant[]; // Store only applied applicants
}

export type JobApplicant = {
  id: string;
  job_vacancy_id: string;
  job_seeker_email: string;
  job_score_id: string;
  status: 'applied' | 'reviewing' | 'rejected' | 'accepted'; // Add more statuses if needed
  applied_date: string; // Consider using Date if you want to handle it as a date object
  cover_letter: string;
  resume_url: string;
};

export interface ApplicantWithJobDetails extends JobApplicant {
  jobDetails?: JobPostingDataExtended;
}
