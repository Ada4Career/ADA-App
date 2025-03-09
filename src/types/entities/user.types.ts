export type UserRole = 'jobseeker' | 'human_resources' | 'admin';

interface HumanResourceData {
  company: string;
  position: string;
}

interface JobSeekerData {
  skill: string;
  experiences: string;
  expectations: string;
  resume_url: string;
}

type Role = 'human_resources' | 'jobseeker';

export interface UserInterface {
  email: string;
  password: string;
  name: string;
  age: number;
  address: string;
  gender: string;
  role: Role[];
  human_resource_data?: HumanResourceData;
  job_seeker_data?: JobSeekerData;
}

export interface withToken {
  token: string;
}
