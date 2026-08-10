import { json } from '@sveltejs/kit';
import { db, client } from '$lib/server/db';
import { user, studentProgress } from '$lib/server/db/schema';
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

export async function GET() {
	try {
		await ensureColumnsExist();

		const rows = await db
			.select({
				userId: user.id,
				name: user.name,
				email: user.email,
				studentClass: studentProgress.studentClass,
				certificateId: studentProgress.certificateId,
				quizScore: studentProgress.quizScore,
				essayScore: studentProgress.essayScore,
				latestEssayAnswerA: studentProgress.latestEssayAnswerA,
				latestEssayAnswerB: studentProgress.latestEssayAnswerB,
				latestEssayAnswerC: studentProgress.latestEssayAnswerC,
				latestEssayFeedback: studentProgress.latestEssayFeedback,
				latestEssayRubric: studentProgress.latestEssayRubric,
				introductionCompleted: studentProgress.introductionCompleted,
				connectionCompleted: studentProgress.connectionCompleted,
				applicationCompleted: studentProgress.applicationCompleted,
				reflectionCompleted: studentProgress.reflectionCompleted,
				extensionCompleted: studentProgress.extensionCompleted,
				updatedAt: studentProgress.updatedAt
			})
			.from(user)
			.leftJoin(studentProgress, eq(studentProgress.userId, user.id));

		const students = rows.map((r) => {
			const completedCount = [
				r.introductionCompleted,
				r.connectionCompleted,
				r.applicationCompleted,
				r.reflectionCompleted,
				r.extensionCompleted
			].filter(Boolean).length;

			let parsedRubric = { a: 0, b: 0, c: 0 };
			try {
				if (r.latestEssayRubric) {
					parsedRubric = typeof r.latestEssayRubric === 'string' ? JSON.parse(r.latestEssayRubric) : r.latestEssayRubric;
				}
			} catch {}

			return {
				id: r.userId,
				name: r.name,
				email: r.email,
				studentClass: r.studentClass || 'XI-GEO-1',
				certId: r.certificateId || 'ICARE-2026-PENDING',
				quizScore: r.quizScore ?? 0,
				essayScore: r.essayScore ?? 0,
				latestEssayAnswerA: r.latestEssayAnswerA || '',
				latestEssayAnswerB: r.latestEssayAnswerB || '',
				latestEssayAnswerC: r.latestEssayAnswerC || '',
				latestEssayFeedback: r.latestEssayFeedback || '',
				latestEssayRubric: parsedRubric,
				completion: Math.round((completedCount / 5) * 100),
				lastUpdated: r.updatedAt
					? new Date(r.updatedAt).toLocaleString('id-ID', {
							day: '2-digit',
							month: 'short',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})
					: '-'
			};
		});

		return json({ status: 'success', students });
	} catch (e: any) {
		console.error('Error fetching students in GET /api/students:', e);
		return json({ status: 'error', message: e.message || 'Failed to fetch student data' }, { status: 500 });
	}
}
