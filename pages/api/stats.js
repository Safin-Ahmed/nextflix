import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";
export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send({});
    } else {
      const inputParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inputParams;
      if (videoId) {
        const userId = await verifyToken(token);
        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doesStatsExist = findVideo?.length > 0;

        if (req.method === "POST") {
          const { favourited, watched = true } = req.body;
          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            res.send({ data: response });
          } else {
            // add it
            const response = await insertStats(token, {
              watched,
              userId,
              videoId,
              favourited,
            });
            res.send({ data: response });
          }
        } else {
          if (doesStatsExist) {
            // update it
            res.send(findVideo);
          } else {
            // add it

            res.status(404).send({ msg: "Video not found" });
          }
        }
      }
    }
  } catch (e) {
    console.error("Error occured /stats", e);
    res.status(500).send({ done: false, error: e?.message });
  }
}
