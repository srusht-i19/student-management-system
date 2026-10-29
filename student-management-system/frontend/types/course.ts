export type CourseStatus = 'Active' | 'Inactive';

export interface Course {
  id: number;
  code: string;
  name: string;
  duration_years: number;
  description: string | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export type CourseInput = Omit<Course, 'id' | 'created_at' | 'updated_at' | 'description'> & {
  description?: string;
};
