import { json, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST(event: RequestEvent) {
	try {
		const { code, password } = await event.request.json();
		const validCode = (env.TEACHER_CODE || 'GURU2026').trim().toUpperCase();
		const validPassword = env.TEACHER_PASSWORD || 'guru123456';

		if (!code || typeof code !== 'string') {
			return json({ status: 'error', message: 'Kode Identitas Guru wajib diisi!' }, { status: 400 });
		}

		if (!password || typeof password !== 'string') {
			return json({ status: 'error', message: 'Password Guru wajib diisi!' }, { status: 400 });
		}

		if (code.trim().toUpperCase() !== validCode) {
			return json({ status: 'error', message: 'Kode Identitas Guru tidak terdaftar!' }, { status: 400 });
		}

		if (password !== validPassword) {
			return json({ status: 'error', message: 'Password Guru salah!' }, { status: 400 });
		}

		return json({
			status: 'success',
			teacherName: 'Bapak/Ibu Guru Pengajar',
			teacherEmail: 'guru@icare.com'
		});
	} catch (e: any) {
		console.error('Error in POST /api/teacher-auth:', e);
		return json({ status: 'error', message: 'Gagal memverifikasi akun guru.' }, { status: 500 });
	}
}
