import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import { Expand } from '@navikt/ds-icons'
import { BodyShort, Button, Heading, Panel } from '@navikt/ds-react'

import { Area, Dashboard } from '../../types/types'
import { FilterContext } from '../../components/ContextProviders/FilterContext'
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext'
import { UserData } from '../../types/userData'
import { TitleContext } from '../../components/ContextProviders/TitleContext'
import { fetchDashboard } from '../../utils/dashboardsAPI'
import { RouterAvvikshistorikk, RouterError } from '../../types/routes'
import { ErrorFilledCustomized, SuccessFilledCustomized, WarningFilledCustomized, WrenchFilledCustomized } from '../../components/TrafficLights'
import CustomNavSpinner from '../../components/CustomNavSpinner'
import StatusOverview from '../../components/StatusOverview'
import { PortalServiceTile } from '../../components/PortalServiceTile'

/* --------------------------------------- Styles start --------------------------------------- */


const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    .status-only-ok {
        display: flex;
        flex-direction: column;
        
        .status-wrapper {
            margin-bottom: 60px;
            max-width: max-content;
            align-self: center;
        }

        .button-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;

            button {
                width: max-content;
            }
        }
    }
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
    width: 100%;
    
    display: flex;
    flex-direction: column;

    & > * {
        flex-basis: 100%;
    }

    .expand-all-wrapper {
        display: flex;
        justify-content: flex-end;
    }

    a {
        padding: 0;
        margin: 0;
    }

    .centered-element {
        align-self: center;
        margin-bottom: 16px;
    }


    @media (min-width: 500px) {
        width: auto;
        max-width: ${(props) => props.maxWidth}px;
    }
    
    @media (min-width: 1359px) {
        max-width: ${(props) => props.maxWidth}px;
    }

`;


const PortalServiceTileRow = styled.div `
    margin-bottom: 24px;
    gap: 32px;
    width: 100%;

    display: flex;
    flex-flow: row nowrap;
`

const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`



/* --------------------------------------- Styles end --------------------------------------- */


interface DashboardProps {
    dashboard: Dashboard
    isFullScreen: boolean
}




