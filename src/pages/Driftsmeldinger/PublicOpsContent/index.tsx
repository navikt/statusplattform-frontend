import { BodyLong, Heading } from "@navikt/ds-react"
import styled from "styled-components"
import { OpsMessageI } from "../../../types/opsMessage"
import { Service } from "../../../types/types"

const PublicOpsContainer = styled.div`
    padding: 1rem 2rem;
    border-radius: 0.5rem;

    max-width: 900px;
    box-shadow: 0 0 10px rgb(0 0 0 / 20%);

    width: 60%;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 1359px) {
        width: 100%;
    }
`

interface PublicOpsContentI {
    opsMessage: OpsMessageI
    services: Service[]
}

const PublicOpsContent = (props: PublicOpsContentI) => {
    return (
        <PublicOpsContainer>
            <PublicOpsDetails
                opsMessage={props.opsMessage}
                services={props.services}
            />
        </PublicOpsContainer>
    )
}

const PublicOpsDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const PublicOpsDetails = (props: PublicOpsContentI) => {
    const {
        affectedServices,
        startTime,
        endTime,
        externalHeader,
        externalMessage,
    } = props.opsMessage

    const convertedStartTime = new Date(startTime)
    const convertedEndTime = new Date(endTime)

    const prettifiedStartTime = `${
        convertedStartTime.getDate() < 10
            ? `0${convertedStartTime.getDate()}`
            : convertedStartTime.getDate()
    }.${
        convertedStartTime.getMonth() + 1 < 10
            ? `0${convertedStartTime.getMonth() + 1}`
            : convertedStartTime.getMonth() + 1
    }.${convertedStartTime.getFullYear()}, ${
        convertedStartTime.getHours() < 10
            ? `0${convertedStartTime.getHours()}`
            : convertedStartTime.getHours()
    }:${
        convertedStartTime.getMinutes() < 10
            ? `0${convertedStartTime.getMinutes()}`
            : convertedStartTime.getMinutes()
    }`

    const prettifiedEndTime = `${
        convertedEndTime.getDate() < 10
            ? `0${convertedEndTime.getDate()}`
            : convertedEndTime.getDate()
    }.${
        convertedEndTime.getMonth() + 1 < 10
            ? `0${convertedEndTime.getMonth() + 1}`
            : convertedEndTime.getMonth() + 1
    }.${convertedEndTime.getFullYear()}, ${
        convertedEndTime.getHours() < 10
            ? `0${convertedEndTime.getHours()}`
            : convertedEndTime.getHours()
    }:${
        convertedEndTime.getMinutes() < 10
            ? `0${convertedEndTime.getMinutes()}`
            : convertedEndTime.getMinutes()
    }`

    return (
        <PublicOpsDetailsContainer>
            <Heading level="2" size="medium">
                {props.opsMessage.externalHeader}
            </Heading>

            <div>{externalMessage}</div>

            <Heading size="small" level="3">
                Ytterligere detaljer
            </Heading>
            {convertedStartTime && (
                <ul>
                    <li>Starttid: {prettifiedStartTime}</li>
                </ul>
            )}

            {convertedEndTime && (
                <ul>
                    <li>Sluttid: {prettifiedEndTime}</li>
                </ul>
            )}

            <b>Tilknyttede tjenester:</b>
            {affectedServices.length > 0 && (
                <ul>
                    {affectedServices.map((service) => {
                        return <li key={service.id}>{service.name}</li>
                    })}
                </ul>
            )}
        </PublicOpsDetailsContainer>
    )
}

export default PublicOpsContent
