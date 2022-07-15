import { BodyLong, Heading } from "@navikt/ds-react"
import styled from "styled-components"
import { OpsMessageI } from "../../../types/opsMessage"
import { Service } from "../../../types/types"



const PublicOpsContainer = styled.div`
    display: flex;

    
    max-width: 900px;

    @media (min-width: 902px) {
        flex-direction: row;
    }
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
            <PublicOpsDetails opsMessage={props.opsMessage} services={props.services} />
        </PublicOpsContainer>
    )
}


const PublicOpsDetailsContainer = styled.div`
    display: flex;
    flex-direction: column;

    gap: 16px;
`

const PublicOpsDetails = (props: PublicOpsContentI) => {
    return (
        <PublicOpsDetailsContainer>
            <Heading level="2" size="medium">{props.opsMessage.externalHeader}</Heading>
            <BodyLong>{props.opsMessage.externalMessage}</BodyLong>
        </PublicOpsDetailsContainer>
    )
}

export default PublicOpsContent