const DashboardTemplate = ({ dashboard, isFullScreen }: DashboardProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [areasInDashboard, setAreasInDashboard] = useState<Area[]>()
    const [expandAll, changeExpand] = useState(false)
    const [expandedTiles, setExpandedTiles] = useState([]);
    const [width, setWidth] = useState(typeof window !== "undefined"? window.innerWidth:0)

    const {filters} = useContext(FilterContext)
    
    const { changeTitle } = useContext(TitleContext)

    
    const user = useContext<UserData>(UserStateContext)
    

    const router = useRouter()

    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth))
    }, [width]);    


    // initial state
    useEffect(() => {
        (async function () {
            setIsLoading(true)
            changeTitle("Status digitale tjenester")

            const retrievedAreasInDashboard: Dashboard = await fetchDashboard(dashboard.id)
            setAreasInDashboard(retrievedAreasInDashboard.areas)

            rerouteIfNoDashboard()
            setIsLoading(false)
        })()
    }, [])


    // Timer for refetch of dashboard states
    useEffect(() => {
        let currentTime = 0
        const interval = setInterval(async() => {
            currentTime += 1
            if(currentTime === 30) {
                currentTime = 0
                const retrievedAreasInDashboard: Dashboard = await fetchDashboard(dashboard.id)
                setAreasInDashboard(retrievedAreasInDashboard.areas)
          }
        }, 1000)
        return () => clearInterval(interval)
      }, [])
      


    const rerouteIfNoDashboard = () => {
        if (!dashboard) {
            router.push(RouterError.PATH)
        }
    }

    

    if (isLoading) {
        return (
            <CustomNavSpinner />
        ) 
    }

    if (!areasInDashboard) {
        return <ErrorParagraph>Kunne ikke hente de digitale tjenestene. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }


    // +32 because we have a 32*2px (right and left gaps. additional +20 because of content margin) flex-gap between tiles which we need to accomodate for
    let maxWidth = width > 
        1275+84 ? 1275+84 : (
            window.innerWidth > 
                1275+84 ? 1275+84 : (
                    window.innerWidth > 
                        850+52 ? 850+52 : 425
                    )
            );


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
        let widthOfTile = 425; 
        
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

    const isTileExpanded = (rowIndex : number, index : number, startingIndex: number): boolean => {
        return expandedTiles.includes(startingIndex + rowIndex*numberOfTilesPerRow + index );
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
    const toggleTile = (index: number) => {
        if(expandedTiles.includes(index)){
            setExpandedTiles(expandedTiles.filter(i => i != index))
        }
        else{
            setExpandedTiles(expandedTiles.concat([index]));
        }
    }




    if(areasInDashboard.length == 0) {
        changeTitle("Feil ved henting av dashbord")
        return (
            <NoAreasInDashboard />
        )
    }


    
    if(isFullScreen) {
        return (
            <FullScreen 
                expandAll={expandAll}
                isTileExpanded={isTileExpanded}
                toggleExpandAll={toggleExpandAll}
                toggleTile={toggleTile}
                numberOfTilesPerRow={numberOfTilesPerRow}
                rows={rows}
            />
        )
    }
    


    return (
        <DashboardContainer>

            <DigitalServicesContainer>
                <StatusOverview areas={areasInDashboard} />

                {areasInDashboard.length > 0 &&
                    <PortalServiceTileContainer maxWidth={maxWidth}>
                        <AllAreas 
                            expandAll={expandAll}
                            isTileExpanded={isTileExpanded}
                            toggleExpandAll={toggleExpandAll}
                            toggleTile={toggleTile}
                            maxWidth={maxWidth}
                            numberOfTilesPerRow={numberOfTilesPerRow}
                            rows={rows}
                        />
                    </PortalServiceTileContainer>
                }

            
            </DigitalServicesContainer>
            {/* <MaintenanceScheduling />
            <IconDescription /> */}
        </DashboardContainer>
    )
}





/* --------------------------------------- Helpers below --------------------------------------- */

interface AllAreasProps {
    maxWidth: number
    rows: Area[][]
    toggleTile: (index) => void
    numberOfTilesPerRow: number
    isTileExpanded: (rowIndex, index, startingIndex) => boolean
    toggleExpandAll: () => void
    expandAll: boolean
}


const AllAreas = ({maxWidth, rows, toggleTile, numberOfTilesPerRow, isTileExpanded, toggleExpandAll, expandAll}: AllAreasProps) => {
    const [rowHeightsAsString, setRowHeights] = useState<string[]>(Array.from(Array(rows.length).keys()).map(i => "0px"))

    useEffect(() => {
        const allElementsRetrievedFromDom: Element[] = Array.from(document.getElementsByClassName("ekspanderbartPanel"))
        const arrayFromDomElements = generateArrayFromTwoArrays(allElementsRetrievedFromDom)

        let newRowHeights: string[] = [...rowHeightsAsString]
        arrayFromDomElements.map((domElementRow, index) => {
            const heightForThisRow: number = findMinHeightForRow(domElementRow)
            newRowHeights[index] = `${heightForThisRow.toString()}px`
        })

        setRowHeights(newRowHeights)
        // Needs to check maxWidth property if we want to resize the dashboard
        /* In order for the resizing to work, we must check what the fit-content size is
        regardless of the previous width of the tile
        */ 
    }, [maxWidth])


    const generateArrayFromTwoArrays = (allElements: Element[]): any[] => {
        const matchingRowsInAllElementsBasedOnRowsProp: HTMLElement[][] = []
        
        rows.forEach((row: any[], index: number) => {
            const rowToAddToMatchingRowsList: HTMLElement[] = []

            row.forEach((rowElement: Area) => {
                allElements.forEach((element: HTMLElement)  => {
                    // element.style.minHeight = "400px"
                    if(rowElement.name == element.firstChild.textContent) {
                        rowToAddToMatchingRowsList.push(element)
                    }
                })
            })
            matchingRowsInAllElementsBasedOnRowsProp.push(rowToAddToMatchingRowsList)
        })

        return matchingRowsInAllElementsBasedOnRowsProp
    }

    const findMinHeightForRow = (row: HTMLElement[]) => {
        let maxMinHeight: number = 0
        row.forEach((rowElement: HTMLElement) => {
            if (maxMinHeight == 0) {
                maxMinHeight = rowElement.offsetHeight
            }
            if (rowElement.offsetHeight > maxMinHeight) {
                maxMinHeight = rowElement.offsetHeight
            }
        })
        return maxMinHeight
    }

    return (
        <PortalServiceTileContainer maxWidth={maxWidth}>
            <span className="expand-all-wrapper">
                <ExpandAllToggle toggleExpandAll={toggleExpandAll} expanded={expandAll}/>
            </span>
            {rows.map((row, rowIndex) => (
                <PortalServiceTileRow key={rowIndex}>
                    {row.map((area, index) => 
                        <PortalServiceTile key={index} toggleTile={toggleTile}
                            tileIndex={rowIndex*numberOfTilesPerRow + index}
                            area={area} expanded={isTileExpanded(rowIndex, index, 0)}
                            isAllExpanded={expandAll}
                            heightOfTileInRowBasedOfLargestTileInRow={rowHeightsAsString[rowIndex]}
                        />
                    )}
                </PortalServiceTileRow>
            ))}
        </PortalServiceTileContainer>
    )
}




