export interface CourseProgress {
    courseId: string;
    title: string;
    iconUrl: string;
    totalModules: number;
    completedModules: number;
    progressPercentage: number;
}