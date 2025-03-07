export type UserRole = 'jobseeker' | 'human_resources' | 'admin';

interface BaseUser {
  email: string;
  name: string;
  age: number;
  address: string;
  gender: string;
  role: UserRole;
}

interface JobSeekerData {
  skill: string;
  experiences: string;
  expectations: string;
  resume_url: string;
}

interface HumanResourceData {
  company: string;
  position: string;
}

export interface User<T = null> extends BaseUser {
  job_seeker_data?: T extends 'job_seeker' ? JobSeekerData : never;
  human_resource_data?: T extends 'human_resource' ? HumanResourceData : never;
}

export interface withToken {
  token: string;
}
