// User Types
export type UserRole = 'admin' | 'mentor' | 'startup';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// Program Types
export type ProgramType = 'ignite-up' | 'scale-up';

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  duration: {
    min: number; // months
    max: number;
  };
  equity: number; // percentage
  monthlyFee?: number; // only for Ignite Up
  createdAt: Date;
}

// Project/Startup Types
export type ProjectStage = 'inscricao' | 'triagem' | 'validacao' | 'entrevista' | 'aceleracao' | 'mentoria' | 'demo-day' | 'pitch-final';

export interface Project {
  id: string;
  name: string;
  description: string;
  program: ProgramType;
  stage: ProjectStage;
  progress: number; // 0-100
  mentors: string[]; // User IDs
  team: string[]; // User IDs
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  url: string;
  stage: ProjectStage;
  uploadedAt: Date;
}

// Mentor Types
export interface Mentor {
  id: string;
  userId: string;
  specialty: string;
  bio: string;
  availability: boolean;
  projects: string[]; // Project IDs
}

// Meeting Types
export type MeetingType = 'mentoring' | 'screening' | 'presentation' | 'general';

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  project?: string; // Project ID
  participants: string[]; // User IDs
  startTime: Date;
  endTime: Date;
  videoUrl?: string;
  recordingUrl?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Chat Types
export interface ChatMessage {
  id: string;
  sender: string; // User ID
  content: string;
  channel: string; // Channel ID
  timestamp: Date;
  attachments?: string[]; // URLs
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project';
  members: string[]; // User IDs
  createdAt: Date;
}

// AI Integration Types
export interface AIQualification {
  projectId: string;
  score: number; // 0-100
  recommendation: 'approve' | 'review' | 'reject';
  feedback: string;
  analyzedAt: Date;
}

// Analytics Types
export interface PipelineStats {
  total: number;
  byStage: Record<ProjectStage, number>;
  byProgram: Record<ProgramType, number>;
}

export interface DashboardStats {
  totalProjects: number;
  activeMentors: number;
  igniteUpCount: number;
  scaleUpCount: number;
  pipelineStats: PipelineStats;
}
