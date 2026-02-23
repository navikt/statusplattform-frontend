import Head from "next/head"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"

import { BodyShort, Button } from "@navikt/ds-react"

import Layout from "@/components/Layout"
import CustomNavSpinner from "@/components/CustomNavSpinner"
import DashboardTemplate from "./DashboardTemplate"
import { UserStateContext } from "@/components/ContextProviders/UserStatusContext"
import { RouterPrivatperson } from "@/types/routes"
import { Dashboard } from "@/types/types"
import { ExpandIcon } from "@navikt/aksel-icons"
import { EndPathDashboards } from "@/utils/apiHelper"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH

    const [res] = await Promise.all([fetch(backendPath + EndPathDashboards())])

    const dashboards: Dashboard[] = await res.json()

    if (dashboards.length === 0) {
        return {
            props: {
                isEmpty: true,
            },
        }
    }
    const queryDashboard = context.query.dashboardName as string
    const dashboard = dashboards.find(
        ({ name }) => name.toLowerCase() === queryDashboard.toLowerCase()
    )
    const initialDashboard = await fetch(
        process.env.NEXT_PUBLIC_BACKENDPATH + `/rest/Dashboard/${dashboard.id}`
    ).then((res) => res.json())

    return {
        props: {
            dashboards,
            initialDashboard,
        },
    }
}

interface DashboardFromNameProps {
    dashboards: Dashboard[]
    initialDashboard: Dashboard
    isEmpty?: boolean
}

const DashboardFromName = (props: DashboardFromNameProps) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const [retrievedDashboard, setRetrievedDashboard] = useState<
        Dashboard | undefined
    >()
    const [isFullScreen, changeIsFullScreen] = useState(false)

    const user = useContext(UserStateContext)

    useEffect(() => {
        setIsLoading(true)
        let dashboardTarget: string = router.query.dashboardName as string
        if (!props.isEmpty) {
            const dashboardMatchingTarget: Dashboard | undefined =
                props.dashboards.find((dashboard) =>
                    dashboard.name.toLowerCase() === dashboardTarget.toLowerCase() ? dashboard : undefined
                )
            setRetrievedDashboard(dashboardMatchingTarget)
        }

        setIsLoading(false)
    }, [router])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    if (!retrievedDashboard && router.isReady) {
        return (
            <Layout>
                Fant ikke dashboard med navn: {router.query.dashboardName}
            </Layout>
        )
    }

    if (router.asPath.includes("Internt") && !user.navIdent) {
        router.push(RouterPrivatperson.PATH)
    }

    if (isFullScreen) {
        return (
            <>
                <DashboardTemplate
                    dashboardProp={retrievedDashboard}
                    isFullScreen={isFullScreen}
                    initialDashboard={props.initialDashboard}
                    user={user}
                />
            </>
        )
    }

    return (
        <Layout>
            <Head>
                <title>{retrievedDashboard.name} - status.nav.no</title>
                <link rel="icon" href="/favicon.ico" />
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
                <meta property="url" content="https://status.nav.no/" />
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
                <meta property="og:url" content="https://status.nav.no/" />
                <meta property="og:type" content="website" />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:url"
                    content="https://status.nav.no/"
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
                dashboardProp={retrievedDashboard}
                isFullScreen={isFullScreen}
                initialDashboard={props.initialDashboard}
                user={user}
            />
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

    @media (min-width: 1000px) {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        height: 43px;
    }
`

interface FullscreenButtonProps {
    isFullScreen: boolean
    changeIsFullScreen: (changed: boolean) => void
}

export const FullScreenButton = ({
    isFullScreen,
    changeIsFullScreen,
}: FullscreenButtonProps) => {
    return (
        <FullScreenFixedButton
            variant="tertiary"
            size="small"
            onClick={() => changeIsFullScreen(!isFullScreen)}
        >
            {!isFullScreen ? (
                <BodyShort size="small">
                    Fullskjerm <ExpandIcon />
                </BodyShort>
            ) : (
                <BodyShort size="small">
                    Lukk fullskjerm
                    <ExpandIcon />
                </BodyShort>
            )}
        </FullScreenFixedButton>
    )
}

export default DashboardFromName
