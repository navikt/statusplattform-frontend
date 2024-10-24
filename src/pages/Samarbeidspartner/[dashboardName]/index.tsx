import Head from "next/head"
import { useContext } from "react"
import Layout from "../../../components/LayoutExternal"
import DashboardTemplate from "./DashboardTemplate"
import { UserStateContext } from "../../../components/ContextProviders/UserStatusContext"
import { Dashboard } from "../../../types/types"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH
    const res = await fetch(backendPath + "/rest/Dashboards/external")

    const dashboards: Dashboard[] = await res.json()
    const queryDashboard = context.query.dashboardName as string
    const dashboard= dashboards.find(
        ({ name }) => name.toLowerCase() === queryDashboard.toLowerCase()
    )
    return {
        props: {
            dashboard,
        },
    }
}

interface DashboardFromNameProps {
    dashboard: Dashboard
}

const DashboardFromName = ({ dashboard }: DashboardFromNameProps) => {
    const user = useContext(UserStateContext)

    return (
        <Layout>
            <Head>
                <title>{dashboard.name} - status.nav.no</title>
                <link rel="icon" href="/sp/favicon.ico" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta name="title" content="Navstatus" />
                <meta
                    name="description"
                    content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere."
                />
                <meta
                    property="image"
                    content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg"
                />
                <meta property="url" content="https://status.nav.no/sp" />
                <meta property="type" content="website" />

                {/* <!-- Open Graph / Facebook --> */}
                <meta
                    property="og:site_name"
                    content="Status Nav digitale tjenester"
                />
                <meta
                    property="og:title"
                    content="Status Nav digitale tjenester"
                />
                <meta
                    property="og:description"
                    content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere."
                />
                <meta
                    property="og:image"
                    content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg"
                />
                <meta property="og:url" content="https://status.nav.no/sp" />
                <meta property="og:type" content="website" />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:url"
                    content="https://status.nav.no/sp"
                />
                <meta property="twitter:title" content="Navstatus" />
                <meta
                    property="twitter:description"
                    content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere."
                />
                <meta
                    property="twitter:image"
                    content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg"
                />
            </Head>
            <DashboardTemplate
                dashboardProp={dashboard}
                isFullScreen={false}
                initialDashboard={dashboard}
                user={user}
            />
        </Layout>
    )
}

export default DashboardFromName