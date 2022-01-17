import styled from 'styled-components'

import { Wrench, Close, Success, Warning, Error } from '@navikt/ds-icons'
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

// export const SuccessCircleGreen = styled.span`
//     height: 16px;
//     width: 16px;
//     background-color: var(--navGronn);
//     border-radius: 50%;
//     display: inline-block;
// `;

export const SuccessCustomized = styled(Success)`
    color: var(--navGronn) !important;
    stroke: var(--navds-semantic-color-feedback-success-icon) !important;
`

export const WarningCustomized = styled(Warning)`
    stroke: var(--navds-semantic-color-feedback-warning-icon) !important;
    color: var(--navOransje) !important;
`;

// export const ErrorCircleRed = styled.span`
//     height: 16px;
//     width: 16px;
//     background-color: var(--redError);
//     border-radius: 50%;
//     display: inline-block;
// `;

export const ErrorCloseCustomized = styled(Error)`
    height: 16px;
    width: 16px;
    /* transform: scale(1.2); */
    stroke: var(--navds-semantic-color-feedback-error-icon) !important;
    color: var(--redError) !important;
    /* background-color: var(--redError); */
`

export const NoStatusAvailableCircle = styled.span`
    height: 16px;
    width: 16px;
    /* background-color: var(--navGronn); */
    border: 4px solid var(--navGronn);
    border-radius: 50%;
    display: inline-block;
`;

export const PlannedMaintenanceCircle = styled.span`
    height: 16px;
    width: 16px;
    background-color: var(--navBlaLighten40);
    /* border: 4px solid var(--navGronn); */
    border-radius: 50%;
    display: inline-block;
`;

interface Props {
    isInternal: boolean
}

const TrafficLights = ({isInternal}: Props) => {

    return (
        <div>
            Tegnforklaring:
            <TrafficLightsContainer>
                <div className="traffic-lights-wrapper">
                    <span><div><ErrorCloseCustomized /></div><p> Feil på tjenesten</p></span>
                    <span><div><WarningCircleOrange /></div><p> Redusert funksjonalitet</p></span>
                    <span><div><SuccessStrokeCustomized /></div><p> Fungerer normalt</p></span>
                </div>
                <div className="extra-info-wrapper">
                    {isInternal && <div><NoStatusAvailableCircle /><p> Status ikke levert av team </p></div>}
                    <div><PlannedMaintenanceCircle><Wrench /></PlannedMaintenanceCircle><p> Planlagt vedlikehold</p></div>
                </div>
            </TrafficLightsContainer>
        </div>
    )
}

export default TrafficLights