// -------------




const FullScreenTileContainer = styled.div`
    background-color: var(--navds-semantic-color-canvas-background);
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    .content {
        margin-top: 25.5ch;
    }
`

const FullScreenTileRow = styled.div `
    margin-bottom: 24px;
    gap: 32px;

    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    
    > * {
        .ekspanderbartPanel__indikator {
            display: none !important;
        }
    }
`


interface FullScreenProps {
    rows: Area[][]
    toggleTile: (index) => void
    numberOfTilesPerRow: number
    isTileExpanded: (rowIndex, index, startingIndex) => boolean
    toggleExpandAll: () => void
    expandAll: boolean
}


const FullScreen = ({ rows, toggleTile, numberOfTilesPerRow, isTileExpanded, toggleExpandAll, expandAll}: FullScreenProps) => {

    useEffect(() => {
        toggleExpandAll()
    },[])

    return (
        <FullScreenTileContainer>
            <div className="content">
                {rows.map((row, rowIndex) => (
                    <FullScreenTileRow key={rowIndex}>
                        {row.map((area, index) => 
                            <PortalServiceTile key={index} toggleTile={toggleTile}
                                tileIndex={rowIndex*numberOfTilesPerRow + index}
                                area={area} expanded={isTileExpanded(rowIndex, index, 0)}
                                isAllExpanded={expandAll}
                            />
                        )}
                    </FullScreenTileRow>
                ))}
            </div>
        </FullScreenTileContainer>
    )
}










/* --------------------------------------- --------------------------------------- */





const ToggleExpandAllButton = styled(Button)`
    margin: 0 0 16px 0;

    :hover {
        color: inherit;
    }

    span {
        margin-right: 0;
        & > * {
            transition: ease 0.5s;
            transform: rotate(0deg);
            display: flex;
            flex-grow: 0;
            outline: none;
        }

        &.expanded {
            & > * {
                transition: ease 0.5s;
                transform: rotate(-180deg);
            }
        }
    }

`

const ExpandAllToggle: React.FC<{toggleExpandAll: () => void, expanded: boolean}> = ({toggleExpandAll, expanded}) => {
    return (
        <ToggleExpandAllButton variant="tertiary" size="small" aria-expanded={expanded} onClick={toggleExpandAll} >
            {!expanded
                ?
                    <BodyShort size="small">
                        Ekspander områder
                    </BodyShort>
                :
                    <BodyShort size="small">
                        Trekk sammen områder
                    </BodyShort>
            }
            <span className={expanded ? "expanded" : ""}>
                <Expand />
            </span>
        </ToggleExpandAllButton>
    )
}




