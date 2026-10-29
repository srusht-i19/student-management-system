export type TeacherStatus = 'Active' | 'Inactive';

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department: string;
  designation: string;
  status: TeacherStatus;
  created_at: string;
  updated_at: string;
}

export type TeacherInput = Omit<Teacher, 'id' | 'created_at' | 'updated_at' | 'phone'> & {
  phone?: string;
};
