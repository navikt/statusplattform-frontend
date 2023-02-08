import Head from "next/head"
import styled from "styled-components"
import { useContext, useState } from "react"

import Layout from "../../components/Layout"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import { backendPath } from ".."
import { EndPathUU } from "../../utils/apiHelper"
import { Accordion, BodyShort, GuidePanel, Switch, Tag } from "@navikt/ds-react"
import { countStatuses } from "../../components/UUStatus/utility"
import {
    ErrorFilledCustomized,
    HelpTextCustomizedGray,
    SuccessFilledCustomized,
} from "../../components/TrafficLights"
import UUStatusDetails from "src/components/UUStatusDetails"

const CustomAccordion = styled(Accordion)`
    width: 50rem;
    background: white;
    border: 2px solid var(--a-gray-200);
    border-radius: 8px;

    @media (min-width: 390px) {
        width: 100%;
        display: block;
    }

    @media (min-width: 850px) {
        width: 50rem;
    }
`
const CustomAccordionHeader = styled(Accordion.Header)`
    .resultpanel {
        margin-top: 0.1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
`
const DetailContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0.3rem 0 0.2rem;
    gap: 0.3rem;
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
const CustomBodyShort = styled(BodyShort)`
    margin-right: 1rem;
    margin-left: 0.3rem;
    color: var(--a-gray-800);
`
const DetailSwitch = styled(Switch)`
    display: flex;
    justify-content: right;
`

const CustomAccordionContent = styled(Accordion.Content)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .serviceName {
        margin-top: 0.5rem;
    }
`

export const getServerSideProps = async () => {
    const resUniversellUtforming = await fetch(backendPath + EndPathUU())
    const UUdata = await resUniversellUtforming.json()
    return {
        props: { UUdata },
    }
}

const UUDashboard = ({ UUdata }) => {
    const user = useContext(UserStateContext)

    const statusLabel = (result) => {
        switch (result) {
            case "Passed":
                return (
                    <Tag variant="success">
                        Passed <SuccessFilledCustomized />
                    </Tag>
                )
            case "Failed":
                return (
                    <Tag variant="error">
                        Failed <ErrorFilledCustomized />
                    </Tag>
                )
            case "Cannot tell":
                return (
                    <Tag variant="neutral">
                        Cannot tell <HelpTextCustomizedGray />
                    </Tag>
                )
            case "Not checked":
                return (
                    <Tag variant="neutral">
                        Not checked <HelpTextCustomizedGray />
                    </Tag>
                )
            case "Not present":
                return (
                    <Tag variant="neutral">
                        Not present <HelpTextCustomizedGray />
                    </Tag>
                )
            default:
                return <Tag variant="neutral">Ingen status</Tag>
        }
    }

    const uuServiceName = (name) => {
        let shortName = name.replace("WCAG21:", "")
        let formattedName = shortName.replaceAll("-", " ")
        let capitalizedName =
            formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
        return capitalizedName
    }

    const [showDetails, setShowDetails] = useState(false)

    const handleDetailSwitch = () => {
        setShowDetails(!showDetails)
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
                <DetailSwitch
                    position="right"
                    size="small"
                    onChange={() => handleDetailSwitch()}
                    checked={showDetails}
                >
                    Vis detaljert informasjon
                </DetailSwitch>

                <CustomAccordion>
                    {UUdata &&
                        UUdata.length > 0 &&
                        UUdata.map(({ serviceName, criterias }, index) => (
                            <Accordion.Item>
                                <CustomAccordionHeader>
                                    {serviceName}

                                    {showDetails ? (
                                        <DetailContainer>
                                            {UUStatusDetails(
                                                "Passed",
                                                countStatuses(
                                                    criterias,
                                                    "Passed"
                                                )
                                            )}
                                            {UUStatusDetails(
                                                "Failed",
                                                countStatuses(
                                                    criterias,
                                                    "Failed"
                                                )
                                            )}{" "}
                                            {UUStatusDetails(
                                                "Not checked",
                                                countStatuses(
                                                    criterias,
                                                    "Not checked"
                                                )
                                            )}
                                            {UUStatusDetails(
                                                "Not present",
                                                countStatuses(
                                                    criterias,
                                                    "Not present"
                                                )
                                            )}
                                            {UUStatusDetails(
                                                "Cannot tell",
                                                countStatuses(
                                                    criterias,
                                                    "Cannot tell"
                                                )
                                            )}
                                        </DetailContainer>
                                    ) : (
                                        <div className="resultpanel">
                                            <SuccessFilledCustomized />
                                            <CustomBodyShort>
                                                {countStatuses(
                                                    criterias,
                                                    "Passed"
                                                )}
                                            </CustomBodyShort>
                                            <ErrorFilledCustomized />
                                            <CustomBodyShort>
                                                {countStatuses(
                                                    criterias,
                                                    "Failed"
                                                )}
                                            </CustomBodyShort>
                                            <HelpTextCustomizedGray />
                                            <CustomBodyShort>
                                                {criterias.length -
                                                    (countStatuses(
                                                        criterias,
                                                        "Passed"
                                                    ) +
                                                        countStatuses(
                                                            criterias,
                                                            "Failed"
                                                        ))}
                                            </CustomBodyShort>
                                        </div>
                                    )}
                                </CustomAccordionHeader>
                                {criterias &&
                                    criterias.length > 0 &&
                                    criterias.map(({ id, result }) => (
                                        <CustomAccordionContent>
                                            <BodyShort className="serviceName">
                                                {uuServiceName(id)}
                                            </BodyShort>

                                            {statusLabel(result)}
                                        </CustomAccordionContent>
                                    ))}
                            </Accordion.Item>
                        ))}
                </CustomAccordion>
            </div>
        </Layout>
    )
}

export default UUDashboard
