export type VenueType = 'bar' | 'restaurant' | 'other';

export type Visit = {
	id: string;
	visitedAt: string;
	venue: string;
	venueType?: VenueType;
	orders: string[];
	rating?: number;
	notes?: string;
	createdAt: string;
	updatedAt: string;
};

export type VisitDraft = {
	venue: string;
	venueType?: VenueType;
	visitedAt: string;
	orders: string[];
	rating?: number;
	notes?: string;
};
