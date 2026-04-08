import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

function trimTrailingSlash(value: string) {
	return value.replace(/\/+$/, '');
}

export function getBackendBaseUrl() {
	const configuredValue = privateEnv.BACKEND_BASE_URL ?? publicEnv.PUBLIC_BACKEND_BASE_URL;

	if (!configuredValue) {
		throw new Error(
			'Missing backend base URL. Set BACKEND_BASE_URL or PUBLIC_BACKEND_BASE_URL in the frontend environment.'
		);
	}

	return trimTrailingSlash(configuredValue);
}

export function isDevAuthEnabled() {
	return publicEnv.PUBLIC_ENABLE_DEV_AUTH === 'true';
}
