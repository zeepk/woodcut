import { NextApiRequest, NextApiResponse } from "next";
import { createNewStatRecordForAllUsers } from "../../../src/server/common/stat-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.UPDATE_USERS_SECRET}`) {
        const response = await createNewStatRecordForAllUsers();
        res.status(200).json({ success: true, response });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
