import { removeTokenCookie } from "../../lib/cookies";
import { magicAdmin } from "../../lib/magic";
import { verifyToken } from "../../lib/utils";
export default async function logout(req, res) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({ message: "User is not logged in" });
    }
    // Logout
    const token = req.cookies.token;
    const issuer = await verifyToken(token);
    removeTokenCookie(res);
    try {
      await magicAdmin.users.logoutByIssuer(issuer);
    } catch (e) {
      console.error("Error Logging Out ", e);
    }
    // Redirect to Login page
    res.writeHead(302, { Location: "/login" });
    res.end();
  } catch (e) {
    console.error({ error: e });
    res.status(401).json({ message: "User is not logged in" });
  }
}
