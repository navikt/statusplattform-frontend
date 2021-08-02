import { useEffect, useState } from "react";
import styled from 'styled-components'

import { PortalServiceTile } from 'components/PortalServiceTile'
import StatusOverview from 'components/StatusOverview'
import { fetchData } from 'utils/fetchServices'

// import { LenkepanelBase } from "nav-frontend-lenkepanel";
import NavFrontendSpinner from "nav-frontend-spinner";
import { Tile, Service } from "types/navServices";


const DigitalServicesContainer = styled.div`
    width: 100%;
    padding: 0;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const PortalServiceTileContainer = styled.div`
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
    @media (min-width: 500px) {
        max-width: 1000px;
        width: 100%;
    }

`;





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
    const [tiles, setAreas] = useState<Tile[]>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            const newAreas: Tile[] = await fetchData()
            setAreas(newAreas)
            setIsLoading(false)
        })()
    }, [])



    if (!tiles) {
        return <ErrorParagraph>Kunne ikke hente de digitale tjenestene. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }

    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }
    
    if(!isLoading && tiles.length > 0){
        return (
            <DigitalServicesContainer>
                <StatusOverview tiles={tiles} />
                <PortalServiceTileContainer>
                    {tiles.map(tile => {
                        return (
                            <PortalServiceTile key={tile.area.name} tile={tile} expanded={false}/>
                            
                        )
                    })}
                </PortalServiceTileContainer>
                
            </DigitalServicesContainer>
        )
    }

}

export default Dashboard