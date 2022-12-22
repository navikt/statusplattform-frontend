const withPlugins = require("next-compose-plugins")
const withTranspileModules = require("next-transpile-modules")
const packageJson = require("./package.json")
const withTM = require("next-transpile-modules")(["@navikt/ds-icons"])

module.exports = withPlugins(
	[
		withTranspileModules(
			Object.keys(packageJson.dependencies).filter((key) =>
				key.startsWith("nav-frontend-")
			)
		),
		withTM,
	],

	{
		i18n: {
			locales: ["no"],
			defaultLocale: "no",
		},

		basePath: "/sp",
		assetPrefix: "/sp/",
	}
)
