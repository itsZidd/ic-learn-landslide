import { auth, ensureAuthTablesExist } from '$lib/server/auth';
import { toSvelteKitHandler } from 'better-auth/svelte-kit';
import type { RequestEvent } from '@sveltejs/kit';

const handleAuth = toSvelteKitHandler(auth);

export const GET = async (event: RequestEvent) => {
	await ensureAuthTablesExist();
	return handleAuth(event);
};

export const POST = async (event: RequestEvent) => {
	await ensureAuthTablesExist();
	return handleAuth(event);
};
