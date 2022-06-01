import Head from 'next/head'
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"

import { BodyShort, Button } from "@navikt/ds-react"

import Layout from '../../components/Layout'
import CustomNavSpinner from "../../components/CustomNavSpinner"
import DashboardTemplate from "./DashboardTemplate"
import Custom404 from "../../pages/404"
import { UserData } from "../../types/userData"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import { RouterPrivatperson } from "../../types/routes"
import { Dashboard } from "../../types/navServices"
import { FullscreenEnter, FullscreenExit } from "@navikt/ds-icons"
import { EndPathDashboards } from '../../utils/apiHelper'


export async function getServerSideProps() {
    const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH
    const res = await fetch(backendPath + EndPathDashboards())
    const data = await res.json()

    return {
        props: {data}
    }
}


const DashboardFromId = ({data: dashboards}) => {
    const router = useRouter()


    const [isLoading, setIsLoading] = useState(true)
    const [retrievedDashboard, setRetrievedDashboard] = useState<Dashboard | undefined>()
    const [isFullScreen, changeIsFullScreen] = useState(false)

    const user = useContext<UserData>(UserStateContext)



    useEffect(() => {
        (async function () {
            setIsLoading(true)
            let dashboardTarget: Object = await router.query.dashboardId
            const dashboardMatchingTarget: Dashboard | undefined = (dashboards.find(dashboard => dashboard.name == dashboardTarget ? dashboard : undefined))
            setRetrievedDashboard(dashboardMatchingTarget)
            setIsLoading(false)
        })()
    }, [router])

    
    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    
    if(!retrievedDashboard && router.isReady) {
        console.log("faen da")
        return (
            <Custom404 />
        )
    }

    if(router.asPath.includes("Internt") && !user.navIdent) {
        router.push(RouterPrivatperson.PATH)
    }

    if(isFullScreen) {
        return (
            <>
                <FullScreenButton isFullScreen={isFullScreen} changeIsFullScreen={(changed: boolean) => changeIsFullScreen(changed)} />
                <DashboardTemplate dashboard={retrievedDashboard} isFullScreen={isFullScreen} />
            </>
        )
    }



    return (
        <Layout>
            <Head>
                <title>{retrievedDashboard.name} - status.nav.no</title>
                <link rel="icon" href="/sp/favicon.ico" />
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
            <FullScreenButton isFullScreen={isFullScreen} changeIsFullScreen={(changed: boolean) => changeIsFullScreen(changed)} />
            <DashboardTemplate dashboard={retrievedDashboard} isFullScreen={isFullScreen}/>
        </Layout>
    )
}






const FullScreenFixedButton = styled(Button)`
    display: none;

    svg {
        height: 16px;
        width: 16px;
        vertical-align: middle;
    }

    @media(min-width: 1000px) {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        height: 43px;
    }
`


export const FullScreenButton: React.FC<{isFullScreen: boolean, changeIsFullScreen: (changed: boolean) => void}> = ({isFullScreen, changeIsFullScreen}) => {
    return (
        <FullScreenFixedButton variant="tertiary" size="small" onClick={() => changeIsFullScreen(!isFullScreen)}>
            {!isFullScreen ? <BodyShort size="small">Fullskjerm <FullscreenEnter /></BodyShort> : <BodyShort size="small">Lukk fullskjerm<FullscreenExit /></BodyShort>}
        </FullScreenFixedButton>
    )
}







export default DashboardFromId