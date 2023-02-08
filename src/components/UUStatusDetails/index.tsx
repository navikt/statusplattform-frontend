import styled from "styled-components"
import { Tag } from "@navikt/ds-react"
import { countStatuses } from "../../components/UUStatus/utility"
import { StatusItem } from "../../types/types"

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
                    {number + " - Passed "}
                </Tag>
            )
        case "Failed":
            return (
                <Tag variant="error" size="xsmall">
                    {number + " - Failed "}
                </Tag>
            )
        case "Cannot tell":
            return (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Cannot tell "}
                </Tag>
            )
        case "Not checked":
            return (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Not checked "}
                </Tag>
            )
        case "Not present":
            return (
                <Tag variant="neutral" size="xsmall">
                    {number + " - Not Present "}
                </Tag>
            )
        default:
            return <Tag variant="neutral">Ingen data</Tag>
    }
}

export default UUStatusDetails
