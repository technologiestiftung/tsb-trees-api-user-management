// Verify using getKey callback
// Example uses https://github.com/auth0/node-jwks-rsa as a way to fetch the keys.
import jwksClient from "jwks-rsa";
import { VerifyOptions, JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import { getEnvs } from "./envs";

const { jwksUri, audienceFrontend, issuer } = getEnvs();
const client = jwksClient({
  jwksUri,
});

export const options: VerifyOptions = {
  audience: audienceFrontend,
  issuer,
  algorithms: ["RS256"],
};

export function getKey(header: JwtHeader, callback: SigningKeyCallback): void {
  if (!header.kid) throw new Error("Header.kid is missing");
  client.getSigningKey(header.kid, function (
    err: Error | null,
    key: jwksClient.SigningKey
  ) {
    if (err) {
      callback(err);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
