import Dexie, { type EntityTable } from 'dexie';
import type { Visit } from './types';

class BarlogDB extends Dexie {
	visits!: EntityTable<Visit, 'id'>;

	constructor() {
		super('barlog');
		this.version(1).stores({
			visits: 'id, visitedAt, venue'
		});
	}
}

export const db = new BarlogDB();

export function newId(): string {
	return crypto.randomUUID();
}

export async function listVisits(): Promise<Visit[]> {
	return db.visits.orderBy('visitedAt').reverse().toArray();
}

export async function getVisit(id: string): Promise<Visit | undefined> {
	return db.visits.get(id);
}

export async function createVisit(
	draft: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Visit> {
	const now = new Date().toISOString();
	const visit: Visit = { id: newId(), createdAt: now, updatedAt: now, ...draft };
	await db.visits.add(visit);
	return visit;
}

export async function updateVisit(
	id: string,
	patch: Partial<Omit<Visit, 'id' | 'createdAt'>>
): Promise<void> {
	await db.visits.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function deleteVisit(id: string): Promise<void> {
	await db.visits.delete(id);
}

export async function venueSuggestions(query: string, limit = 8): Promise<string[]> {
	const q = query.trim().toLowerCase();
	const all = await db.visits.orderBy('visitedAt').reverse().toArray();
	const seen = new Set<string>();
	const out: string[] = [];
	for (const v of all) {
		const key = v.venue.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		if (!q || key.includes(q)) out.push(v.venue);
		if (out.length >= limit) break;
	}
	return out;
}
