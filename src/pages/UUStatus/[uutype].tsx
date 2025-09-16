import Head from "next/head"
import styled from "styled-components"
import { useContext, useState } from "react"
import { BodyShort } from "@navikt/ds-react"

import Layout from "@/components/Layout"
import { UserStateContext } from "@/components/ContextProviders/UserStatusContext"
import { backendPath } from ".."
import { EndPathUUTjeneste, EndPathUUKrav } from "@/utils/apiHelper"
import { GuidePanel, Tabs } from "@navikt/ds-react"
import UUStatusTable from "@/components/UUStatusTable"
import Link from "next/link"

type TjenesteType = {
    serviceName: String
    criterias: {
        id: String
        result: String
        date: String
        subject: String
    }[]
}

type KravType = {
    criteriaName: String
    services: {
        id: String
        result: String
        date: String
        subject: String
    }[]
}

export type UUDataType = {
    name: String
    subItem: {
        id: String
        result: String
        date: String
        subject: String
    }[]
}

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

const Nav = styled.nav`
    height: 2.75rem;
    //border-bottom: #c6c2bf 1px solid;

    display: none;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;

        li {
            :hover {
                cursor: pointer;
            }

            .inactive {
                border-bottom: transparent 3px solid;

                :hover {
                    border-bottom: var(--a-blue-500) 3px solid;
                }
            }

            :focus,
            :active {
                color: black;
                background-color: transparent;
                outline: var(--a-border-focus) 3px solid;
                box-shadow: 0 0 0 0;
                outline-offset: -3px;
            }

            a {
                text-decoration: none;
                color: black;
            }
        }
    }

    @media (min-width: 768px) {
        display: block;
    }
`
const LenkeSpacer = styled.div`
    margin: 0 1rem;
    height: 100%;

    border-bottom: 3px transparent;
    display: flex;
    align-items: center;

    &.active {
        border-bottom: var(--a-blue-500) 3px solid;

        p {
            font-weight: bold !important;
        }
    }
`

export const getServerSideProps = async (context) => {
    const { uutype } = context.query
    let apiPath = backendPath

    switch (uutype) {
        case "krav":
            apiPath = backendPath + EndPathUUKrav()
            break
        case "tjeneste":
        default:
            apiPath = backendPath + EndPathUUTjeneste()
            break
    }

    const res = await fetch(apiPath)
    const data = await res.json()

    const UUData = data.map((item: TjenesteType & KravType): UUDataType => {
        return uutype === "krav"
            ? {
                name: item.criteriaName,
                subItem: item.services,
            }
            : {
                name: item.serviceName,
                subItem: item.criterias,
            }
    })

    return {
        props: { UUData, uutype },
    }
}

const UUDashboard = ({ UUData, uutype }) => {
    const [href, setHref] = useState("tjeneste")

    const user = useContext(UserStateContext)

    // console.log("tjeneste/krav", uutype, UUData)

    return (
        <Layout>
            <Head>
                <title>Status Universell Utforming - status.nav.no</title>
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
            <UUHeading>
                <GuidePanel className="guidepanel">
                    Her finner du informasjon om status for universell utforming
                    for digitale tjenester i NAV. Kravene er hentet fra
                    <b> Web Content Accessibility Guidelines (WCAG) 2.1.</b>
                    <p>
                        Denne statussiden for UU krav er for øyeblikket ikke oppdatert. Automatisk oppdatering mot gjeldende rapporteringsverktøy vil komme senere.
                        Inntil videre henvises til rapporteringsverktøyet:
                        <a href="http://a11y-statement.nav.no/" target="_blank" rel="noopener noreferrer">
                            http://a11y-statement.nav.no/
                        </a>
                    </p>
                </GuidePanel>
            </UUHeading>
            <Nav>
                <ul role="tablist">
                    <li role="tab">
                        <Link href="tjeneste">
                            <LenkeSpacer
                                className={`${uutype === "tjeneste"
                                        ? "active"
                                        : "inactive"
                                    }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${uutype === "tjeneste" ? "active" : ""
                                        }`}
                                >
                                    Vis Tjeneste
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                    <li role="tab">
                        <Link href="krav">
                            <LenkeSpacer
                                className={`${uutype === "krav" ? "active" : "inactive"
                                    }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${uutype === "krav" ? "active" : ""
                                        }`}
                                >
                                    Vis krav
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                </ul>
            </Nav>
            <div>
                <UUStatusTable UUdata={UUData} UUtype={uutype} />
            </div>
        </Layout>
    )
}

export default UUDashboard
/*
<div>
                <TabsCustomized
                    defaultValue="Tjenester"
                    value={fane}
                    // onChange={setFane}
                >
                    <Tabs.List>
                        <Tabs.Tab
                            key={0}
                            value={"tjeneste"}
                            label={"Tjeneste"}
                            onClick={() => setFane("tjeneste")}
                        />
                        <Tabs.Tab
                            key={1}
                            value={"krav"}
                            label={"Krav"}
                            onClick={() => setFane("krav")}
                        />
                    </Tabs.List>
                    <Tabs.Panel
                        value="tjeneste"
                        className="h-24 w-full bg-gray-50 p-4"
                    >
                        Tjeneste-tab
                        {/* <StatusTableUUTjeneste
                            UUdataTjeneste={UUDataTjenester}
                        /> 
                        </Tabs.Panel>
                        <Tabs.Panel
                            value="krav"
                            className="h-24 w-full bg-gray-50 p-4"
                        >
                            Krav-tab
                            {/* <StatusTableUUTjeneste
                                UUdataTjeneste={UUDataTjenester}
                            /> *
                        </Tabs.Panel>
                    </TabsCustomized>
                </div>*/
