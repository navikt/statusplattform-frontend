import styled from "styled-components"

import {
    WrenchIcon,
    CheckmarkCircleIcon,
    ExclamationmarkTriangleIcon,
    XMarkOctagonIcon,
    CheckmarkCircleFillIcon,
    ExclamationmarkTriangleFillIcon,
    XMarkOctagonFillIcon,
    QuestionmarkDiamondFillIcon,
} from "@navikt/aksel-icons"

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

export const SuccessCustomized = styled(CheckmarkCircleIcon)`
    color: var(--a-green-500) !important;
`

export const SuccessFilledCustomized = styled(CheckmarkCircleFillIcon)`
    color: var(--a-green-500) !important;

    &.service-closed {
      color: var(--a-gray-600) !important;
    }

    &.status-not-from-team {
        border: double;
        border-radius: 50%;
    }
`

export const SuccessFilledGray = styled(CheckmarkCircleFillIcon)`
    color: var(--a-gray-600) !important;
`

export const ErrorCustomized = styled(XMarkOctagonIcon)`
    color: var(--a-red-500) !important;
`

export const ErrorFilledCustomized = styled(XMarkOctagonFillIcon)`
    color: var(--a-red-500) !important;

    &.status-not-from-team {
        border: double;
        border-radius: 50%;
    }
`

export const ErrorFilledGray = styled(XMarkOctagonFillIcon)`
    color: var(--a-gray-600) !important;
`

export const NoStatusAvailableCircle = styled.span`
    height: 16px;
    width: 16px;
    /* background-color: var(--a-green-500); */
    border: 4px solid var(--a-green-500);
    border-radius: 50%;
    display: inline-block;
`

export const HelptextCustomizedBlue = styled(QuestionmarkDiamondFillIcon)`
    color: var(--a-deepblue-400) !important;
`

export const HelpTextCustomizedGray = styled(QuestionmarkDiamondFillIcon)`
    color: var(--a-gray-600) !important;
`

const WrenchCustomizedBlue = styled(WrenchIcon)`
    color: var(--a-deepblue-400) !important;
`
const WrenchCustomizedWhite = styled(WrenchIcon)`
    color: var(--a-gray-100) !important;
`

const Outine = styled.span`
    border-radius: 50%;
    border: 1px solid var(--a-deepblue-400);

    width: 18px;
    height: 18px;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    svg {
        display: inline-block;
        width: 12px;
        height: 12px;
    }
`

const Fill = styled.span`
    border-radius: 50%;
    border: 1px solid var(--a-deepblue-400);
    background-color: var(--a-deepblue-400);

    width: 18px;
    height: 18px;

    text-align: center;

    display: inline-flex;
    justify-content: center;
    align-items: center;

    svg {
        width: 12px;
        height: 12px;
    }
`

export const WrenchOutlinedCustomized = () => {
    return (
        <Outine>
            <WrenchCustomizedBlue />
        </Outine>
    )
}

export const WrenchFilledCustomized = () => {
    return (
        <Fill>
            <WrenchCustomizedWhite />
        </Fill>
    )
}

interface Props {
    isInternal: boolean
}

const TrafficLights = ({ isInternal }: Props) => {
    return (
        <div>
            Tegnforklaring:
            <TrafficLightsContainer>
                <div className="traffic-lights-wrapper">
                    <span>
                        <div>
                            <ErrorCustomized />
                        </div>
                        <p> Feil på tjenesten</p>
                    </span>
                    <span>
                        <div>
                            <WarningCustomized />
                        </div>
                        <p> Redusert funksjonalitet</p>
                    </span>
                    <span>
                        <div>
                            <SuccessCustomized />
                        </div>
                        <p> Fungerer normalt</p>
                    </span>
                </div>
                <div className="extra-info-wrapper">
                    {isInternal && (
                        <div>
                            <NoStatusAvailableCircle />
                            <p> Status ikke levert av team </p>
                        </div>
                    )}
                    <div>
                        <WrenchOutlinedCustomized />
                        <p> Planlagt vedlikehold</p>
                    </div>
                </div>
            </TrafficLightsContainer>
        </div>
    )
}

export const WarningDownloadedCustomized = styled.svg`
    color: var(--a-orange-500) !important;
`

export const WarningDownloadedFilledCustomized = styled.svg`
    color: var(--a-orange-500) !important;

    &.status-not-from-team {
        border: double;
        border-radius: 50%;
    }
`

// Everything revolving the Warning icon is due to be changed eventually, as this was the only way to ensure we could keep the Warning Icon they used in the old system.
// If anything needs to be changed, old icons can be found here: https://unpkg.com/browse/@navikt/aksel-icons@0.8.5/svg/
interface CustomSvgCompI {
    className: string
}

export const WarningFilledCustomized = ({ className }: CustomSvgCompI) => {
    return (
        <WarningDownloadedFilledCustomized
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12 16C12.8284 16 13.5 16.6716 13.5 17.5C13.5 18.3284 12.8284 19 12 19C11.1716 19 10.5 18.3284 10.5 17.5C10.5 16.6716 11.1716 16 12 16ZM13 5V14H11V5H13Z"
                fill="var(--a-orange-500)"
            />
        </WarningDownloadedFilledCustomized>
    )
}

export const WarningFilledGray = ({ className }: CustomSvgCompI) => {
    return (
        <WarningDownloadedFilledCustomized
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12 16C12.8284 16 13.5 16.6716 13.5 17.5C13.5 18.3284 12.8284 19 12 19C11.1716 19 10.5 18.3284 10.5 17.5C10.5 16.6716 11.1716 16 12 16ZM13 5V14H11V5H13Z"
                fill="var(--a-gray-600)"
            />
        </WarningDownloadedFilledCustomized>
    )
}

export const WarningCustomized = () => {
    return (
        <WarningDownloadedCustomized
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 16C12.8284 16 13.5 16.6716 13.5 17.5C13.5 18.3284 12.8284 19 12 19C11.1716 19 10.5 18.3284 10.5 17.5C10.5 16.6716 11.1716 16 12 16ZM13 5V14H11V5H13Z"
                fill="var(--a-orange-500)"
            />
        </WarningDownloadedCustomized>
    )
}

export default TrafficLights
