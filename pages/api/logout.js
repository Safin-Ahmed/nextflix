import { removeTokenCookie } from "../../lib/cookies";
import { magicAdmin } from "../../lib/magic";
import { verifyToken } from "../../lib/utils";
export default async function logout(req, res) {
  try {
    // Logout
    const token = req.cookies.token;
    const issuer = await verifyToken(token);
    const logout = await magicAdmin.users.logoutByIssuer(issuer);

    // Clear Cookies
    removeTokenCookie(res);

    // Redirect to Login page
    res.writeHead(302, { Location: "/login" });
    res.status(200).send({ logout });
    res.end();
  } catch (e) {
    console.log("Error Logging Out ", e);
    res.status(500).send({ error: e });
  }
}
