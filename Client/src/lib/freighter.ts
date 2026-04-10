const LOCALHOST_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);
const FREIGHTER_ACCESS_ATTEMPTS = 2;
const FREIGHTER_ACCESS_DELAY_MS = 1000;

function isLocalDevelopmentHost(hostname: string) {
  return LOCALHOST_HOSTNAMES.has(hostname);
}

function withTimeout<T>(promise: Promise<T>, label: string, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(
        new Error(
          `${label} timed out. Freighter may be locked, disabled, or waiting on a hidden browser prompt.`
        )
      );
    }, timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function wait(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function extractFreighterMessage(error: unknown) {
  if (typeof error === 'string') {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'The wallet request could not be completed.';
}

function assertFreighterContext() {
  if (typeof window === 'undefined') {
    throw new Error('Freighter is only available in a browser session.');
  }

  if (!window.isSecureContext && !isLocalDevelopmentHost(window.location.hostname)) {
    throw new Error(
      'Freighter requires a secure browser context. Use https or open the app on localhost.'
    );
  }
}

async function loadFreighterApi() {
  assertFreighterContext();
  return import('@stellar/freighter-api');
}

export function freighterErrorMessage(error: unknown) {
  return extractFreighterMessage(error);
}

export async function connectFreighterWallet() {
  const { isConnected, requestAccess } = await loadFreighterApi();
  let lastAccessError: unknown = null;

  for (let attempt = 0; attempt < FREIGHTER_ACCESS_ATTEMPTS; attempt += 1) {
    try {
      const accessResult = await withTimeout(requestAccess(), 'Freighter access request', 20000);

      if (accessResult.error || !accessResult.address) {
        throw new Error(
          accessResult.error
            ? extractFreighterMessage(accessResult.error)
            : 'Freighter did not return a wallet address.'
        );
      }

      return accessResult.address.trim().toUpperCase();
    } catch (error) {
      lastAccessError = error;

      if (attempt < FREIGHTER_ACCESS_ATTEMPTS - 1) {
        await wait(FREIGHTER_ACCESS_DELAY_MS);
      }
    }
  }

  try {
    const connection = await withTimeout(isConnected(), 'Freighter extension detection', 3000);

    if (connection.error) {
      throw new Error(extractFreighterMessage(connection.error));
    }

    if (!connection.isConnected) {
      throw new Error(
        'Freighter was not detected in this browser. Open or enable the extension, and make sure its Chrome site access for localhost is not set to "On click".'
      );
    }
  } catch (error) {
    throw new Error(extractFreighterMessage(lastAccessError ?? error));
  }

  throw new Error(
    extractFreighterMessage(
      lastAccessError ?? 'Freighter could not complete the wallet connection request.'
    )
  );
}

export async function getFreighterNetworkDetails() {
  const { getNetworkDetails } = await loadFreighterApi();
  const result = await withTimeout(getNetworkDetails(), 'Freighter network lookup', 5000);

  if (result.error) {
    throw new Error(extractFreighterMessage(result.error));
  }

  return result;
}

export async function signWithFreighter(
  transactionXdr: string,
  input: { address: string; networkPassphrase: string }
) {
  const { signTransaction } = await loadFreighterApi();
  const result = await withTimeout(
    signTransaction(transactionXdr, {
      networkPassphrase: input.networkPassphrase,
      address: input.address
    }),
    'Freighter signature request',
    45000
  );

  if (result.error || !result.signedTxXdr) {
    throw new Error(
      result.error
        ? extractFreighterMessage(result.error)
        : 'Freighter did not return a signed transaction.'
    );
  }

  return result;
}
