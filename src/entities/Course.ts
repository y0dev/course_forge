export interface LessonStep {
  title: string;
  content: string; // HTML content
}

export interface Lesson {
  id: string;
  title: string;
  course: string;
  isTemplate: boolean; 
  estimatedTime: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number; // 0-100
  steps: LessonStep[];
  slug: string;
  content?: string; // Legacy markdown content
}

export type QuestionType = "multiple_choice" | "fill_in_blank" | "other";

export interface Question {
  _id?: string; // mongoose.Types.ObjectId as string
  type: 'multiple-choice' | 'fill-in-the-blank' | 'other';
  prompt: string;
  options?: string[]; // for multiple-choice
  answer: string | string[]; // string for fill-in, string[] for multiple correct
  explanation?: string;
  sectionId: string; // reference to the section the question belongs to
}

export interface Section {
  id: string;
  title: string;
  slug: string;
  lessons: Lesson[];
  questions?: Question[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimatedCourseTime: number;
  category: "Beginner" | "Intermediate" | "Advanced";
  author: string;
  tags: string[];
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  isFree: boolean;
  recommended: boolean;
}

class CourseService {
  private storageKey = 'course_forge_courses';

  private getCoursesFromStorage(): Course[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading courses from localStorage:', error);
      return [];
    }
  }

  private saveCoursesToStorage(courses: Course[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving courses to localStorage:', error);
    }
  }

  async list(sortBy?: string): Promise<Course[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const courses = this.getCoursesFromStorage();
    
    return courses.sort((a, b) => {
      if (sortBy === "-updated_date") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });
  }

  async create(courseData: Partial<Course>): Promise<Course> {
    const courses = this.getCoursesFromStorage();
    
    const course: Course = {
      id: Date.now().toString(),
      title: courseData.title || "",
      slug: courseData.slug || "",
      description: courseData.description || "",
      estimatedCourseTime: courseData.estimatedCourseTime || 15,
      category: courseData.category || "Beginner",
      author: courseData.author || "Anonymous",
      tags: courseData.tags || [],
      sections: courseData.sections || [],
      isFree: courseData.isFree || true,  
      recommended: courseData.recommended || false, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    courses.push(course);
    this.saveCoursesToStorage(courses);
    return course;
  }

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    const courses = this.getCoursesFromStorage();
    const index = courses.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error("Course not found");
    }

    courses[index] = {
      ...courses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveCoursesToStorage(courses);
    return courses[index];
  }

  async delete(id: string): Promise<void> {
    const courses = this.getCoursesFromStorage();
    const index = courses.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error("Course not found");
    }

    courses.splice(index, 1);
    this.saveCoursesToStorage(courses);
  }

  async getById(id: string): Promise<Course | null> {
    const courses = this.getCoursesFromStorage();
    return courses.find(c => c.id === id) || null;
  }

  // Helper method to create a lesson with the new format
  createLesson(data: Partial<Lesson>): Lesson {
    return {
      id: Date.now().toString(),
      title: data.title || "New Lesson",
      isTemplate: data.isTemplate || false,
      course: data.course || "",
      estimatedTime: data.estimatedTime || 15,
      difficulty: data.difficulty || "Beginner",
      progress: data.progress || 0,
      steps: data.steps || [],
      slug: data.slug || `lesson-${Date.now()}`,
      content: data.content || "",
    };
  }

  // Helper method to create a lesson step
  createLessonStep(data: Partial<LessonStep>): LessonStep {
    return {
      title: data.title || "New Step",
      content: data.content || "",
    };
  }

  // Helper method to convert markdown content to steps
  convertMarkdownToSteps(markdownContent: string): LessonStep[] {
    const sections = markdownContent.split(/\n#{2,3}\s+/);
    return sections
      .filter(section => section.trim())
      .map(section => {
        const lines = section.split('\n');
        const title = lines[0].replace(/^#+\s*/, '').trim();
        const content = lines.slice(1).join('\n').trim();
        
        return {
          title: title || "Untitled Step",
          content: content ? `<div>${content}</div>` : "",
        };
      });
  }

  // Helper method to convert steps back to markdown
  convertStepsToMarkdown(steps: LessonStep[]): string {
    return steps
      .map(step => `## ${step.title}\n\n${step.content.replace(/<[^>]*>/g, '')}`)
      .join('\n\n');
  }
}

export const Course = new CourseService(); 