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
			return
				    [
						{
							source: "/oauth2/:path*",
							destination: process.env.NODE_ENV == "production"? `https://status.nav.no/sp/backend/oauth2/:path*`
							:(process.env.NODE_ENV == "test"? `https://digitalstatus.ekstern.dev.nav.no/oauth2/:path*`  : `http://localhost:3005/oauth2/:path*`),
						},
						{
							source: "/rest/:path*",
								destination: process.env.NODE_ENV == "production"? `https://status.nav.no/sp/backend/:path*`
                            							:(process.env.NODE_ENV == "test"? `https://digitalstatus.ekstern.dev.nav.no/oauth2/:path*`  : `http://localhost:3005/oauth2/:path*`),
						},
				  ]
		},
	}
)
