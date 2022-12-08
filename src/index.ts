import { Hono } from "hono";
import * as jose from "jose";

const app = new Hono();

const TEAM_DOMAIN = "cafedomancer"; // TODO your team domain
const POLICY_AUD =
  "b6f01f510a3ee259afc887bfe593b889a37e6f36663ced575c23a54b890f556d"; // TODO your policy aud

// TODO extract as middleware

const JWKS = jose.createRemoteJWKSet(
  new URL(`https://${TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs`)
);

app.get("/", async (c) => {
  const jwt = c.req.headers.get("Cf-Access-Jwt-Assertion");
  if (!jwt) return c.status(401);

  const { payload } = await jose.jwtVerify(jwt, JWKS, {
    algorithms: ["RS256"],
    audience: POLICY_AUD,
    issuer: `https://${TEAM_DOMAIN}.cloudflareaccess.com`,
  });

  console.log(payload);

  const email = payload.email;

  return c.json({ message: `hello, ${email}` });
});

export default app;
