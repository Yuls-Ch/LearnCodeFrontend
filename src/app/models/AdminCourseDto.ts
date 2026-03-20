export interface AdminCourseDto {
  id: string;            
  title: string;
  subtitle: string;
  description: string;
  iconUrl: string;
  coverUrl: string;
  free: boolean;
  requiredPlanCode: string | null;
  published: boolean;
  createdAt: string;        
}
