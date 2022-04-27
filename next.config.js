const withPlugins = require("next-compose-plugins")
const withTranspileModules = require("next-transpile-modules")
const withCss = require("@zeit/next-css")
const withLess = require("@zeit/next-less")
const packageJson = require("./package.json")
const withTM = require("next-transpile-modules")(["@navikt/ds-icons"])

module.exports = withPlugins(
	[
		withTranspileModules(
			Object.keys(packageJson.dependencies).filter((key) =>
				key.startsWith("nav-frontend-")
			)
		),
		withCss,
		withLess,
		withTM,
	],

	{
		i18n: {
			locales: ["no"],
			defaultLocale: "no",
		},

		basePath: "/sp",
		assetPrefix: "/sp/",

		async rewrites() {
			// sett opp miljøvar
			switch (process.env.NODE_ENV) {
				case "production":
					return [
						{
							source: "/oauth2/:path*",
							destination: `https://status.nav.no/sp/oauth2/:path*`,
						},
						{
							source: "/rest/:path*",
							destination: `https://status.nav.no/sp/rest/:path*`,
						},
					]
				case "test":
					return [
						{
							source: "/oauth2/:path*",
							destination: `https://digitalstatus.ekstern.dev.nav.no/oauth2/:path*`,
						},
						{
							source: "/rest/:path*",
							destination: `https://digitalstatus.ekstern.dev.nav.no/rest/:path*`,
						},
					]
				default:
					return [
						{
							source: "/oauth2/:path*",
							destination: `http://localhost:3005/oauth2/:path*`,
						},
						{
							source: "/rest/:path*",
							destination: `http://localhost:3005/rest/:path*`,
						},
					]
			}
		},
	}
)
