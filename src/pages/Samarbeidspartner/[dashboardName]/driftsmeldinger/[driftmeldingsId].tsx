import { Back } from "@navikt/ds-icons"
import { Button, Heading } from "@navikt/ds-react"

import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"

import Layout from "src/components/LayoutExternal"
import { UserStateContext } from "src/components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "src/components/CustomNavSpinner"
import OpsMessageDetails from "src/components/OpsMessageDetails"
import { backendPath } from "src/pages"
import PublicOpsContent from "src/pages/Driftsmeldinger/PublicOpsContent"
import { OpsScheme, Spacer } from "src/styles/styles"
import { OpsMessageI, SeverityEnum } from "src/types/opsMessage"
import { RouterOpsMeldinger } from "src/types/routes"
import { Service } from "src/types/types"
import { EndPathSpecificOps, EndPathServices } from "src/utils/apiHelper"

const OpsMessageContainer = styled.div`
    display: flex;
    width: 100%;
`
const SubHeader = styled(Heading)`
    color: var(--a-gray-600);
`

export const getServerSideProps = async (context) => {
    const { driftmeldingsId } = await context.query
    console.log("url: ", backendPath + EndPathSpecificOps(driftmeldingsId))
    const [resOpsMsg, resServices] = await Promise.all([
        fetch(backendPath + EndPathSpecificOps(driftmeldingsId)),
        fetch(backendPath + EndPathServices()),
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

const opsMessageDetails = ({ opsMessage, retrievedServices }) => {
    const [isLoading, setIsLoading] = useState(true)

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
                    <PublicOpsContent
                        opsMessage={opsMessage}
                        services={retrievedServices}
                    />
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
    const [opsMessage, changeOpsMessage] =
        useState<OpsMessageI>(serverSideOpsMessage)
    const [updatedSeverity, changeUpdatedSeverity] = useState<SeverityEnum>(
        serverSideOpsMessage.severity
    )

    const router = useRouter()

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
                    <Back />
                    Se alle driftsmeldinger
                </Button>
            </div>
            <div className="header-container">
                <SubHeader size="small" level="3">
                    Driftsmelding:{" "}
                </SubHeader>
                <Spacer height="0.3rem" />
            </div>
            <OpsMessageDetails opsMessage={opsMessage} navIdent={undefined} />

            <div className="button-container">
                <Button variant="secondary" onClick={() => router.back()}>
                    Avbryt
                </Button>
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
export default opsMessageDetails
