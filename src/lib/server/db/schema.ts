import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// BETTER AUTH TABLES
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
	image: text('image'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	idToken: text('idToken'),
	accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }),
	updatedAt: integer('updatedAt', { mode: 'timestamp' })
});

// STUDENT PROGRESS & UNIQUE CERTIFICATE TABLE
export const studentProgress = sqliteTable('student_progress', {
	id: text('id').primaryKey(),
	userId: text('userId').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
	studentName: text('studentName').notNull(),
	studentClass: text('studentClass').notNull().default('XI-GEO-1'),
	certificateId: text('certificateId').notNull().unique(), // Format: ICARE-2026-8A3F-9D2E
	introductionCompleted: integer('introductionCompleted', { mode: 'boolean' }).notNull().default(false),
	connectionCompleted: integer('connectionCompleted', { mode: 'boolean' }).notNull().default(false),
	applicationCompleted: integer('applicationCompleted', { mode: 'boolean' }).notNull().default(false),
	reflectionCompleted: integer('reflectionCompleted', { mode: 'boolean' }).notNull().default(false),
	extensionCompleted: integer('extensionCompleted', { mode: 'boolean' }).notNull().default(false),
	quizScore: integer('quizScore').notNull().default(0),
	essayScore: integer('essayScore').notNull().default(0),
	essayAttempts: integer('essayAttempts').notNull().default(0),
	quizAnswers: text('quizAnswers').notNull().default('{}'),
	latestEssayAnswerA: text('latestEssayAnswerA').default(''),
	latestEssayAnswerB: text('latestEssayAnswerB').default(''),
	latestEssayAnswerC: text('latestEssayAnswerC').default(''),
	latestEssayFeedback: text('latestEssayFeedback').default(''),
	latestEssayRubric: text('latestEssayRubric').default('{}'),
	certificateIssued: integer('certificateIssued', { mode: 'boolean' }).notNull().default(false),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull()
});
