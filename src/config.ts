import type {
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "0xc60f",
	subtitle: "The personal blog of 0xc60f",
	lang: "en", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/website-banner.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		 {
		   src: '/favicon/favicon.ico',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		 }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/0xc60f", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/website-pfp.gif", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "0xc60f",
	bio: "College student dual majoring in CS + Stats.",
	links: [
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com/id/0xc60f",
		},
		{
			name: "Mastodon",
			icon: "fa6-brands:mastodon",
			url: "https://mastodon.social/@0xc60f",
		},
		{
			name: "Bluesky",
			icon: "fa6-brands:bluesky",
			url: "https://bsky.app/profile/0xc60f.com",
		},
		{
			name: "Reddit",
			icon: "fa6-brands:reddit",
			url: "https://reddit.com/user/x0xc60f",
		},
		{
			name: "Discord",
			icon: "fa6-brands:discord",
			url: "https://discord.com/users/942859618130989087",
		},
		{
			name: "Youtube",
			icon: "fa6-brands:youtube",
			url: "https://youtube.com/@0xc60f",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/0xc60f",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
