import { useEffect, useState } from "react";
import styled from 'styled-components'

import { PortalServiceTile } from 'components/PortalServiceTile'
import StatusOverview from 'components/StatusOverview'
import { fetchTiles } from 'utils/fetchTiles'

// import { LenkepanelBase } from "nav-frontend-lenkepanel";
import NavFrontendSpinner from "nav-frontend-spinner";
import { Tile, Service, Dashboard } from "types/navServices";
import { Knapp } from "nav-frontend-knapper";
import { fetchDashboards } from "utils/fetchDashboards";
import { Select } from "nav-frontend-skjema";


const DigitalServicesContainer = styled.div`
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PortalServiceTileContainer = styled.div<{maxWidth: number}>`
    flex: 1;
    padding: 50px 0;
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

const SelectWrapper = styled.div<{maxWidth: number}>`
    width: ${(props) => props.maxWidth}px;
    display: flex;
    select {
        min-width: 100px;
        max-width: 200px;
    }
`

const PortalServiceTileRow = styled.div `
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
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

const NavDashboard = () => {
    const [dashboards, setDashboards] = useState<Dashboard[]>()
    const [selectedDashboard, setSelectedDash] = useState()
    const [tiles, setAreas] = useState<Tile[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [expandAll, changeExpand] = useState(false)
    const [expandedTiles, setExpandedTiles] = useState([]);
    const [width, setWidth] = useState(typeof window !== "undefined"? window.innerWidth:0)


    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const dashboards: Dashboard[] = await fetchDashboards()
            setDashboards(dashboards)
            const tiles: Tile[] = await fetchTiles(dashboards[0])
            setAreas(tiles)
            setIsLoading(false)
        })()
    }, [])
    
    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth))
    }, []);

    
    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }
    
    if (!tiles) {
        return <ErrorParagraph>Kunne ikke hente de digitale tjenestene. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }

    let maxWidth = width > 
            1800 ? 1800 : (window.innerWidth > 
            1200 ? 1200 : (window.innerWidth > 
            1000 ? 1000 : 600));

    const biggestModulo = (totalNumberOfTiles: number,maxTilesPerRow: number) => {
        let calculatedMaxTiles = maxTilesPerRow; 
        while(calculatedMaxTiles > 1){
            if(totalNumberOfTiles % calculatedMaxTiles == 0){
                return calculatedMaxTiles; 
            }
            calculatedMaxTiles--;
        }
        //Dersom ikke y, og ingen tall mindre enn y, ikke går opp i x, returneres y; 
        return maxTilesPerRow; 

    }

    const calculateNumberOfTilesPerRow = (userRowSize ?: number) => {
        if(width < 600){
            return 1;
        }
        let widthOfTile = 300; 
        
        let maxNumberOfTilesPerRow = Math.floor(maxWidth/widthOfTile);
        let numberOfTilesPerRow = biggestModulo(tiles.length, maxNumberOfTilesPerRow);
      

        return numberOfTilesPerRow;
    }
    let numberOfTilesPerRow = calculateNumberOfTilesPerRow();

    const generateRowsOfTiles = () => {
        //Endre denne oppførselen dersom det er ønskelig å bestemme antall per rad på brukersiden.
        
        let numberOfRows = Math.ceil( tiles.length/numberOfTilesPerRow );
        let rows: Tile[][] = [];
    
        for(var i = 0; i < tiles.length; i = i + numberOfTilesPerRow){
            rows.push (tiles.slice(i,i+ numberOfTilesPerRow))

        }
        return rows
    }
    const isTileExpanded = (rowIndex : number, index : number): boolean => {
        return expandedTiles.includes(rowIndex*numberOfTilesPerRow + index );
    }

    const toggleExpandAll = () => {
        if(expandAll) {
            changeExpand(false)
            setExpandedTiles([])
        }else {
            changeExpand(true)
            setExpandedTiles(Array.from(Array(tiles.length).keys()))
        }
    }

    let rows = generateRowsOfTiles();
    const toggleTile = (index:number) => {
        if(expandedTiles.includes(index)){
            setExpandedTiles(expandedTiles.filter(i => i != index))
        }
        else{
            setExpandedTiles(expandedTiles.concat([index]));
        }
    }
    
    const changeSelectedDashboard = (event) => {
        const dashboardId: string = event.target.value
        console.log(dashboardId)
        // Kommentert ut det under. Skal her fetche nytt dashboard
        // useEffect(() => {
        //     (async function () {
        //         setIsLoading(true)
        //         const dashboard: any[] = await fetchDashboard(dashboardId)
        //         updateSelectedDashboard(dashboard)
        //         setIsLoading(false)
        //     })()
        // }, [])
    }

    if(!isLoading && tiles.length > 0){
        return (
            <DigitalServicesContainer>
                <StatusOverview tiles={tiles} />
                    <Knapp kompakt onClick={toggleExpandAll}>Ekspander/lukk feltene</Knapp>
                        <SelectWrapper maxWidth={maxWidth}>
                            <Select onChange={changeSelectedDashboard} label="Velg Dashbord">
                                {dashboards.map((dashboard, index) => (
                                    <option key={index} value={dashboard.name} label={dashboard.name}/>
                                ))}
                                {/* <option value="privatperson" label="privatperson" />
                                <option value="internt" label="nternt" />
                                <option value="Arbeidspartner" label="Arbeidspartner" /> */}
                            </Select>
                        </SelectWrapper>
                        <PortalServiceTileContainer maxWidth={maxWidth}>
                            {rows.map((row, rowIndex) => (
                                <PortalServiceTileRow key={rowIndex}>
                                    {row.map((tile,index) => ( 
                                        <PortalServiceTile key={index} toggleTile={toggleTile}
                                            tileIndex={rowIndex*numberOfTilesPerRow + index}
                                            tile={tile} expanded={isTileExpanded(rowIndex, index)}
                                        />
                                    ))}
                                </PortalServiceTileRow>
                            ))
                            }

                        </PortalServiceTileContainer>
      
                
            </DigitalServicesContainer>
        )
    }

}

export default NavDashboard