/* --------------------------------------- --------------------------------------- */



const ErrorWrapper = styled.div`
    margin: 2rem 0;
    background-color: var(--navds-semantic-color-canvas-background-light);
    border-radius: .25rem;
    padding: 1.5rem;
    max-width: 50rem;

    display: flex;
    flex-flow: column wrap;
    
    h1 {
        margin-right: 1.5rem;
        padding-right: 1.5rem;
        vertical-align: top;
    }
`;

const ErrorHeader = styled.div`
    padding-bottom: 1rem;

    display: flex;
    flex-direction: row;
    align-items: center;
`


const NoAreasInDashboard = () => {

    return (
        <ErrorWrapper>
            <Head>
                <title>Feil ved henting av dashbord - status.nav.no</title>
            </Head>

            <ErrorHeader>
                <Heading size="large" level="2">Ingen områder i Dashbord</Heading>
            </ErrorHeader>
            
                <div>
                    <BodyShort spacing>
                        Det fins ingen områder i dashbordet enda. Hvis du mener dette er feil, rapporter det til administratorene av statusplattformen.
                    </BodyShort>
                    <Link href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                        Meld gjerne fra her
                    </Link>
                </div>
        </ErrorWrapper>
    )    
}








const MaintenanceContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        width: 100%;
    }

    /* Temporary width-adjustments */
    @media(min-width: 425px) {
        width: 425px;
    }
    @media(min-width: 902px) {
        width: 882px;
    }
    @media(min-width: 1359px) {
        width: 1339px;
    }
`

const MaintenancePanel = styled(Panel) `
    width: 100%;

    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;

    gap: 5ch;

    button {
        word-break: break-all;
    }

    & > * {
        flex-basis: 20% 70% 10%;
    }
    /* Temporary width-adjustments */
    @media(min-width: 425px) {
        flex-flow: row nowrap;
        width: 425px;
    }
    @media(min-width: 902px) {
        width: 882px;
    }
    @media(min-width: 1359px) {
        width: 1339px;
    }
`

const MaintenanceScheduling = () => {

    const handleRedirect = () => {
        toast.info("Ikke implementert enda")
    }

    return (
        <MaintenanceContainer>
            <Heading size="medium" level="2">Planlagt vedlikehold</Heading>
            <MaintenancePanel>

                <BodyShort>
                    Dato for vedlikehold
                </BodyShort>

                <BodyShort>
                    {/* Two viewes based on whether theres maintenance scheduled or not */}
                    Fins ingen støtte for vedlikehold helt enda
                </BodyShort>

                <Button variant="secondary" size="medium" onClick={handleRedirect}>Mer om vedlikehold</Button>

            </MaintenancePanel>
        </MaintenanceContainer>
    )
}




const IconDescriptionContainer = styled.div`
    padding-top: 1rem;

    ul {
        list-style: none;
        padding: 0;

        display: flex;
        justify-content: space-between;
        flex-direction: column;

        @media(min-width: 450px) {
            width: 425px;
            flex-flow: row wrap;
        }

        @media(min-width: 902px) {
            width: 882px;
            flex-direction: row;
        }

        @media(min-width: 1359px) {
            width: 1339px;
        }

        

        li {            
            display: inline-flex;
            flex-basis: 50%;
        }

        @media(min-width: 450px) and (max-width: 902px) {
            li:nth-child(2n) {
                justify-content: flex-end;
            }
        }

        @media(min-width: 902px) {
            li {
                flex-basis: auto;
            }
        }
    }
`

const IconDescription = () => {
    
    return (
        <IconDescriptionContainer>
            <ul>
                <li>
                    <SuccessFilledCustomized /> Status OK
                </li>
                <li>
                    <WarningFilledCustomized /> Feil oppdaget
                </li>
                <li>
                    <ErrorFilledCustomized /> Nede
                </li>
                <li>
                    <WrenchFilledCustomized /> Under vedlikehold
                </li>
            </ul>
        </IconDescriptionContainer>
    )
}


export default DashboardTemplate
