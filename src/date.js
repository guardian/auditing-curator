export function format (when) {
	return [
		when.getUTCFullYear(),
		('0' + (when.getUTCMonth() + 1)).slice(-2),
		('0' + when.getUTCDate()).slice(-2)
	].join('_');
}

export function subtractDays (date, days) {
	const resultDate = new Date(date);
	resultDate.setUTCDate(date.getUTCDate() - days);
	return resultDate;
}
