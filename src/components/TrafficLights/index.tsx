import styled from 'styled-components'


const TrafficLightsContainer = styled.div`
    display: none;
    padding: 1rem 0;
    span {
        display: flex;
    }
    span:nth-child(2) {
        width: 183px;
    }
    @media (min-width: 220px) {
        display: flex;
    }
    p {
        margin: 0;
        margin-left: 5px;
    }
    span {
        padding: 0;
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
`

export const SuccessCircleGreen = styled.span`
    /* margin-right: 10px; */
    height: 16px;
    width: 16px;
    background-color: var(--navGronn);
    border-radius: 50%;
    display: inline-block;
`;

export const WarningCircleOrange = styled.span`
    /* margin-right: 10px; */
    height: 16px;
    width: 16px;
    background-color: var(--navOransje);
    border-radius: 50%;
    display: inline-block;
`;

export const ErrorCircleRed = styled.span`
    /* margin-right: 10px; */
    height: 16px;
    width: 16px;
    background-color: var(--redError);
    border-radius: 50%;
    display: inline-block;
`;

const TrafficLights = () => {
    return (
        <TrafficLightsContainer>
            <div className="traffic-lights-wrapper">
                <span><div><ErrorCircleRed /></div><p> Feil på tjenesten</p></span>
                <span><div><WarningCircleOrange /></div><p> Redusert funksjonalitet</p></span>
                <span><div><SuccessCircleGreen /></div><p> Fungerer normalt</p></span>
            </div>
        </TrafficLightsContainer>
    )
}

export default TrafficLights