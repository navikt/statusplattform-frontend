import { useEffect, useState } from "react";
import styled from 'styled-components'

import { PortalServiceTile } from 'components/PortalServiceTile'
import StatusOverview from 'components/StatusOverview'
import { fetchData } from 'utils/fetchServices'

// import { LenkepanelBase } from "nav-frontend-lenkepanel";
import NavFrontendSpinner from "nav-frontend-spinner";
import { NavAreaService, NavService } from "types/navServices";


const DigitalServicesContainer = styled.div`
    width: 100%;
    padding: 0;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    const [areas, setAreas] = useState<NavAreaService[]>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            const newAreas: NavAreaService[] = await fetchData()
            setAreas(newAreas)
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
                
            </DigitalServicesContainer>
        )
    }

}

export default Dashboard