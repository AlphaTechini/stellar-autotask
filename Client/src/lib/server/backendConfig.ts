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

export function getPlatformFundingWallet() {
	const configuredValue =
		privateEnv.PLATFORM_FUNDING_WALLET ??
		publicEnv.PUBLIC_PLATFORM_FUNDING_WALLET ??
		privateEnv.STELLAR_PAYOUT_ADMIN_PUBLIC_KEY ??
		publicEnv.PUBLIC_STELLAR_PAYOUT_ADMIN_PUBLIC_KEY;

	return configuredValue ? configuredValue.trim().toUpperCase() : null;
}

export function getStellarHorizonUrl() {
	const configuredValue = privateEnv.STELLAR_HORIZON_URL ?? publicEnv.PUBLIC_STELLAR_HORIZON_URL;

	return configuredValue ? trimTrailingSlash(configuredValue) : null;
}

export function getStellarNetworkPassphrase() {
	const configuredValue =
		privateEnv.STELLAR_NETWORK_PASSPHRASE ?? publicEnv.PUBLIC_STELLAR_NETWORK_PASSPHRASE;

	return configuredValue ? configuredValue.trim() : null;
}

export function isDevAuthEnabled() {
	return publicEnv.PUBLIC_ENABLE_DEV_AUTH === 'true';
}
