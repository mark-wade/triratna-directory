export function formatDate(date: Date, withYear: boolean = true): string {
    return date.toLocaleDateString('en-GB', {
        year: withYear ? "numeric" : undefined,
        month: "long",
        day: "numeric",
    });
}

export function yearsAndMonthsBetweenDates(firstDate: Date, secondDate: Date) {
	let years = secondDate.getFullYear() - firstDate.getFullYear();
	let months = secondDate.getMonth() - firstDate.getMonth();
	if (months < 0) {
		years--;
		months = 12 + months;
	}
	return (years ? (years + " year" + (years != 1 ? "s" : "")) : "")
        + ((years && months) ? " and " : "")
        + (months ? (months + " month" + (months != 1 ? "s" : "")) : "");
}