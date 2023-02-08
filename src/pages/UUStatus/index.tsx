import Head from "next/head"
import styled from "styled-components"
import { useContext, useState } from "react"

import Layout from "../../components/Layout"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import { backendPath } from ".."
import { EndPathUUTjeneste, EndPathUUKrav } from "../../utils/apiHelper"
import { GuidePanel, Tabs } from "@navikt/ds-react"
import StatusTableUUTjeneste from "../../components/StatusTableUUTjeneste"

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
const TabsCustomized = styled(Tabs)`
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
`

export const getServerSideProps = async () => {
    const resUniversellUtforming = await fetch(
        backendPath + EndPathUUTjeneste()
    )
    const UUDataTjenester = await resUniversellUtforming.json()
    return {
        props: { UUDataTjenester },
    }
}

/* export async function getServerSideProps(context) {
    console.log("Context inside getserverSideProps: " + context)
    const [resUUTjenester, resUUKrav] = await Promise.all([
        fetch(backendPath + EndPathUUTjeneste()),
        fetch(backendPath + EndPathUUKrav()),
    ])
    const [UUDataTjenester, UUDataKrav] = await Promise.all([
        resUUTjenester.json(),
        resUUKrav.json(),
    ])
    return { props: { UUDataTjenester, UUDataKrav } }
} */

const UUDashboard = ({ UUDataTjenester, UUDataKrav }) => {
    const user = useContext(UserStateContext)

    const [state, setState] = useState("tjeneste")

    const handleNewSelectedTab = (aksjon: String) => {
        switch (aksjon) {
            case "tjeneste":
                console.log("Tjeneste er valgt")

                return ""
            case "krav":
                console.log("Krav er valgt")
                return ""
        }
    }

    return (
        <Layout>
            <Head>
                <title>UU Status - status.nav.no</title>
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
                <TabsCustomized
                    defaultValue="Tjenester"
                    value={state}
                    onChange={setState}
                >
                    <Tabs.List>
                        <Tabs.Tab
                            key={0}
                            value={"tjeneste"}
                            label={"Tjeneste"}
                            onClick={() => handleNewSelectedTab("tjeneste")}
                        />
                        <Tabs.Tab
                            key={1}
                            value={"krav"}
                            label={"Krav"}
                            onClick={() => handleNewSelectedTab("krav")}
                        />
                    </Tabs.List>
                    <Tabs.Panel
                        value="tjeneste"
                        className="h-24 w-full bg-gray-50 p-4"
                    >
                        Tjeneste-tab
                        <StatusTableUUTjeneste
                            UUdataTjeneste={UUDataTjenester}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel
                        value="krav"
                        className="h-24 w-full bg-gray-50 p-4"
                    >
                        Krav-tab
                        <StatusTableUUTjeneste
                            UUdataTjeneste={UUDataTjenester}
                        />
                    </Tabs.Panel>
                </TabsCustomized>
            </div>
        </Layout>
    )
}

export default UUDashboard
