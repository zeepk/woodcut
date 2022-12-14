import Image from "next/image";

type props = {
  username: string;
  width?: string;
};

const Avatar = ({ username, width = "w-full" }: props) => {
  const formattedUsername = username.split(" ").join("+");
  const url = `https://secure.runescape.com/m=avatar-rs/${formattedUsername}/chat.png`;

  return <Image src={url} alt="logo" className={width} />;
};

export default Avatar;
