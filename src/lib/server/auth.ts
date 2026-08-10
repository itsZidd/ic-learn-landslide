import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from '$env/dynamic/private';
import { db, client } from './db';
import * as schema from './db/schema';

// Helper to ensure all required tables exist in Turso / SQLite database
export async function ensureAuthTablesExist() {
	try {
		await client.execute(`
			CREATE TABLE IF NOT EXISTS user (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				email TEXT NOT NULL UNIQUE,
				emailVerified INTEGER NOT NULL DEFAULT 0,
				image TEXT,
				createdAt INTEGER NOT NULL,
				updatedAt INTEGER NOT NULL
			);
		`);
		await client.execute(`
			CREATE TABLE IF NOT EXISTS session (
				id TEXT PRIMARY KEY,
				expiresAt INTEGER NOT NULL,
				token TEXT NOT NULL UNIQUE,
				createdAt INTEGER NOT NULL,
				updatedAt INTEGER NOT NULL,
				ipAddress TEXT,
				userAgent TEXT,
				userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
			);
		`);
		await client.execute(`
			CREATE TABLE IF NOT EXISTS account (
				id TEXT PRIMARY KEY,
				accountId TEXT NOT NULL,
				providerId TEXT NOT NULL,
				userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
				accessToken TEXT,
				refreshToken TEXT,
				idToken TEXT,
				accessTokenExpiresAt INTEGER,
				refreshTokenExpiresAt INTEGER,
				scope TEXT,
				password TEXT,
				createdAt INTEGER NOT NULL,
				updatedAt INTEGER NOT NULL
			);
		`);
		await client.execute(`
			CREATE TABLE IF NOT EXISTS verification (
				id TEXT PRIMARY KEY,
				identifier TEXT NOT NULL,
				value TEXT NOT NULL,
				expiresAt INTEGER NOT NULL,
				createdAt INTEGER,
				updatedAt INTEGER
			);
		`);
		await client.execute(`
			CREATE TABLE IF NOT EXISTS student_progress (
				id TEXT PRIMARY KEY,
				userId TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
				studentName TEXT NOT NULL,
				studentClass TEXT NOT NULL DEFAULT 'XI-GEO-1',
				certificateId TEXT NOT NULL UNIQUE,
				introductionCompleted INTEGER NOT NULL DEFAULT 0,
				connectionCompleted INTEGER NOT NULL DEFAULT 0,
				applicationCompleted INTEGER NOT NULL DEFAULT 0,
				reflectionCompleted INTEGER NOT NULL DEFAULT 0,
				extensionCompleted INTEGER NOT NULL DEFAULT 0,
				quizScore INTEGER NOT NULL DEFAULT 0,
				essayScore INTEGER NOT NULL DEFAULT 0,
				essayAttempts INTEGER NOT NULL DEFAULT 0,
				quizAnswers TEXT NOT NULL DEFAULT '{}',
				latestEssayAnswerA TEXT DEFAULT '',
				latestEssayAnswerB TEXT DEFAULT '',
				latestEssayAnswerC TEXT DEFAULT '',
				latestEssayFeedback TEXT DEFAULT '',
				latestEssayRubric TEXT DEFAULT '{}',
				certificateIssued INTEGER NOT NULL DEFAULT 0,
				updatedAt INTEGER NOT NULL
			);
		`);
	} catch (e) {
		console.error('Error ensuring auth tables exist:', e);
	}
}

const secret = env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || 'icare-landslide-learning-um-2026-secret-key-32chars';
const baseURL = env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification
		}
	}),
	emailAndPassword: {
		enabled: true
	},
	secret,
	...(baseURL ? { baseURL } : {})
});
