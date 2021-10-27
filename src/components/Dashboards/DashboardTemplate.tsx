import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Knapp } from 'nav-frontend-knapper'

import CustomNavSpinner from 'components/CustomNavSpinner'
import { PortalServiceTile } from 'components/PortalServiceTile'
import StatusOverview from 'components/StatusOverview'
import { Area, Dashboard } from 'types/navServices'
import { fetchDashboard } from 'utils/fetchDashboard'

const DashboardContainer = styled.div`
    display: flex;
`

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


interface DashboardProps {
    dashboard: Dashboard
}

const DashboardTemplate = ({ dashboard }: DashboardProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [areasInDashboard, setAreasInDashboard] = useState<Area[]>()
    const [expandAll, changeExpand] = useState(false)
    const [expandedTiles, setExpandedTiles] = useState([]);
    const [width, setWidth] = useState(typeof window !== "undefined"? window.innerWidth:0)

    const router = useRouter()

    if (!dashboard) {
        router.push("/Custom404")
    }

    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const retrievedAreasInDashboard: Dashboard = await fetchDashboard(dashboard.id)
            setAreasInDashboard(retrievedAreasInDashboard.areas)
            setIsLoading(false)
        })()
    }, [])

    

    if (isLoading) {
        return (
            <CustomNavSpinner />
        ) 
    }

    if (!areasInDashboard) {
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
        let numberOfTilesPerRow = biggestModulo(areasInDashboard.length, maxNumberOfTilesPerRow);
      

        return numberOfTilesPerRow;
    }
    let numberOfTilesPerRow = calculateNumberOfTilesPerRow();

    const generateRowsOfTiles = () => {
        //Endre denne oppførselen dersom det er ønskelig å bestemme antall per rad på brukersiden.
        
        let numberOfRows = Math.ceil( areasInDashboard.length/numberOfTilesPerRow );
        let rows: Area[][] = [];
    
        for(var i = 0; i < areasInDashboard.length; i = i + numberOfTilesPerRow){
            rows.push (areasInDashboard.slice(i,i+ numberOfTilesPerRow))

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
            setExpandedTiles(Array.from(Array(areasInDashboard.length).keys()))
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









    return (
        <DashboardContainer>
            <DigitalServicesContainer>
            <StatusOverview areas={areasInDashboard} />
                <Knapp kompakt onClick={toggleExpandAll}>Ekspander/lukk feltene</Knapp>


                    {areasInDashboard.length > 0 &&
                        <PortalServiceTileContainer maxWidth={maxWidth}>
                            {rows.map((row, rowIndex) => (
                                <PortalServiceTileRow key={rowIndex}>
                                    {row.map((area, index) => ( 
                                        <PortalServiceTile key={index} toggleTile={toggleTile}
                                            tileIndex={rowIndex*numberOfTilesPerRow + index}
                                            area={area} expanded={isTileExpanded(rowIndex, index)}
                                        />
                                    ))}
                                </PortalServiceTileRow>
                            ))}

                        </PortalServiceTileContainer>
                    }
    
            
        </DigitalServicesContainer>
        </DashboardContainer>
    )
}

export default DashboardTemplate