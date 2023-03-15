import { type NextApiRequest, type NextApiResponse } from "next";
import { getPlayerData } from "../../../server/common/stat-services";

import { prisma } from "../../../server/db/client";
const ctx = { prisma };

const player = async (req: NextApiRequest, res: NextApiResponse) => {
  // get username from query param
  const username = req.query.username?.toString().split(" ").join("+");
  if (!username || username.length > 12) {
    res.status(400).send("Username is required");
    return;
  }
  const playerGainsResponse = await getPlayerData({ username, ctx });

  if (!playerGainsResponse.success) {
    if (
      playerGainsResponse.message === "Player not found on official hiscores"
    ) {
      res.status(404).send(playerGainsResponse);
    }

    res.status(500).send(playerGainsResponse);
  }

  res.status(200).send(playerGainsResponse);
};

export default player;
