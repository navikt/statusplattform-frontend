import styled from "styled-components"
import {
    ErrorFilledCustomized,
    HelpTextCustomizedGray,
    SuccessFilledCustomized,
    WarningFilledCustomized,
} from "../TrafficLights"

const IconDescriptionContainer = styled.div`
    display: flex;
    flex-flow: row wrap;

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
            <span>
                <HelpTextCustomizedGray /> - Tjeneste mangler status
            </span>
        </IconDescriptionContainer>
    )
}

export default IconDescription
