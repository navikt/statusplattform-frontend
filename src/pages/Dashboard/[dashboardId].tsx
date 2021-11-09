import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from 'next/head'

import CustomNavSpinner from "components/CustomNavSpinner"
import DashboardTemplate from "./DashboardTemplate"
import Layout from 'components/Layout'

import { Dashboard } from "types/navServices"
import { fetchDashboardsList } from "utils/fetchDashboardsList"
import Custom404 from "pages/404"


const DashboardFromId = () => {
    const router = useRouter()
    let dashboardTarget: Object = router.query.dashboardId

    const [isLoading, setIsLoading] = useState(true)
    const [retrievedDashboard, setRetrievedDashboard] = useState<Dashboard | undefined>()


    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const dashboards: Dashboard[] = await fetchDashboardsList()
            const arbeidsGiverDashboard: Dashboard | undefined = (dashboards.find(dashboard => dashboard.name == dashboardTarget ? dashboard : undefined))
            setRetrievedDashboard(arbeidsGiverDashboard)
            setIsLoading(false)
        })()
    }, [dashboardTarget])

    

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    

    if(!retrievedDashboard) {
        return (
            <Custom404 />
        )
    }

    

    return (
        <Layout>
            <Head>
                <title>{retrievedDashboard.name}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="title" content="Navstatus" />
                <meta name="description" content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere." />
                <meta property="image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg" />
                <meta property="url" content="https://portal.labs.nais.io/Dashboard/Privatperson" />
                <meta property="type" content="website" />


                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:site_name" content="Status Nav digitale tjenester" />
                <meta property="og:title" content="Status Nav digitale tjenester" />
                <meta property="og:description" content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere." />
                <meta property="og:image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg" />
                <meta property="og:url" content="https://portal.labs.nais.io/Dashboard/Privatperson" />
                <meta property="og:type" content="website" />


                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://portal.labs.nais.io/Dashboard/Privatperson" />
                <meta property="twitter:title" content="Navstatus" />
                <meta property="twitter:description" content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere." />
                <meta property="twitter:image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg" />
            </Head>
            <DashboardTemplate dashboard={retrievedDashboard}/>
        </Layout>
    )
}

export default DashboardFromId