import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  varchar,
  enum as pgEnum,
  primaryKey,
  foreignKey,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================

const programEnum = pgEnum('program', ['ignite-up', 'scale-up']);
const stageEnum = pgEnum('stage', [
  'inscricao',
  'triagem',
  'stand-by',
  'aceleracao',
  'pos-aceleracao',
  'investimento',
  'equity',
  'exit',
  'churn',
]);
const userRoleEnum = pgEnum('user_role', ['admin', 'mentor', 'startup', 'instructor']);
const mentorshipTypeEnum = pgEnum('mentorship_type', ['strategic', 'technical']);
const meetingStatusEnum = pgEnum('meeting_status', ['scheduled', 'completed', 'cancelled']);
const submissionStatusEnum = pgEnum('submission_status', ['pending', 'reviewing', 'approved', 'rejected']);
const courseStatusEnum = pgEnum('course_status', ['not-started', 'in-progress', 'completed']);

// ============================================
// USERS & AUTHENTICATION
// ============================================

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull().default('startup'),
    avatar: text('avatar'),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  })
);

// ============================================
// COMPANIES / STARTUPS
// ============================================

export const companies = pgTable(
  'companies',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    website: varchar('website', { length: 255 }),
    logo: text('logo'),
    program: programEnum('program').notNull(),
    stage: stageEnum('stage').notNull().default('inscricao'),
    founderId: text('founder_id').notNull(),
    teamSize: integer('team_size'),
    marketSize: varchar('market_size', { length: 255 }),
    fundingNeeded: decimal('funding_needed', { precision: 15, scale: 2 }),
    equityOffered: decimal('equity_offered', { precision: 5, scale: 2 }),
    aiQualificationScore: decimal('ai_qualification_score', { precision: 5, scale: 2 }),
    aiQualificationDetails: text('ai_qualification_details'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    founderIdFk: foreignKey({ columns: [table.founderId], foreignColumns: [users.id] }),
    programIdx: index('companies_program_idx').on(table.program),
    stageIdx: index('companies_stage_idx').on(table.stage),
  })
);

export const companyTeamMembers = pgTable(
  'company_team_members',
  {
    id: text('id').primaryKey(),
    companyId: text('company_id').notNull(),
    userId: text('user_id').notNull(),
    role: varchar('role', { length: 100 }).notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => ({
    companyIdFk: foreignKey({ columns: [table.companyId], foreignColumns: [companies.id] }),
    userIdFk: foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
  })
);

// ============================================
// PROJECTS & PIPELINE
// ============================================

export const projects = pgTable(
  'projects',
  {
    id: text('id').primaryKey(),
    companyId: text('company_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    stage: stageEnum('stage').notNull(),
    program: programEnum('program').notNull(),
    progress: integer('progress').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    companyIdFk: foreignKey({ columns: [table.companyId], foreignColumns: [companies.id] }),
    stageIdx: index('projects_stage_idx').on(table.stage),
  })
);

export const projectMentors = pgTable(
  'project_mentors',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull(),
    mentorId: text('mentor_id').notNull(),
    mentorshipType: mentorshipTypeEnum('mentorship_type').notNull(),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdFk: foreignKey({ columns: [table.projectId], foreignColumns: [projects.id] }),
    mentorIdFk: foreignKey({ columns: [table.mentorId], foreignColumns: [users.id] }),
  })
);

// ============================================
// COURSES & LEARNING
// ============================================

export const courses = pgTable(
  'courses',
  {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    program: programEnum('program').notNull(),
    instructorId: text('instructor_id').notNull(),
    duration: integer('duration'), // in hours
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    instructorIdFk: foreignKey({ columns: [table.instructorId], foreignColumns: [users.id] }),
    programIdx: index('courses_program_idx').on(table.program),
  })
);

export const courseModules = pgTable(
  'course_modules',
  {
    id: text('id').primaryKey(),
    courseId: text('course_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    courseIdFk: foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }),
  })
);

export const courseLessons = pgTable(
  'course_lessons',
  {
    id: text('id').primaryKey(),
    moduleId: text('module_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    content: text('content'), // HTML or markdown
    videoUrl: text('video_url'),
    duration: integer('duration'), // in minutes
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    moduleIdFk: foreignKey({ columns: [table.moduleId], foreignColumns: [courseModules.id] }),
  })
);

export const courseEnrollments = pgTable(
  'course_enrollments',
  {
    id: text('id').primaryKey(),
    courseId: text('course_id').notNull(),
    userId: text('user_id').notNull(),
    status: courseStatusEnum('status').notNull().default('not-started'),
    progress: integer('progress').default(0),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    courseIdFk: foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }),
    userIdFk: foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
  })
);

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollment_id').notNull(),
    lessonId: text('lesson_id').notNull(),
    completed: boolean('completed').default(false),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    enrollmentIdFk: foreignKey({ columns: [table.enrollmentId], foreignColumns: [courseEnrollments.id] }),
    lessonIdFk: foreignKey({ columns: [table.lessonId], foreignColumns: [courseLessons.id] }),
  })
);

// ============================================
// SUBMISSIONS & PROJECTS
// ============================================

