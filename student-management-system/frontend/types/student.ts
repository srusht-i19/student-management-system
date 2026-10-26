export type Gender = 'Male' | 'Female' | 'Other';
export type StudentStatus = 'Active' | 'Inactive';

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string;
  gender: Gender;
  course: string;
  year: number;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export type StudentInput = Omit<Student, 'id' | 'created_at' | 'updated_at' | 'phone'> & {
  phone?: string;
};
