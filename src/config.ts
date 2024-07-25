import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://0xc60f.github.io", // replace this with your deployed domain
  author: "0xc60f",
  desc: "The personal blog and portfolio of 0xc60f.",
  title: "0xc60f",
  ogImage: "bigimage.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
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
  {
    name: "Mastodon",
    href: "https://mastodon.social/@0xc60f",
    linkTitle: `${SITE.title} on Mastodon`,
    active: true,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/profiles/76561199575889059/",
    linkTitle: `${SITE.title} on Steam`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/0xc60f",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/0xc60f",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
];
