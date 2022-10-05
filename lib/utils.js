import { jwtVerify } from "jose";

export async function verifyToken(token) {
  try {
    if (token) {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_PRIVATE_KEY)
      );
      return verified.payload && verified.payload?.issuer;
    }
    return null;
  } catch (e) {
    console.error({ error: e });
    return null;
  }
}
