export const isValidPassword = (password: string): boolean => {
	return password.length >= 6;
};

export const isValidEmail = (email: string): boolean => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateSignup = (
	email: string,
	password: string
): string | null => {
	if (!isValidEmail(email)) {
		return "Please enter a valid email.";
	}
	if (!isValidPassword(password)) {
		return "Password must be at least 6 characters.";
	}
	return null;
};

export const validateLogin = (
	email: string,
	password: string
): string | null => {
	if (!isValidEmail(email)) {
		return "Please enter a valid email.";
	}
	if (!isValidPassword(password)) {
		return "Password must be at least 6 characters.";
	}
	return null;
};
