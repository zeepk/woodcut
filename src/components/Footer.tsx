import Logo from "../assets/images/logo.png";

type FooterLink = {
  text: string;
  href: string;
};

const footerLinks: FooterLink[] = [
  { text: "Twitter", href: "https://twitter.com/matthughes2112" },
  { text: "Discord", href: "https://discord.gg/Q4wv7GfExe" },
  { text: "Github", href: "https://github.com/zeepk/woodcut" },
  { text: "API Access", href: "https://github.com/zeepk/woodcut" },
  { text: "CLI Tool", href: "https://github.com/zeepk/woodcut-cli" },
  { text: "Support", href: "https://matthughes.dev/support" },
];

const Footer = () => {
  return (
    <div className="max-w-screen bottom-0 flex w-full flex-col items-center justify-center bg-forest-700 py-8 md:flex-row">
      <img
        src={Logo.src}
        alt="logo"
        className="mx-2 mb-2 w-40 md:h-full md:w-40"
      />
      <div className="flex max-w-[20rem] flex-wrap items-center justify-center">
        {footerLinks.map((link) => (
          <a
            key={link.text}
            href={link.href}
            className="w-40 py-2 text-center text-white hover:underline"
          >
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;
