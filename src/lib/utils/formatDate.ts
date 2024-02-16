import { format } from 'date-fns';

export function formatDate(date: string) {
	return format(new Date(date), 'LLLL d, yyyy');
}

export function formatDateToHtmlElements(date: Date | number): string {
	const formattedDate = new Date(date);
	const month = format(formattedDate, 'LLLL');
	const day = format(formattedDate, 'd');
	const year = format(formattedDate, 'yyyy');

	return `<div>${month}</div><div>${day}</div><div>${year}</div>`;
}