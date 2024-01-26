export function formatDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
		hour: 'numeric',
		minute: 'numeric',
	};

	const formattedDate = new Date(dateString).toLocaleString('en-GB', options);

	return formattedDate;
}
