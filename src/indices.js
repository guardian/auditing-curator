import {format} from './date';

export function extractOldIndices (older, list) {
	// Return all index older than `older` date, not equal
	return list.filter(index => {
		const formatted = format(older);
		return index.date < formatted;
	})
	.sort((a, b) => {
		return a.date < b.date;
	});
}
