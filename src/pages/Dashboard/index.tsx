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
        /* width: 100%; */
    }
    @media (min-width: 1200px) {
        /* max-width: ${(props) => props.maxWidth}px; */
    }

`;

const PortalServiceTileRow = styled.div `
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
`

const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`

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

    let maxWidth = window.innerWidth > 
            1800 ? 1800 : (window.innerWidth > 
            1200 ? 1200 : (window.innerWidth > 
            1000 ? 1000 : 600));

            
            
            /*
            DENNE metoden skal finne ut hvor mange tiles det skal være per rad
            Det gjenstår å legge til rette for at det kan endres av brukeren.
            Gjenstår også å rekursivt decremente antall per rad dersom det ikke er mulig å få plass til det. Det var her krasjtilfellene startet.
            */
           
    const estimateNumberOfTilesPerRow = () => {
        let numberOfTiles: number = 3
        console.log(numberOfTiles)
        
        let possibleNumberOfTilesPerRow = tiles.length % 6 == 0? 6: (tiles.length % 5 == 0? 5: (tiles.length % 4 == 0? 4 : (tiles.length % 3 == 0? 3 :  (tiles.length % 2 == 0 ? 2: 1))));
        console.log("checking possible number of tiles")
        if (possibleNumberOfTilesPerRow === numberOfTiles || numberOfTiles < possibleNumberOfTilesPerRow) {
            return numberOfTiles
        }
        let validNumberOfTilesPerRow = false
        while (!validNumberOfTilesPerRow && possibleNumberOfTilesPerRow !< 0) {
            possibleNumberOfTilesPerRow--
            if(possibleNumberOfTilesPerRow*300 <= maxWidth) {
                validNumberOfTilesPerRow = true
                numberOfTiles = possibleNumberOfTilesPerRow
            }
        }
        console.log(numberOfTiles)
        return numberOfTiles
    }

    const generateRowsOfTiles = () => {
        //Endre denne oppførselen dersom det er ønskelig å bestemme antall per rad på brukersiden.
        const numberOfTilesPerRow = estimateNumberOfTilesPerRow()
        let numberOfRows = Math.ceil( tiles.length/numberOfTilesPerRow );
        let rows: Tile[][][] = [];
    
        for(var i = 0; i < tiles.length; i = i + numberOfTilesPerRow){
            let row: Tile[][]= []
            row.push (tiles.slice(i,i+ numberOfTilesPerRow))
            rows.push(row)
        }
        return rows
    }

    

    if(!isLoading && tiles.length > 0){
        return (
            <DigitalServicesContainer>
                <StatusOverview tiles={tiles} />
                    <Knapp kompakt onClick={toggleExpand}>Ekspander/lukk feltene</Knapp>
       
                        <PortalServiceTileContainer maxWidth={maxWidth}>
                            {generateRowsOfTiles().map(row => (
                                row.map((listOfTilesInRow, index) => (
                                    <PortalServiceTileRow key={index}>
                                        {listOfTilesInRow.map(tile => (
                                            <PortalServiceTile key={tile.area.name + expandAll} tile={tile} expanded={expandAll}/>
                                        ))}
                                    </PortalServiceTileRow>
                                ))
                            ))}
                            {/* {rows.map(row => {
                                row.map(tile => {

                                        return(
                                        <PortalServiceTile key={tile.area.name + expandAll} tile={tile} expanded={expandAll}/>
                                    )

                                })
                            })} */}
                        </PortalServiceTileContainer>
      
                
            </DigitalServicesContainer>
        )
    }

}

export default Dashboard