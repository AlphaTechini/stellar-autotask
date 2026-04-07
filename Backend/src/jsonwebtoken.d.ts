declare module 'jsonwebtoken' {
  export type JwtPayload = Record<string, unknown> & {
    sub?: string;
    iss?: string;
    exp?: number;
    iat?: number;
  };

  export type SignOptions = {
    issuer?: string;
    expiresIn?: number | string;
  };

  export type VerifyOptions = {
    issuer?: string;
  };

  export function sign(
    payload: string | Buffer | Record<string, unknown>,
    secretOrPrivateKey: string,
    options?: SignOptions,
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string,
    options?: VerifyOptions,
  ): string | JwtPayload;

  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
  };

  export default jwt;
}
