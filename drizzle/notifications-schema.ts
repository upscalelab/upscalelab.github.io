import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
  enum as pgEnum,
  foreignKey,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './schema';

// ============================================
// NOTIFICATION ENUMS
// ============================================

const notificationTypeEnum = pgEnum('notification_type', [
  'new-inscription',
  'project-update',
  'stage-change',
  'mentor-assigned',
  'meeting-scheduled',
  'course-completed',
  'submission-received',
  'submission-graded',
  'message-received',
  'system-alert',
]);

const notificationChannelEnum = pgEnum('notification_channel', [
  'in-app',
  'email',
  'push',
]);

const notificationStatusEnum = pgEnum('notification_status', [
  'unread',
  'read',
  'archived',
]);

// ============================================
// NOTIFICATIONS
// ============================================

export const notifications = pgTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    type: notificationTypeEnum('type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    icon: varchar('icon', { length: 50 }), // lucide icon name
    color: varchar('color', { length: 20 }).default('blue'), // blue, orange, green, red
    relatedId: text('related_id'), // project_id, company_id, etc
    relatedType: varchar('related_type', { length: 50 }), // project, company, course, etc
    status: notificationStatusEnum('status').notNull().default('unread'),
    actionUrl: text('action_url'), // URL to navigate to
    createdAt: timestamp('created_at').defaultNow().notNull(),
    readAt: timestamp('read_at'),
    archivedAt: timestamp('archived_at'),
  },
  (table) => ({
    userIdIdx: index('notifications_user_id_idx').on(table.userId),
    statusIdx: index('notifications_status_idx').on(table.status),
    typeIdx: index('notifications_type_idx').on(table.type),
    userIdFk: foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
  })
);

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

export const notificationPreferences = pgTable(
  'notification_preferences',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().unique(),
    // Inscrições
    newInscriptionInApp: boolean('new_inscription_in_app').default(true),
    newInscriptionEmail: boolean('new_inscription_email').default(true),
    newInscriptionPush: boolean('new_inscription_push').default(true),
    // Atualizações de Projetos
    projectUpdateInApp: boolean('project_update_in_app').default(true),
    projectUpdateEmail: boolean('project_update_email').default(true),
    projectUpdatePush: boolean('project_update_push').default(false),
    // Mudanças de Etapa
    stageChangeInApp: boolean('stage_change_in_app').default(true),
    stageChangeEmail: boolean('stage_change_email').default(true),
    stageChangePush: boolean('stage_change_push').default(true),
    // Atribuição de Mentores
    mentorAssignedInApp: boolean('mentor_assigned_in_app').default(true),
    mentorAssignedEmail: boolean('mentor_assigned_email').default(true),
    mentorAssignedPush: boolean('mentor_assigned_push').default(true),
    // Reuniões Agendadas
    meetingScheduledInApp: boolean('meeting_scheduled_in_app').default(true),
    meetingScheduledEmail: boolean('meeting_scheduled_email').default(true),
    meetingScheduledPush: boolean('meeting_scheduled_push').default(true),
    // Cursos Concluídos
    courseCompletedInApp: boolean('course_completed_in_app').default(true),
    courseCompletedEmail: boolean('course_completed_email').default(false),
    courseCompletedPush: boolean('course_completed_push').default(false),
    // Envios Recebidos
    submissionReceivedInApp: boolean('submission_received_in_app').default(true),
    submissionReceivedEmail: boolean('submission_received_email').default(true),
    submissionReceivedPush: boolean('submission_received_push').default(false),
    // Envios Avaliados
    submissionGradedInApp: boolean('submission_graded_in_app').default(true),
    submissionGradedEmail: boolean('submission_graded_email').default(true),
    submissionGradedPush: boolean('submission_graded_push').default(true),
    // Mensagens Recebidas
    messageReceivedInApp: boolean('message_received_in_app').default(true),
    messageReceivedEmail: boolean('message_received_email').default(false),
    messageReceivedPush: boolean('message_received_push').default(true),
    // Alertas do Sistema
    systemAlertInApp: boolean('system_alert_in_app').default(true),
    systemAlertEmail: boolean('system_alert_email').default(true),
    systemAlertPush: boolean('system_alert_push').default(false),
    // Geral
    emailDigest: varchar('email_digest', { length: 20 }).default('daily'), // daily, weekly, never
    quietHoursEnabled: boolean('quiet_hours_enabled').default(false),
    quietHoursStart: varchar('quiet_hours_start', { length: 5 }), // HH:MM
    quietHoursEnd: varchar('quiet_hours_end', { length: 5 }), // HH:MM
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdFk: foreignKey({ columns: [table.userId], foreignColumns: [users.id] }),
  })
);

// ============================================
// NOTIFICATION HISTORY (para analytics)
// ============================================

export const notificationHistory = pgTable(
  'notification_history',
  {
    id: text('id').primaryKey(),
    notificationId: text('notification_id').notNull(),
    userId: text('user_id').notNull(),
    channel: notificationChannelEnum('channel').notNull(),
    sentAt: timestamp('sent_at').defaultNow().notNull(),
    deliveredAt: timestamp('delivered_at'),
    failedAt: timestamp('failed_at'),
    failureReason: text('failure_reason'),
  },
  (table) => ({
    notificationIdIdx: index('notification_history_notification_id_idx').on(table.notificationId),
    userIdIdx: index('notification_history_user_id_idx').on(table.userId),
  })
);

// ============================================
// RELATIONS
// ============================================

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, { fields: [notificationPreferences.userId], references: [users.id] }),
}));
