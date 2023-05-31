import { BodyShort, Heading, Tag } from "@navikt/ds-react"
import { datePrettifyer } from "../../utils/datePrettifyer"

import styled from "styled-components"
import { Spacer } from "../../styles/styles"
import { OpsMessageI } from "../../types/opsMessage"

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
        flex-direction: row;
        margin: 1rem 0 1rem;
        gap: 0.5rem;
        flex-wrap: wrap;
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

const TimeStamp = styled(BodyShort)`
    color: var(--a-gray-500);
    margin: 0.5rem 0 0.5rem 0;
`

interface DetailsOpsMsgI {
    opsMessage: OpsMessageI
    navIdent: string
}

const OpsMessageDetails = (props: DetailsOpsMsgI) => {
    const {
        internalHeader,
        internalMessage,
        externalHeader,
        externalMessage,
        affectedServices,
        isActive,
        status,
        onlyShowForNavEmployees,
    } = props.opsMessage

    const { opsMessage, navIdent } = props

    var servicesList = affectedServices.sort((a, b) =>
        a.name.toUpperCase() > b.name.toUpperCase()
            ? 1
            : b.name.toUpperCase() > a.name.toUpperCase()
            ? -1
            : 0
    )

    return (
        <OpsDetailsContainer>
            <Heading size="large" level="1">
                {navIdent ? internalHeader : externalHeader}
            </Heading>
            {opsMessage.startTime && opsMessage.endTime && (
                <TimeStamp>
                    {datePrettifyer(opsMessage.startTime) +
                        " - " +
                        datePrettifyer(opsMessage.endTime)}
                </TimeStamp>
            )}

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
                        {servicesList.map((service) => {
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
                        {affectedServices.length == 0 && (
                            <Tag variant="neutral">
                                Ingen tilknyttede tjenester
                            </Tag>
                        )}
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
                </>
            )}
        </OpsDetailsContainer>
    )
}

export default OpsMessageDetails
