export interface ClientCourse {
  id: string;
  title: string;
  subtitle: string;
  iconUrl: string;
  coverUrl: string;

  isFree: boolean;
  requiredPlanCode?: string | null;
  unlocked?: boolean;

  modulesCount?: number;
  filesCount?:number;
}
