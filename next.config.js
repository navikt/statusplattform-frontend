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
					return [
						{
							source: "/sp/oauth2/:path*",
							destination: `https://status-api.nav.no/oauth2/:path*`,
						},
                        {
                            source: "/oauth2/:path*",
                            destination: `https://status-api.nav.no/oauth2/:path*`,
                        },
						{
							source: "/sp/rest/:path*",
							destination: `https://status-api.nav.no/rest/:path*`,
						},
                        {
                            source: "/rest/:path*",
                            destination: `https://status-api.nav.no/rest/:path*`,
                        },
					]

			}
		},

)
