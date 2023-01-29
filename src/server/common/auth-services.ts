import {
  RunescapeApiPlayerDetailsUrlPre,
  RunescapeApiPlayerDetailsUrlPost,
  RunescapeApiClanIdCheck,
} from "../../utils/constants";

export const getClanFromUsername = async (
  username: string
): Promise<string | null> => {
  const data = await fetch(
    `${RunescapeApiPlayerDetailsUrlPre}${username}${RunescapeApiPlayerDetailsUrlPost}`
  )
    .then((res) => res.text())
    .catch((err) => {
      console.log(err);
      return null;
    });
  if (!data || data.indexOf(`"clan":"`) === -1) {
    return null;
  }
  const firstHalf = data.split(`"clan":"`)[1];
  const clanName = firstHalf.substring(0, firstHalf.indexOf(`"`));
  return clanName;
};

interface ValidateWorldProps {
  world: number;
  clanName: string;
  username: string;
}

export const validateWorld = async ({
  world,
  clanName,
  username,
}: ValidateWorldProps): Promise<{
  success: boolean;
  message: string;
}> => {
  const resp = {
    success: false,
    message: "",
  };
  const data = await fetch(`${RunescapeApiClanIdCheck}${clanName}`)
    .then((res) => res.text())
    .catch((err) => {
      console.log(err);
      return null;
    });
  if (!data || data.indexOf("clanId=") === -1) {
    return resp;
  }

  const firstHalf = data.split("clanId=")[1];
  const clanId = firstHalf.substring(0, firstHalf.indexOf("&"));

  const clanMembersPage = await fetch(
    `https://secure.runescape.com/m=clan-hiscores/members.ws?expandPlayerName=${username}&clanId=${clanId}&ranking=-1&pageSize=15&submit=submit#expanded`
  )
    .then((res) => res.text())
    .then((res) => res.replace(/\uFFFD/g, " "))
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (
    !clanMembersPage ||
    clanMembersPage.indexOf(`span class="name">${username}</span>`) === -1
  ) {
    resp.message = "Player not found on clan members page";
    console.log(resp.message);
    return resp;
  }

  const firstHalfOfPage = clanMembersPage.split(
    `span class="name">${username}</span>`
  )[1];
  const firstHalfOfWorld = firstHalfOfPage.split(`<span class="world">`)[1];
  const worldString = firstHalfOfWorld.substring(
    0,
    firstHalfOfWorld.indexOf(`</span>`)
  );
  const online = worldString.trim().replace("RS ", "");
  const worldNumber = parseInt(online, 10);
  if (isNaN(worldNumber)) {
    resp.message = "User is offline";
    console.log(resp.message);
    return resp;
  }

  if (worldNumber !== world) {
    resp.message = `User is on world ${worldNumber}, not ${world}`;
    console.log(resp.message);
    return resp;
  }

  resp.success = true;
  return resp;
};
