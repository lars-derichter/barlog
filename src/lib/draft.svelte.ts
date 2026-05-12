import type { VisitDraft } from './types';

function emptyDraft(): VisitDraft {
	return {
		venue: '',
		venueType: undefined,
		visitedAt: new Date().toISOString(),
		orders: [],
		rating: undefined,
		notes: ''
	};
}

export const draft = $state<VisitDraft>(emptyDraft());

export function resetDraft() {
	Object.assign(draft, emptyDraft());
}

export function loadDraft(source: VisitDraft) {
	Object.assign(draft, structuredClone(source));
}
