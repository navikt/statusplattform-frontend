import { useRouter } from "next/router"
import Head from "next/head"
import { useEffect, useState } from "react"

import DashboardFromName from "./Dashboard/[dashboardName]"
import { RouterInternt, RouterPrivatperson } from "../types/routes"
import CustomNavSpinner from "../components/CustomNavSpinner"
import { UserData } from "../types/userData"
import { checkLoginInfoAndState } from "../utils/checkLoginInfoAndState"
import { GuidePanel } from "@navikt/ds-react"
import styled from "styled-components"
import Link from "next/link"

export const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH

export const VerticalSeparator = styled.span`
    display: block;

    padding: 1px 1px;
    height: 100%;
    margin: 0 0.5rem;

    background-color: var(--a-gray-200);
`

const UUHeading = styled.div`
    .guidepanel {
        @media (min-width: 390px) {
            margin: 0;
            width: 100%;
        }

        @media (min-width: 850px) {
            margin: 1rem 0 2rem -2.5rem;
            width: 52.2rem;
        }
    }
`
// const TabsCustomized = styled(Tabs)`
//     border-top: 0;
//     border-top-left-radius: 0;
//     border-top-right-radius: 0;
// `

export default function Home() {
    const router = useRouter()
    const [atHomePage] = useState(false)

    useEffect(() => {
        ;(async function () {
            const user: UserData = await checkLoginInfoAndState()

            await user

            if (user.navIdent && router.isReady && router.asPath == "/") {
                router.push(RouterInternt.PATH)
            } else if (
                !user.navIdent &&
                router.isReady &&
                router.asPath == "/"
            ) {
                router.push(RouterPrivatperson.PATH)
            }
        })()
    }, [router])

    if (!router.isReady) {
        return <CustomNavSpinner />
    }

    return (
        <>
            <Head>
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
            <UUHeading>
                <GuidePanel className="guidepanel">
                    Her finner du informasjon om status for universell utforming
                    for digitale tjenester i NAV. Kravene er hentet fra
                    <b> Web Content Accessibility Guidelines (WCAG) 2.1.</b>
                </GuidePanel>
            </UUHeading>
            <div>
                <ul>
                    <li>
                        <Link href="UUStatus/tjeneste" />
                    </li>
                    <li>
                        <Link href="UUStatus/krav" />
                    </li>
                </ul>
            </div>
            {atHomePage && (
                <DashboardFromName dashboards={null} initialDashboard={null} />
            )}
        </>
    )
}
