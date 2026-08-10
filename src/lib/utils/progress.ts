// Progress & Certificate State Management using Browser LocalStorage

export interface StudentProgress {
	studentName: string;
	studentClass?: string;
	role?: 'student' | 'teacher';
	introCompleted: boolean;
	connectionCompleted: boolean;
	applicationCompleted: boolean;
	appSubModulesCompleted?: boolean[];
	reflectionQuizPassed: boolean;
	reflectionEssayCompleted: boolean;
	extensionCompleted: boolean;
	quizScore: number;
	essayScore?: number;
	essayAttemptsCount?: number;
	lastEssaySubmittedTimestamp?: number;
	latestEssayAnswerA?: string;
	latestEssayAnswerB?: string;
	latestEssayAnswerC?: string;
	latestEssayFeedback?: string;
	latestEssayRubric?: { a: number; b: number; c: number };
	certificateId: string;
	completionDate: string;
}

const DEFAULT_PROGRESS: StudentProgress = {
	studentName: 'Siswa',
	studentClass: 'XI-GEO-1',
	role: 'student',
	introCompleted: false,
	connectionCompleted: false,
	applicationCompleted: false,
	appSubModulesCompleted: [false, false, false, false],
	reflectionQuizPassed: false,
	reflectionEssayCompleted: false,
	extensionCompleted: false,
	quizScore: 0,
	essayScore: 0,
	essayAttemptsCount: 0,
	lastEssaySubmittedTimestamp: 0,
	latestEssayAnswerA: '',
	latestEssayAnswerB: '',
	latestEssayAnswerC: '',
	latestEssayFeedback: '',
	latestEssayRubric: { a: 0, b: 0, c: 0 },
	certificateId: '',
	completionDate: ''
};

const STORAGE_KEY = 'icare_student_progress';

function formatCompletionDate(): string {
	return new Date().toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

function generateCertificateId(): string {
	const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
	const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `ICARE-2026-${rand1}-${rand2}`;
}

export function getProgress(): StudentProgress {
	if (typeof window === 'undefined') return DEFAULT_PROGRESS;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		console.warn('Failed to load progress from localStorage', e);
	}
	return DEFAULT_PROGRESS;
}

export function saveProgress(updated: Partial<StudentProgress>): StudentProgress {
	const current = getProgress();
	const next = { ...current, ...updated };

	// Stamp the certificate details the moment all 5 modules become complete,
	// regardless of which module triggers the final save — previously these
	// were only ever set by the dev "instant complete" cheat, so a student who
	// legitimately finished the course saw a blank date/ID on their certificate.
	if (calculateCompletion(next) === 100) {
		if (!next.completionDate) next.completionDate = formatCompletionDate();
		if (!next.certificateId) next.certificateId = generateCertificateId();
	}

	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			// Sync to server database
			fetch('/api/progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(next)
			}).catch(() => {});
		} catch (e) {
			console.warn('Failed to save progress', e);
		}
	}
	return next;
}

export function resetProgress(): StudentProgress {
	const initial: StudentProgress = {
		studentName: 'Siswa',
		role: 'student',
		introCompleted: false,
		connectionCompleted: false,
		applicationCompleted: false,
		appSubModulesCompleted: [false, false, false, false],
		reflectionQuizPassed: false,
		reflectionEssayCompleted: false,
		extensionCompleted: false,
		quizScore: 0,
		certificateId: '',
		completionDate: ''
	};
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
		} catch (e) {
			console.warn('Failed to reset progress', e);
		}
	}
	return initial;
}

export function completeAllProgress(studentName: string = 'Faridh Arganatha'): StudentProgress {
	const completed: StudentProgress = {
		studentName: studentName || 'Faridh Arganatha',
		introCompleted: true,
		connectionCompleted: true,
		applicationCompleted: true,
		appSubModulesCompleted: [true, true, true, true],
		reflectionQuizPassed: true,
		reflectionEssayCompleted: true,
		extensionCompleted: true,
		quizScore: 100,
		certificateId: generateCertificateId(),
		completionDate: formatCompletionDate()
	};
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
		} catch (e) {
			console.warn('Failed to complete all progress', e);
		}
	}
	return completed;
}

export function calculateCompletion(p: StudentProgress): number {
	let count = 0;
	if (p.introCompleted) count++;
	if (p.connectionCompleted) count++;
	if (p.applicationCompleted) count++;
	if (p.reflectionQuizPassed && p.reflectionEssayCompleted) count++;
	if (p.extensionCompleted) count++;
	return Math.round((count / 5) * 100);
}
