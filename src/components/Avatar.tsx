import React, { useState } from "react";
type props = {
  username: string;
  width?: string;
};

const Avatar = ({ username, width = "w-full" }: props) => {
  const [imgKey, setImgKey] = useState(0);
  const formattedUsername = username.split(" ").join("+");
  const url = `https://secure.runescape.com/m=avatar-rs/${formattedUsername}/chat.png`;

  const backupUrl =
    "https://runescape.wiki/images/Blank_forum_avatar.png?fe2d0";

  return (
    <img
      src={url}
      key={imgKey}
      alt="avatar"
      className={width}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = backupUrl;
        if (imgKey === 0) {
          currentTarget.src = url;
          setImgKey(1);
        }
      }}
    />
  );
};

export default Avatar;
