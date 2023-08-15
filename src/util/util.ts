export type Predicate<T> = (value: T) => boolean;
export type Consumer<T> = (value: T) => void;

export const allMatch = <T>(array: T[], predicate: Predicate<T>) => {
	for (const v of array) {
		if (!predicate(v)) return false;
	}
	return true;
};
export const anyMatch = <T>(array: T[], predicate: Predicate<T>) => {
	for (const v of array) {
		if (predicate(v)) return true;
	}
	return false;
};

export const compare = <T>(a: T, b: T) => {
	if (a == b) return 0; // あえて == にしている
	return a > b ? 1 : -1;
};
