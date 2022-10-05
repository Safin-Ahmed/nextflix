import { jwtVerify } from "jose";
// import jwt from "jsonwebtoken";
// export async function verifyToken(token) {
//   if (token) {
//     const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
//     const userId = decoded?.issuer;
//     return userId;
//   }

//   return null;
// }

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
