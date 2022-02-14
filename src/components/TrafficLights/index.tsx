import styled from 'styled-components'

import { Wrench, Close, Success, Warning, Error, SuccessFilled, WarningFilled, ErrorFilled } from '@navikt/ds-icons'
import { SuccessStroke } from '@navikt/ds-icons'



const TrafficLightsContainer = styled.div`
    display: none;
    
    span {
        display: flex;

        p {
            margin: 0;
            margin-left: 5px;
        }
    }
    @media (min-width: 220px) {
        width: 200px;
        display: flex;
        flex-direction: column;
    }
    
    span {
        display: flex;
        align-items: center;
    }
    span div {
        border-right: 2px solid;
        border-left: 2px solid;
        padding: 2px 1px;
    }
    span:first-child div:first-child {
        border-top: 2px solid;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    span:last-child div:first-child {
        border-bottom: 2px solid;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .extra-info-wrapper {
        display: flex;
        flex-direction: column;
        div {
            display: flex;
            align-items: center;
        }
        span {
            margin: 0 8px 0 3px;
        }
    }
`


export const SuccessCustomized = styled(Success)`
    color: var(--navGronn) !important;
`

export const SuccessFilledCustomized = styled(SuccessFilled)`
    color: var(--navGronn) !important;
`




export const WarningCustomized = styled(Warning)`
    color: var(--navOransje) !important;
`;

export const WarningFilledCustomized = styled(WarningFilled)`
    color: var(--navOransje) !important;
`




export const ErrorCustomized = styled(Error)`
    color: var(--redError) !important;
`

export const ErrorFilledCustomized = styled(ErrorFilled)`
    color: var(--redError) !important;
`




export const NoStatusAvailableCircle = styled.span`
    height: 16px;
    width: 16px;
    /* background-color: var(--navGronn); */
    border: 4px solid var(--navGronn);
    border-radius: 50%;
    display: inline-block;
`;

const WrenchCustomized = styled(Wrench)`
    color: var(--navds-global-color-deepblue-400);

`



const Outine = styled.span`
    border-radius: 50%;
    border: 1px solid var(--navds-global-color-deepblue-400);

    width: 24px;
    height: 24px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    svg {
        width: 16px;
        height: 16px;
    }
`

const Fill = styled.span`
    border-radius: 50%;
    border: 1px solid var(--navds-global-color-deepblue-400);
    background-color: var(--navds-global-color-deepblue-400);

    width: 24px;
    height: 24px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    svg {
        width: 16px;
        height: 16px;
    }
`



export const OutlinedWrench = () => {
    return (
        <Outine>
            <WrenchCustomized />
        </Outine>
    )
}

export const FilledWrench = () => {
    return (
        <Fill>
            <WrenchCustomized />
        </Fill>
    )
}

interface Props {
    isInternal: boolean
}

const TrafficLights = ({isInternal}: Props) => {

    return (
        <div>
            Tegnforklaring:
            <TrafficLightsContainer>
                <div className="traffic-lights-wrapper">
                    <span><div><ErrorCustomized /></div><p> Feil på tjenesten</p></span>
                    <span><div><WarningCustomized /></div><p> Redusert funksjonalitet</p></span>
                    <span><div><SuccessCustomized /></div><p> Fungerer normalt</p></span>
                </div>
                <div className="extra-info-wrapper">
                    {isInternal && <div><NoStatusAvailableCircle /><p> Status ikke levert av team </p></div>}
                    <div><OutlinedWrench /><p> Planlagt vedlikehold</p></div>
                </div>
            </TrafficLightsContainer>
        </div>
    )
}

export default TrafficLights