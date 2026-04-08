import type { Cookies } from '@sveltejs/kit';
import type { SessionUser } from '$lib/contracts/api';

export type AppSession = {
	token: string;
	user: SessionUser;
};

const SESSION_TOKEN_COOKIE = 'stellar_autotask_session';
const SESSION_USER_COOKIE = 'stellar_autotask_user';
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

function getCookieOptions() {
	return {
		httpOnly: true,
		path: '/',
		sameSite: 'lax' as const,
		secure: process.env.NODE_ENV === 'production',
		maxAge: ONE_DAY_IN_SECONDS
	};
}

export function readSession(cookies: Cookies): AppSession | null {
	const token = cookies.get(SESSION_TOKEN_COOKIE);
	const serializedUser = cookies.get(SESSION_USER_COOKIE);

	if (!token || !serializedUser) {
		return null;
	}

	try {
		const user = JSON.parse(serializedUser) as SessionUser;
		return { token, user };
	} catch {
		clearSession(cookies);
		return null;
	}
}

export function writeSession(cookies: Cookies, session: AppSession) {
	const options = getCookieOptions();
	cookies.set(SESSION_TOKEN_COOKIE, session.token, options);
	cookies.set(SESSION_USER_COOKIE, JSON.stringify(session.user), options);
}

export function clearSession(cookies: Cookies) {
	const options = { ...getCookieOptions(), maxAge: 0 };
	cookies.delete(SESSION_TOKEN_COOKIE, options);
	cookies.delete(SESSION_USER_COOKIE, options);
}