export const moduleSubmissions = pgTable(
  'module_submissions',
  {
    id: text('id').primaryKey(),
    enrollmentId: text('enrollment_id').notNull(),
    moduleId: text('module_id').notNull(),
    status: submissionStatusEnum('status').notNull().default('pending'),
    grade: integer('grade'), // 0-100
    feedback: text('feedback'),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    reviewedAt: timestamp('reviewed_at'),
    reviewedBy: text('reviewed_by'),
  },
  (table) => ({
    enrollmentIdFk: foreignKey({ columns: [table.enrollmentId], foreignColumns: [courseEnrollments.id] }),
    moduleIdFk: foreignKey({ columns: [table.moduleId], foreignColumns: [courseModules.id] }),
    reviewedByFk: foreignKey({ columns: [table.reviewedBy], foreignColumns: [users.id] }),
  })
);

export const submissionDocuments = pgTable(
  'submission_documents',
  {
    id: text('id').primaryKey(),
    submissionId: text('submission_id').notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileUrl: text('file_url').notNull(),
    fileType: varchar('file_type', { length: 50 }).notNull(),
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  },
  (table) => ({
    submissionIdFk: foreignKey({ columns: [table.submissionId], foreignColumns: [moduleSubmissions.id] }),
  })
);

// ============================================
// DOCUMENTS & CONTRACTS
// ============================================

export const documents = pgTable(
  'documents',
  {
    id: text('id').primaryKey(),
    companyId: text('company_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    type: varchar('type', { length: 100 }).notNull(), // contract, pitch, financial, etc
    fileUrl: text('file_url').notNull(),
    uploadedBy: text('uploaded_by').notNull(),
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
    signatureRequired: boolean('signature_required').default(false),
    signedAt: timestamp('signed_at'),
    signedBy: text('signed_by'),
  },
  (table) => ({
    companyIdFk: foreignKey({ columns: [table.companyId], foreignColumns: [companies.id] }),
    uploadedByFk: foreignKey({ columns: [table.uploadedBy], foreignColumns: [users.id] }),
    signedByFk: foreignKey({ columns: [table.signedBy], foreignColumns: [users.id] }),
  })
);

// ============================================
// MEETINGS & COMMUNICATIONS
// ============================================

export const meetings = pgTable(
  'meetings',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    mentorId: text('mentor_id').notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    status: meetingStatusEnum('status').notNull().default('scheduled'),
    videoLink: text('video_link'),
    recordingUrl: text('recording_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    projectIdFk: foreignKey({ columns: [table.projectId], foreignColumns: [projects.id] }),
    mentorIdFk: foreignKey({ columns: [table.mentorId], foreignColumns: [users.id] }),
  })
);

export const chats = pgTable(
  'chats',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // group, direct, support
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    createdByFk: foreignKey({ columns: [table.createdBy], foreignColumns: [users.id] }),
  })
);

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: text('id').primaryKey(),
    chatId: text('chat_id').notNull(),
    userId: text('user_id').notNull(),
    content: text('content').notNull(),
    attachmentUrl: text('attachment_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    chatIdFk: foreignKey({ columns: [table.chatId], foreignColumns: [chats.id] }),
    userIdFk: foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
  })
);

export const chatMembers = pgTable(
  'chat_members',
  {
    id: text('id').primaryKey(),
    chatId: text('chat_id').notNull(),
    userId: text('user_id').notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => ({
    chatIdFk: foreignKey({ columns: [table.chatId], foreignColumns: [chats.id] }),
    userIdFk: foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
  })
);

// ============================================
// MENTORSHIP
// ============================================

export const mentorshipRequests = pgTable(
  'mentorship_requests',
  {
    id: text('id').primaryKey(),
    startupId: text('startup_id').notNull(),
    mentorId: text('mentor_id').notNull(),
    type: mentorshipTypeEnum('mentorship_type').notNull(),
    topic: varchar('topic', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, accepted, rejected, completed
    requestedAt: timestamp('requested_at').defaultNow().notNull(),
    acceptedAt: timestamp('accepted_at'),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    startupIdFk: foreignKey({ columns: [table.startupId], foreignColumns: [users.id] }),
    mentorIdFk: foreignKey({ columns: [table.mentorId], foreignColumns: [users.id] }),
  })
);

// ============================================
// RELATIONS (for Drizzle ORM)
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  companies: many(companies),
  courseEnrollments: many(courseEnrollments),
  meetings: many(meetings),
  documents: many(documents),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  founder: one(users, { fields: [companies.founderId], references: [users.id] }),
  teamMembers: many(companyTeamMembers),
  projects: many(projects),
  documents: many(documents),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, { fields: [projects.companyId], references: [companies.id] }),
  mentors: many(projectMentors),
  meetings: many(meetings),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, { fields: [courses.instructorId], references: [users.id] }),
  modules: many(courseModules),
  enrollments: many(courseEnrollments),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, { fields: [courseModules.courseId], references: [courses.id] }),
  lessons: many(courseLessons),
  submissions: many(moduleSubmissions),
}));

export const courseLessonsRelations = relations(courseLessons, ({ one, many }) => ({
  module: one(courseModules, { fields: [courseLessons.moduleId], references: [courseModules.id] }),
  progress: many(lessonProgress),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one, many }) => ({
  course: one(courses, { fields: [courseEnrollments.courseId], references: [courses.id] }),
  user: one(users, { fields: [courseEnrollments.userId], references: [users.id] }),
  lessonProgress: many(lessonProgress),
  submissions: many(moduleSubmissions),
}));
