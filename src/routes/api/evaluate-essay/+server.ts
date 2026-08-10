import { json, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

interface EssayRequest {
	answerA?: string;
	answerB?: string;
	answerC?: string;
}

function calculateFallbackScore(a: string, b: string, c: string) {
	let scoreA = 0;
	let scoreB = 0;
	let scoreC = 0;

	// Question A Keywords: longsor, jabung, curah hujan, lereng, curam, vegetasi, alih fungsi
	const keywordsA = ['longsor', 'jabung', 'hujan', 'lereng', 'curam', 'vegetasi', 'alih fungsi', 'tanah'];
	const matchA = keywordsA.filter((k) => a.toLowerCase().includes(k)).length;
	scoreA = Math.min(35, Math.max(15, Math.floor((a.trim().length / 50) * 10) + matchA * 4));

	// Question B Keywords: peta, curah hujan, kemiringan lereng, topografi, geologi, jenis tanah, penggunaan lahan, tematik
	const keywordsB = ['peta', 'hujan', 'lereng', 'topografi', 'geologi', 'tanah', 'lahan', 'tutupan', 'tematik', 'administrasi'];
	const matchB = keywordsB.filter((k) => b.toLowerCase().includes(k)).length;
	scoreB = Math.min(35, Math.max(15, Math.floor((b.trim().length / 50) * 10) + matchB * 4));

	// Question C Keywords: mitigasi, pohon, akar, terassering, saluran air, drainase, ews, sosialisasi
	const keywordsC = ['mitigasi', 'pohon', 'akar', 'terassering', 'saluran', 'drainase', 'peringatan', 'sosialisasi'];
	const matchC = keywordsC.filter((k) => c.toLowerCase().includes(k)).length;
	scoreC = Math.min(30, Math.max(10, Math.floor((c.trim().length / 50) * 8) + matchC * 3));

	const total = Math.min(100, Math.max(50, scoreA + scoreB + scoreC));
	let feedback = 'Jawaban Anda telah dianalisis. ';

	if (total >= 85) {
		feedback += 'Sangat baik! Anda memahami faktor geografi, identifikasi peta-peta tematik kerawanan, dan strategi mitigasi lahan secara mendalam.';
	} else if (total >= 70) {
		feedback += 'Baik! Pemahaman konsep dasar sudah baik, pertajam lagi penjelasan mengenai peta tematik pendukung dan teknik mitigasi vegetasi.';
	} else {
		feedback += 'Cukup baik. Disarankan untuk membaca ulang modul aplikasi mengenai kondisi bentang alam Kecamatan Jabung dan teknik mitigasi.';
	}

	return {
		score: total,
		feedback,
		rubric: { a: scoreA, b: scoreB, c: scoreC }
	};
}

export async function POST(event: RequestEvent) {
	try {
		const body: EssayRequest = await event.request.json();
		const a = body.answerA || '';
		const b = body.answerB || '';
		const c = body.answerC || '';

		if (!a.trim() || !b.trim() || !c.trim()) {
			return json(
				{ status: 'error', message: '⚠️ Seluruh 3 soal pertanyaan esai harus dijawab dengan lengkap!' },
				{ status: 400 }
			);
		}

		const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;

		if (apiKey) {
			try {
				const promptText = `Kamu adalah guru penilai otomatis E-Modul Geografi Kebencanaan Tanah Longsor Kecamatan Jabung. Evaluasi 3 jawaban esai siswa berikut secara obyektif (berikan total skor 0-100, feedback saran positif singkat dalam bahasa Indonesia):

Soal A (Faktor Penyebab & Interpretasi Kerawanan Longsor Jabung):
"${a}"

Soal B (Peta-peta Tematik Yang Dibutuhkan Dalam Pembuatan Peta Kerawanan Longsor, misal: Peta Curah Hujan, Peta Topografi/Kemiringan Lereng, Peta Geologi/Jenis Tanah, Peta Penggunaan Lahan):
"${b}"

Soal C (Tindakan Mitigasi & Konservasi Lahan Warga Jabung):
"${c}"

PENTING UNTUK SOAL B: Soal B menanyakan jenis peta tematik pendukung (curah hujan, lereng, geologi, penggunaan lahan). JANGAN meminta atau menyarankan tipe longsor translasi pada Soal B.

Kembalikan HANYA format JSON valid berikut tanpa blok markdown backtick:
{
  "score": 88,
  "feedback": "Penjelasan mengenai faktor curah hujan dan lereng curam pada Soal A serta identifikasi peta tematik pada Soal B sudah sangat tepat.",
  "rubric": { "a": 30, "b": 29, "c": 29 }
}`;

				// gemini-2.5-flash-lite was retired for new API keys (404
				// "no longer available to new users"). gemini-3.5-flash-lite is
				// the current GA "Flash-Lite" model — Google's highest-RPM
				// free-tier tier in every generation — and is confirmed working
				// against this project's key via /v1beta/models.
				const response = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							contents: [{ parts: [{ text: promptText }] }]
						})
					}
				);

				if (response.ok) {
					const data = await response.json();
					const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
					const jsonMatch = rawText.match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						const parsed = JSON.parse(jsonMatch[0]);
						return json({
							status: 'success',
							provider: 'gemini-ai',
							score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
							feedback: parsed.feedback || 'Jawaban Anda telah dievaluasi oleh sistem AI.',
							rubric: parsed.rubric || { a: 25, b: 25, c: 25 }
						});
					}
					console.warn('Gemini response had no parseable JSON, using heuristic evaluation:', rawText);
				} else {
					console.warn('Gemini API request failed, using heuristic evaluation:', response.status, await response.text());
				}
			} catch (aiErr) {
				console.warn('Gemini API call failed, using heuristic evaluation:', aiErr);
			}
		}

		// Fallback Rule Engine
		const fallbackResult = calculateFallbackScore(a, b, c);
		return json({
			status: 'success',
			provider: 'rubric-engine',
			...fallbackResult
		});
	} catch (err: any) {
		return json({ status: 'error', message: err.message || 'Gagal mengevaluasi esai' }, { status: 500 });
	}
}
