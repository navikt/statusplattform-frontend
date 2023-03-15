import styled from "styled-components"
import { Tag } from "@navikt/ds-react"
import { countStatuses } from "../../components/UUStatus/utility"
import { StatusItem } from "../../types/types"
import {
    ErrorFilledCustomized,
    ErrorFilledGray,
    HelpTextCustomizedGray,
    SuccessFilledCustomized,
    SuccessFilledGray,
    WarningFilledCustomized,
    WarningFilledGray,
} from "../TrafficLights"

const DetailContainer = styled.div`
    display: flex;
    flex-direction: row;

    gap: 0.3rem;
`

const UUStatusDetails = (result, number) => {
    switch (result) {
        case "Passed":
            return number == 0 ? (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Passed "} <SuccessFilledGray />
                </Tag>
            ) : (
                <Tag variant="success" size="xsmall">
                    {number + " - Passed "} <SuccessFilledCustomized />
                </Tag>
            )
        case "Failed":
            return number == 0 ? (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Failed "} <ErrorFilledGray />
                </Tag>
            ) : (
                <Tag variant="error" size="xsmall">
                    {number + " - Failed "} <ErrorFilledCustomized />
                </Tag>
            )
        case "Cannot tell":
            return number == 0 ? (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Cannot tell "}{" "}
                    <WarningFilledGray className="" />
                </Tag>
            ) : (
                <Tag variant="warning" size="xsmall">
                    {number + " - Cannot tell "}{" "}
                    <WarningFilledCustomized className="" />
                </Tag>
            )
        case "Not checked":
            return number == 0 ? (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Not checked "}{" "}
                    <WarningFilledGray className="" />
                </Tag>
            ) : (
                <Tag variant="warning" size="xsmall">
                    {number + " - Not checked "}{" "}
                    <WarningFilledCustomized className="" />
                </Tag>
            )
        case "Not present":
            return number == 0 ? (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Not present "}{" "}
                    <WarningFilledGray className="" />
                </Tag>
            ) : (
                <Tag variant="warning" size="xsmall">
                    {number + " - Not present "}{" "}
                    <WarningFilledCustomized className="" />
                </Tag>
            )
        default:
            return <Tag variant="neutral">Ingen data</Tag>
    }
}

export default UUStatusDetails
