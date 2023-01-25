import { Edit, Back } from "@navikt/ds-icons"
import {
    BodyShort,
    Button,
    Checkbox,
    Heading,
    Select,
    Textarea,
    TextField,
    Tag,
} from "@navikt/ds-react"

import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { backendPath } from "../.."
import { BackButton } from "../../../components/BackButton"
import { UserStateContext } from "../../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"
import Layout from "../../../components/Layout"
import { Service } from "../../../types/types"
import { OpsMessageI, SeverityEnum } from "../../../types/opsMessage"
import { RouterError, RouterOpsMeldinger } from "../../../types/routes"
import { EndPathServices, EndPathSpecificOps } from "../../../utils/apiHelper"
import {
    fetchSpecificOpsMessage,
    updateSpecificOpsMessage,
} from "../../../utils/opsAPI"
import { OpsScheme, Spacer } from "../../../styles/styles"
import { CloseCustomized } from "../../Admin"
import PublicOpsContent from "../PublicOpsContent"
import DateSetterOps from "../../../components/DateSetterOps"

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

    const approvedUsers = process.env.NEXT_PUBLIC_OPS_ACCESS?.split(",")

    useEffect(() => {
        if (!navIdent) {
            router.push(RouterError.PATH)
        }
    }, [router])

    const { internalHeader, externalHeader, startTime, endTime } = opsMessage

    const convertedStartTime = new Date(startTime)
    const convertedEndTime = new Date(endTime)

    const datePrettifyer = (date: Date) => {
        return `${
            date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        }/${
            date.getMonth() + 1 < 10
                ? `0${date.getMonth() + 1}`
                : date.getMonth() + 1
        }/${date.getFullYear().toString().substr(-2)} kl ${
            date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        }:${
            date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        }`
    }

    const prettifiedStartTime = datePrettifyer(convertedStartTime)
    const prettifiedEndTime = datePrettifyer(convertedEndTime)

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
                <Spacer height="0.8rem" />
                <Heading size="large" level="1">
                    {approvedUsers.includes(navIdent)
                        ? internalHeader
                        : externalHeader}
                </Heading>
                <Spacer height="1.2rem" />
            </div>
            <DetailsOfOpsMessage
                opsMessage={opsMessage}
                navIdent={navIdent}
                convertedStartTime={convertedStartTime}
                convertedEndTime={convertedEndTime}
                prettifiedStartTime={prettifiedStartTime}
                prettifiedEndTime={prettifiedEndTime}
            />

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

interface DetailsOpsMsgI {
    opsMessage: OpsMessageI
    navIdent: string
    prettifiedStartTime: string
    prettifiedEndTime: string
    convertedStartTime: Date
    convertedEndTime: Date
}

const DetailsOfOpsMessage = (props: DetailsOpsMsgI) => {
    const {
        externalMessage,
        affectedServices,
        isActive,
        onlyShowForNavEmployees,
    } = props.opsMessage

    const {
        opsMessage,
        navIdent,
        prettifiedEndTime,
        prettifiedStartTime,
        convertedEndTime,
        convertedStartTime,
    } = props

    return (
        <OpsDetailsContainer>
            {navIdent ? (
                <div className="opsMessageContainer">
                    <BodyShort spacing>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: opsMessage.internalMessage,
                            }}
                        />
                    </BodyShort>
                </div>
            ) : (
                <div>{externalMessage}</div>
            )}

            {affectedServices.length > 0 && (
                <>
                    <Heading size="xsmall" level="2">
                        Tilknyttede tjenester:
                    </Heading>
                    <div className="labelContainer">
                        {affectedServices.map((service) => {
                            return (
                                <Tag variant="info" key={service.id}>
                                    {service.name}
                                </Tag>
                            )
                        })}
                    </div>
                </>
            )}

            <Spacer height="1rem" />

            <Heading size="xsmall" level="2">
                Detaljer:
            </Heading>

            {navIdent && (
                <>
                    <div className="labelContainer">
                        {onlyShowForNavEmployees ? (
                            <Tag variant="info">Intern</Tag>
                        ) : (
                            <Tag variant="info">Interne og eksterne</Tag>
                        )}
                        {isActive ? (
                            <Tag variant="success">Aktiv</Tag>
                        ) : (
                            <Tag variant="error">Inaktiv</Tag>
                        )}
                    </div>

                    {convertedStartTime && convertedEndTime && (
                        <BodyShort>
                            Aktiv fra {prettifiedStartTime} til{" "}
                            {prettifiedEndTime}
                        </BodyShort>
                    )}
                </>
            )}
        </OpsDetailsContainer>
    )
}

export default opsMessageDetails
