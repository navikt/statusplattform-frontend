import { ChevronLeftIcon } from "@navikt/aksel-icons"
import { Button, Heading } from "@navikt/ds-react"

import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { backendPath } from "@/pages/index"
import { UserStateContext } from "@/components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "@/components/CustomNavSpinner"
import Layout from "@/components/Layout"
import OpsMessageDetailsComponent from "@/components/OpsMessageDetails"
import { OpsScheme, Spacer } from "@/styles/styles"
import { OpsMessageI, SeverityEnum } from "@/types/opsMessage"
import { RouterError, RouterOpsMeldinger } from "@/types/routes"
import { Service } from "@/types/types"
import { EndPathServices, EndPathSpecificOps } from "@/utils/apiHelper"
import { fetchSpecificOpsMessage } from "@/utils/opsAPI"
import PublicOpsContent from "@/pages/driftsmeldinger/publicopscontent"

const OpsMessageContainer = styled.div`
    display: flex;
    width: 100%;
`
const SubHeader = styled(Heading)`
    color: var(--a-gray-600);
`

export const getServerSideProps = async (context) => {
    const { driftmeldingsId } = await context.query

    const [resOpsMsg, resServices] = await Promise.all([
        fetch(backendPath + EndPathSpecificOps(driftmeldingsId)),
        fetch(backendPath + EndPathServices() + "/Minimal"),
    ])

    const opsMessage: OpsMessageI = await resOpsMsg.json()
    const retrievedServices: Service[] = await resServices.json()

    return {
        props: {
            retrievedServices,
            opsMessage,
        },
    }
}

const OpsMessageDetails = ({ opsMessage, retrievedServices }) => {
    const [isLoading, setIsLoading] = useState(true)

    const user = useContext(UserStateContext)

    useEffect(() => {
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    return (
        <Layout>
            <OpsMessageContainer>
                <Head>
                    <title>
                        Driftsmelding - {opsMessage.internalHeader} -
                        status.nav.no
                    </title>
                </Head>
                {user.navIdent ? (
                    <OpsMessageComponent
                        opsMessage={opsMessage}
                        services={retrievedServices}
                    />
                ) : (
                    <PublicOpsContent
                        opsMessage={opsMessage}
                        services={retrievedServices}
                    />
                )}
            </OpsMessageContainer>
        </Layout>
    )
}

interface OpsMessageComponentI {
    opsMessage: OpsMessageI
    services: Service[]
}

const OpsMessageComponent = ({
    opsMessage: serverSideOpsMessage,
    services,
}: OpsMessageComponentI) => {
    const [isEditing, toggleisEditing] = useState(false)
    const [opsMessage, changeOpsMessage] =
        useState<OpsMessageI>(serverSideOpsMessage)
    const [updatedSeverity, changeUpdatedSeverity] = useState<SeverityEnum>(
        serverSideOpsMessage.severity
    )
    const [isLoading, setIsLoading] = useState(false)

    const { name, navIdent } = useContext(UserStateContext)

    const router = useRouter()

    useEffect(() => {
        let reFetching = true
        const reFetch = async () => {
            if (reFetching) {
                await fetchSpecificOpsMessage(opsMessage.id)
                    .then((response) => {
                        changeOpsMessage(response)
                    })
                    .catch(() => {
                        toast.error("Noe gikk galt")
                    })
            }
        }
        if (reFetching) {
            reFetch()
        }

        reFetching = false
    }, [isEditing])

    useEffect(() => {
        setIsLoading(true)
        setIsLoading(false)
    }, [updatedSeverity])

    const approvedUsers = [
        "J162994",
        "K132081",
        "H123099",
        "L110875",
        "K125327",
        "F110862",
        "A110886",
        "L120166",
        "M106261",
        "M137316",
        "G121973",
        "H166137",
    ]

    useEffect(() => {
        if (!navIdent) {
            router.push(RouterError.PATH)
        }
    }, [router])

    const { internalHeader, externalHeader, startTime, endTime } = opsMessage

    return (
        <OpsScheme
            className={updatedSeverity ? updatedSeverity.toLowerCase() : "none"}
        >
            <div className="returnBtn">
                <Button
                    variant="tertiary"
                    size="small"
                    onClick={() => router.push(RouterOpsMeldinger.PATH)}
                >
                    <ChevronLeftIcon />
                    Se alle driftsmeldinger
                </Button>
            </div>
            <div className="header-container">
                <SubHeader size="small" level="3">
                    Driftsmelding:{" "}
                </SubHeader>
                <Spacer height="0.3rem" />
            </div>
            <OpsMessageDetailsComponent opsMessage={opsMessage} navIdent={navIdent} />

            <div className="button-container">
                <Button variant="secondary" onClick={() => router.back()}>
                    Avbryt
                </Button>
                {approvedUsers.includes(navIdent) && (
                    <Button
                        variant="primary"
                        onClick={() =>
                            router.push(
                                `${RouterOpsMeldinger.PATH}/${opsMessage.id}/RedigerMelding`
                            )
                        }
                    >
                        Rediger
                    </Button>
                )}
            </div>
        </OpsScheme>
    )
}

const OpsDetailsContainer = styled.div`
    .opsMessageContainer {
        border: 1px solid;
        border-color: var(--a-gray-200);
        border-radius: 0.5rem;
        padding: 1rem;
        width: 36rem;
        margin-bottom: 1.5rem;
    }

    .labelContainer {
        display: flex;
        margin: 1rem 0 1rem;
        gap: 0.5rem;
    }
    &.neutral {
        border: 3px solid #ccc;
    }

    &.down {
        border: 3px solid var(--a-border-danger);
    }

    &.issue {
        border: 3px solid var(--a-border-warning);
    }
`
export default OpsMessageDetails
