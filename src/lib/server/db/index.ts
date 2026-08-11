import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

const url = env.TURSO_DATABASE_URL || 'file:local.db';
const authToken = env.TURSO_AUTH_TOKEN || undefined;

export const client = createClient({
	url,
	authToken
});

export const db = drizzle(client, { schema });
