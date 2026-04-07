type DatabaseSslMode = 'disable' | 'require';

type DatabaseConnectionInput = {
  DATABASE_URL?: string;
  DATABASE_HOST?: string;
  DATABASE_PORT?: string | number;
  DATABASE_USER?: string;
  DATABASE_NAME?: string;
  DATABASE_PASSWORD?: string;
  DATABASE_SSL?: DatabaseSslMode;
  DATABASE_USE_POOLER?: string | boolean;
  DATABASE_ENABLE_PREPARED_STATEMENTS?: string | boolean;
};

type ResolvedDatabaseConfig = {
  databaseUrl: string;
  databaseSsl: DatabaseSslMode;
  databaseUsePooler: boolean;
  databaseEnablePreparedStatements: boolean;
};

export function resolveDatabaseConfig(input: DatabaseConnectionInput): ResolvedDatabaseConfig {
  const databaseUsePooler = parseBoolean(input.DATABASE_USE_POOLER, false);
  const databaseEnablePreparedStatements = parseBoolean(
    input.DATABASE_ENABLE_PREPARED_STATEMENTS,
    !databaseUsePooler,
  );
  const databaseSsl = input.DATABASE_SSL ?? 'disable';
  const databaseUrl = buildDatabaseUrl(input, {
    databaseUsePooler,
    databaseSsl,
  });

  return {
    databaseUrl,
    databaseSsl,
    databaseUsePooler,
    databaseEnablePreparedStatements,
  };
}

function buildDatabaseUrl(
  input: DatabaseConnectionInput,
  options: {
    databaseUsePooler: boolean;
    databaseSsl: DatabaseSslMode;
  },
) {
  const explicitUrl = input.DATABASE_URL?.trim();

  if (explicitUrl) {
    return applySslMode(explicitUrl, options.databaseSsl);
  }

  const databaseHost = input.DATABASE_HOST?.trim();
  const databasePassword = input.DATABASE_PASSWORD?.trim();

  if (!databaseHost || !databasePassword) {
    throw new Error(
      'Database configuration requires either DATABASE_URL or both DATABASE_HOST and DATABASE_PASSWORD.',
    );
  }

  const databasePort = normalizePort(
    input.DATABASE_PORT,
    options.databaseUsePooler ? 6543 : 5432,
  );
  const databaseUser = encodeURIComponent((input.DATABASE_USER ?? 'postgres').trim());
  const databaseName = encodeURIComponent((input.DATABASE_NAME ?? 'postgres').trim());
  const encodedPassword = encodeURIComponent(databasePassword);
  const databaseUrl =
    `postgresql://${databaseUser}:${encodedPassword}` +
    `@${databaseHost}:${databasePort}/${databaseName}`;

  return applySslMode(databaseUrl, options.databaseSsl);
}

function normalizePort(value: string | number | undefined, fallback: number) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error('DATABASE_PORT must be a positive integer when provided.');
  }

  return parsedPort;
}

function applySslMode(databaseUrl: string, databaseSsl: DatabaseSslMode) {
  const url = new URL(databaseUrl);

  if (databaseSsl === 'require' && !url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require');
  }

  if (databaseSsl === 'disable' && url.searchParams.get('sslmode') === 'require') {
    url.searchParams.delete('sslmode');
  }

  return url.toString();
}

function parseBoolean(value: string | boolean | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true';
}
