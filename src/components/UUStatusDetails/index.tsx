import styled from "styled-components"
import { Tag } from "@navikt/ds-react"
import { countStatuses } from "../../components/UUStatus/utility"
import { StatusItem } from "../../types/types"
import {
    ErrorFilledCustomized,
    HelpTextCustomizedGray,
    SuccessFilledCustomized,
} from "../TrafficLights"

const DetailContainer = styled.div`
    display: flex;
    flex-direction: row;

    gap: 0.3rem;
`

const UUStatusDetails = (result, number) => {
    switch (result) {
        case "Passed":
            return (
                <Tag variant="success" size="xsmall">
                    {number + " - Passed "} <SuccessFilledCustomized />
                </Tag>
            )
        case "Failed":
            return (
                <Tag variant="error" size="xsmall">
                    {number + " - Failed "} <ErrorFilledCustomized />
                </Tag>
            )
        case "Cannot tell":
            return (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Cannot tell "} <HelpTextCustomizedGray />
                </Tag>
            )
        case "Not checked":
            return (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Not checked "}
                    <HelpTextCustomizedGray />
                </Tag>
            )
        case "Not present":
            return (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Not present "}
                    <HelpTextCustomizedGray />
                </Tag>
            )
        default:
            return <Tag variant="neutral">Ingen data</Tag>
    }
}

export default UUStatusDetails
