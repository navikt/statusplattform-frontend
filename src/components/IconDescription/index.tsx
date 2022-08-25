import styled from "styled-components"
import {
    ErrorFilledCustomized,
    SuccessFilledCustomized,
    WarningFilledCustomized,
} from "../TrafficLights"

const IconDescriptionContainer = styled.div`
    display: flex;
    flex-direction: row;

    span {
        padding: 1rem;
        display: flex;
        align-items: center;
    }
    svg {
        height: 1em;
    }
`

const IconDescription = () => {
    return (
        <IconDescriptionContainer>
            <span>
                <SuccessFilledCustomized /> - Tjeneste fungerer normalt
            </span>
            <span>
                <WarningFilledCustomized className="" /> - Redusert
                funksjonalitet
            </span>
            <span>
                <ErrorFilledCustomized /> - Tjeneste utilgjengelig
            </span>
        </IconDescriptionContainer>
    )
}

export default IconDescription
