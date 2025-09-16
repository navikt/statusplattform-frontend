import Head from "next/head"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"

import Layout from "../components/Layout"
import CustomNavSpinner from "../components/CustomNavSpinner"
import DashboardTemplate from "./Dashboard/DashboardTemplate"
import { UserStateContext } from "../components/ContextProviders/UserStatusContext"
import { RouterSPSamarbeidspartner } from "../types/routes"
import { Dashboard } from "../types/types"
import { EndPathDashboards } from "../utils/apiHelper"
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

    // Find the "Internt" dashboard
    const dashboard = dashboards.find(
        ({ name }) => name.toLowerCase() === "internt"
    )

    if (!dashboard) {
        return {
            props: {
                isEmpty: true,
            },
        }
    }

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

interface InternalDashboardProps {
    dashboards: Dashboard[]
    initialDashboard: Dashboard
    isEmpty?: boolean
}

const InternalDashboard = (props: InternalDashboardProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [retrievedDashboard, setRetrievedDashboard] = useState<
        Dashboard | undefined
    >()

    const user = useContext(UserStateContext)

    useEffect(() => {
        setIsLoading(true)

        // Redirect external users to external statuspage
        if (!user.navIdent && router.isReady) {
            router.push(RouterSPSamarbeidspartner.PATH)
            return
        }

        if (!props.isEmpty) {
            // Find the "Internt" dashboard
            const dashboardMatchingTarget: Dashboard | undefined =
                props.dashboards.find((dashboard) =>
                    dashboard.name.toLowerCase() === "internt"
                )
            setRetrievedDashboard(dashboardMatchingTarget)
        }

        setIsLoading(false)
    }, [router, user])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    if (!retrievedDashboard && router.isReady) {
        return (
            <Layout>
                Fant ikke internt dashboard
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>Internt Dashboard - status.nav.no</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta name="title" content="Navstatus Internt" />
                <meta
                    name="description"
                    content="Intern statusside for NAV digitale tjenester - kun tilgjengelig for NAV-ansatte."
                />
            </Head>
            <DashboardTemplate
                dashboardProp={retrievedDashboard}
                isFullScreen={false}
                initialDashboard={props.initialDashboard}
                user={user}
            />
        </Layout>
    )
}

export default InternalDashboard