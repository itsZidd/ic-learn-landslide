import { json, type RequestEvent } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { db, client } from '$lib/server/db';
import { studentProgress } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function ensureColumnsExist() {
	try {
		await client.execute(`ALTER TABLE student_progress ADD COLUMN latestEssayAnswerA TEXT DEFAULT ''`);
	} catch {}
	try {
		await client.execute(`ALTER TABLE student_progress ADD COLUMN latestEssayAnswerB TEXT DEFAULT ''`);
	} catch {}
	try {
		await client.execute(`ALTER TABLE student_progress ADD COLUMN latestEssayAnswerC TEXT DEFAULT ''`);
	} catch {}
	try {
		await client.execute(`ALTER TABLE student_progress ADD COLUMN latestEssayFeedback TEXT DEFAULT ''`);
	} catch {}
	try {
		await client.execute(`ALTER TABLE student_progress ADD COLUMN latestEssayRubric TEXT DEFAULT '{}'`);
	} catch {}
}

function generateUniqueCertificateId(): string {
	const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
	const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `ICARE-2026-${rand1}-${rand2}`;
}

export async function GET(event: RequestEvent) {
	await ensureColumnsExist();

	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session || !session.user) {
		return json({ status: 'unauthenticated' }, { status: 401 });
	}

	const userId = session.user.id;
	let [existingProgress] = await db
		.select()
		.from(studentProgress)
		.where(eq(studentProgress.userId, userId));

	if (!existingProgress) {
		const newCertId = generateUniqueCertificateId();
		const [created] = await db
			.insert(studentProgress)
			.values({
				id: `sp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
				userId: userId,
				studentName: session.user.name || 'Siswa',
				certificateId: newCertId,
				introductionCompleted: false,
				connectionCompleted: false,
				applicationCompleted: false,
				reflectionCompleted: false,
				extensionCompleted: false,
				quizScore: 0,
				quizAnswers: '{}',
				certificateIssued: false,
				updatedAt: new Date()
			})
			.returning();

		existingProgress = created;
	}

	return json({
		status: 'success',
		user: session.user,
		progress: existingProgress
	});
}

export async function POST(event: RequestEvent) {
	await ensureColumnsExist();

	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (!session || !session.user) {
		return json({ status: 'unauthenticated' }, { status: 401 });
	}

	const userId = session.user.id;
	const body = await event.request.json();

	let [existingProgress] = await db
		.select()
		.from(studentProgress)
		.where(eq(studentProgress.userId, userId));

	const certId = existingProgress?.certificateId || generateUniqueCertificateId();

		const updateData = {
			studentName: body.studentName || session.user.name || 'Siswa',
			studentClass: body.studentClass || existingProgress?.studentClass || 'XI-GEO-1',
			introductionCompleted: body.introCompleted ?? existingProgress?.introductionCompleted ?? false,
			connectionCompleted: body.connectionCompleted ?? existingProgress?.connectionCompleted ?? false,
			applicationCompleted: body.applicationCompleted ?? existingProgress?.applicationCompleted ?? false,
			reflectionCompleted:
				body.reflectionQuizPassed !== undefined || body.reflectionEssayCompleted !== undefined
					? !!(body.reflectionQuizPassed && body.reflectionEssayCompleted)
					: (existingProgress?.reflectionCompleted ?? false),
			extensionCompleted: body.extensionCompleted ?? existingProgress?.extensionCompleted ?? false,
			quizScore: typeof body.quizScore === 'number' ? body.quizScore : (existingProgress?.quizScore ?? 0),
			essayScore: typeof body.essayScore === 'number' ? body.essayScore : (existingProgress?.essayScore ?? 0),
			essayAttempts: typeof body.essayAttemptsCount === 'number' ? body.essayAttemptsCount : (existingProgress?.essayAttempts ?? 0),
			quizAnswers: typeof body.quizAnswers === 'string' ? body.quizAnswers : JSON.stringify(body.quizAnswers || {}),
			latestEssayAnswerA: body.latestEssayAnswerA ?? existingProgress?.latestEssayAnswerA ?? '',
			latestEssayAnswerB: body.latestEssayAnswerB ?? existingProgress?.latestEssayAnswerB ?? '',
			latestEssayAnswerC: body.latestEssayAnswerC ?? existingProgress?.latestEssayAnswerC ?? '',
			latestEssayFeedback: body.latestEssayFeedback ?? existingProgress?.latestEssayFeedback ?? '',
			latestEssayRubric: typeof body.latestEssayRubric === 'object' ? JSON.stringify(body.latestEssayRubric) : (existingProgress?.latestEssayRubric ?? '{}'),
			certificateIssued: body.certificateIssued ?? existingProgress?.certificateIssued ?? false,
			updatedAt: new Date()
		};

	if (existingProgress) {
		await db
			.update(studentProgress)
			.set(updateData)
			.where(eq(studentProgress.userId, userId));
	} else {
		await db.insert(studentProgress).values({
			id: `sp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
			userId: userId,
			certificateId: certId,
			...updateData
		});
	}

	const [updated] = await db
		.select()
		.from(studentProgress)
		.where(eq(studentProgress.userId, userId));

	return json({
		status: 'success',
		progress: updated
	});
}
