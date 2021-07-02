import { useEffect, useState } from "react";
import Link from "next/link";
import styled from 'styled-components'

import { PortalServiceTile } from 'components/PortalServiceTile'
import StatusOverview from 'components/StatusOverview'
import { fetchData } from 'utils/fetchServices'
import { SuccessCircleGreen, WarningCircleOrange, ErrorCircleRed } from 'styles/trafficLights'

import { LenkepanelBase } from "nav-frontend-lenkepanel";
import NavFrontendSpinner from "nav-frontend-spinner";


const DigitalServicesContainer = styled.div`
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media(min-width: 550px){
        padding: 2rem 3rem;
    }
`;
const PortalServiceTileContainer = styled.div`
    width: 100%;
    flex: 1;
    padding-top: 30px;
    display: flex;
    justify-content: center;
    align-items: space-between;
    flex-flow: row wrap;
    a {
        padding: 0;
        margin: 0;
    }

`;

const TilesDescriptionWrapper = styled.div`
    padding-top: 3rem;
    width: 100%;
    display: flex;
    justify-content: center;
    span {
        display: flex;
    }
`



const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;
const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
`


const Dashboard = () => {
    const [areas, setAreas] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            const newAreas = await fetchData()
            const parsedAreas = [...newAreas]
            setAreas(parsedAreas)
            setIsLoading(false)
        })()
    }, [])



    if (!areas) {
        return <ErrorParagraph>Kunne ikke hente de digitale tjenestene. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }

    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }

    if(!isLoading && areas){
        return (
            <DigitalServicesContainer>
                <StatusOverview areas={areas} />
                <PortalServiceTileContainer>
                    {areas.map(area => {
                        return (
                            <PortalServiceTile key={area.area.name} area={area} expanded={false}/>
                            
                        )
                    })}
                </PortalServiceTileContainer>
                <TilesDescriptionWrapper>
                    <div>
                        <span><ErrorCircleRed /> = Feil på tjenesten</span>
                        <span><WarningCircleOrange /> = Redusert funksjonalitet</span>
                        <span><SuccessCircleGreen /> = Fungerer normalt</span>
                    </div>
                </TilesDescriptionWrapper>
            </DigitalServicesContainer>
        )
    }

}

export default Dashboard