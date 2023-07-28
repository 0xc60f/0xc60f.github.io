import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://0xc60f.github.io",
  author: "0xc60f",
  desc: "The personal blog and portfolio of 0xc60f",
  title: "0xc60f",
  ogImage: "astropaper-og.png",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/0xc60f",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:0xc60f@duck.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitch",
    href: "https://twitch.tv/0xc60f",
    linkTitle: `${SITE.title} on Twitch`,
    active: true,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@0xc60f",
    linkTitle: `${SITE.title} on YouTube`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/942859618130989087",
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: "Reddit",
    href: "https://reddit.com/user/x0xc60f",
    linkTitle: `${SITE.title} on Reddit`,
    active: true,
  },
];
