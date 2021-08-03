import { useEffect, useState } from "react";
import styled from 'styled-components'

import { PortalServiceTile } from 'components/PortalServiceTile'
import StatusOverview from 'components/StatusOverview'
import { fetchData } from 'utils/fetchServices'

// import { LenkepanelBase } from "nav-frontend-lenkepanel";
import NavFrontendSpinner from "nav-frontend-spinner";
import { Tile, Service } from "types/navServices";
import { Knapp } from "nav-frontend-knapper";


const DigitalServicesContainer = styled.div`
    width: 100%;
    padding: 0;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PortalServiceTileContainer = styled.div<{maxWidth: number}>`
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
        max-width: ${(props) => props.maxWidth}px;
        width: 100%;
    }
    @media (min-width: 1200px) {
        max-width: ${(props) => props.maxWidth}px;
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
    const [expandAll, changeExpand] = useState(false)

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

    const toggleExpand = () => {
        changeExpand(!expandAll)
    }


    let tileKey = "false"    
    if(expandAll == true) {
        tileKey = "true"
    }


    if(!isLoading && tiles.length > 0){
        return (
            <DigitalServicesContainer>
                <StatusOverview tiles={tiles} />
                    <Knapp kompakt onClick={toggleExpand}>Ekspander/lukk feltene</Knapp>
                {tiles.length % 2 === 0 ? //Hvis antallet tiles er et partall, legg to per rad.
                    (window.innerWidth > 1200 ? //Men dersom skjermen er bredere enn 1200px, legg 4 per
                        <PortalServiceTileContainer maxWidth={1200}>
                            {tiles.map(tile => {
                                return (
                                    <PortalServiceTile key={tile.area.name + expandAll} tile={tile} expanded={expandAll}/>
                                    
                                )
                            })}
                        </PortalServiceTileContainer>
                        :
                        <PortalServiceTileContainer maxWidth={600}>
                            {tiles.map(tile => {
                                return (
                                    <PortalServiceTile key={tile.area.name + expandAll} tile={tile} expanded={expandAll}/>
                                    
                                )
                            })}
                        </PortalServiceTileContainer>
                    )
                       
                    :   //ellers legg tre per rad
                    <PortalServiceTileContainer maxWidth={1000}>
                        {tiles.map(tile => {
                            return (
                                <PortalServiceTile key={tile.area.name + expandAll} tile={tile} expanded={expandAll}/>
                                
                            )
                        })}
                    </PortalServiceTileContainer>
                }
                
            </DigitalServicesContainer>
        )
    }

}

export default Dashboard