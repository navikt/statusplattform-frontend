import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Knapp } from 'nav-frontend-knapper'

import CustomNavSpinner from 'components/CustomNavSpinner'
import { PortalServiceTile } from 'components/PortalServiceTile'
import StatusOverview from 'components/StatusOverview'
import { Area, Dashboard } from 'types/navServices'
import { fetchDashboard } from 'utils/fetchDashboard'
import Lenke from 'nav-frontend-lenker'
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi'
import Panel from 'nav-frontend-paneler'
import { toast } from 'react-toastify'
import { CheckboksPanelGruppe } from 'nav-frontend-skjema'

const DashboardContainer = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const DigitalServicesContainer = styled.div`
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const KnappWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    button:first-child {
        margin-bottom: 1rem;
    }
    button {
        max-width: fit-content;
    }
`

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
    const [showFilters, toggleFilters] = useState(false)
    const [filters, changeFilters] = useState<string[]>([])

    const router = useRouter()

    // if (!dashboard) {
    //     router.push("/Custom404")
    // }

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

    const changeCurrentFilters = (filterToAdd: string) => {
        if(!filters.includes(filterToAdd)) {
            const newFilters: string[] = [...filters, filterToAdd]
            changeFilters(newFilters)
            return
        }
        const newFilters: string[] = [...filters.filter(f => f != filterToAdd)]
        changeFilters(newFilters)
    }



    if(areasInDashboard.length == 0) {
        return (
            <NoAreasInDashboard />
        )
    }


    return (
        <DashboardContainer>
            <DigitalServicesContainer>
            <StatusOverview areas={areasInDashboard} />


                <KnappWrapper>
                    <Knapp mini onClick={() => toggleFilters(!showFilters)}>
                        {!showFilters ? "Vis filtre" : "Skjul filtre"}
                    </Knapp>
                    {showFilters &&
                        <FilterContainer filters={filters} changeCurrentFilters={changeCurrentFilters} />
                    }
                    <Knapp kompakt onClick={toggleExpandAll}>Ekspander/lukk feltene</Knapp>
                </KnappWrapper>


                {areasInDashboard.length > 0 &&
                    <PortalServiceTileContainer maxWidth={maxWidth}>
                        {rows.map((row, rowIndex) => (
                            <PortalServiceTileRow key={rowIndex}>
                                {row.map((area, index) => 
                                    <PortalServiceTile key={index} toggleTile={toggleTile}
                                        tileIndex={rowIndex*numberOfTilesPerRow + index}
                                        area={area} expanded={isTileExpanded(rowIndex, index)}
                                    />
                                )}
                            </PortalServiceTileRow>
                        ))}

                    </PortalServiceTileContainer>
                }

            
            </DigitalServicesContainer>
            <MaintenanceScheduling />
        </DashboardContainer>
    )
}





/* --------------------------------------- Helpers below --------------------------------------- */



const CheckboksPanelGruppeCustomized = styled(CheckboksPanelGruppe)`
    width: 100%;
    margin-bottom: 1rem;
    text-align: center;
    & > div{
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        gap: 3ch;
        & > * {
            height: 100%;
        }
    }
`

const FilterContainer: React.FC<{changeCurrentFilters: (filterToAdd) => void, filters: string[]}> = ({changeCurrentFilters, filters}) => {

    const handleFilter = (event) => {
        changeCurrentFilters(event.target.value)
    }

    return (
        <CheckboksPanelGruppeCustomized
            legend={"Filtrer på"}
            checkboxes={[
                { label: "OK", value: "ok", id: "okid" , checked: filters.includes("ok")},
                { label: "Redusert funksjonalitet", value: "redusert", id: "redusertid", checked: filters.includes("redusert")},
                { label: "Feil", value: "feil", id: "feilid", checked: filters.includes("feil")}
            ]}
            onChange={(event) => {handleFilter(event)}}
        />
    )
}










const ErrorWrapper = styled.div`
    margin: 2rem 0;
    background-color: var(--navBakgrunn);
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
    display: flex;
    flex-direction: row;
    align-items: center;
`


const NoAreasInDashboard = () => {

    return (
        <ErrorWrapper>
            <ErrorHeader>
                <Innholdstittel>Ingen områder i Dashbord</Innholdstittel>
            </ErrorHeader>
                <div className="error404__content">
                    <p>
                        Det fins ingen områder i dashbordet enda. Hvis du mener dette er feil, rapporter det til administratorene av statusplattformen.
                    </p>
                    <Lenke href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                        Meld gjerne fra her
                    </Lenke>
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
        max-width: 1080px;
    }
`

const MaintenancePanel = styled(Panel) `
    width: 100%;
    max-width: 1080px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5ch;
    & > * {
        flex-basis: 20% 70% 10%;
    }
    button {
        max-width: 100px;
        white-space: normal;
        word-wrap: break-word;
    }
`

const MaintenanceScheduling = () => {

    const handleRedirect = () => {
        toast.info("Ikke implementert enda")
    }

    return (
        <MaintenanceContainer>
            <Systemtittel>Planlagt vedlikehold</Systemtittel>
            <MaintenancePanel>
                <p>
                    Dato for vedlikehold
                </p>
                <p>
                    {/* Two viewes based on whether theres maintenance scheduled or not */}
                    Fins ingen støtte for vedlikehold helt enda
                </p>
                <Knapp mini onClick={handleRedirect}>Mer om vedlikehold</Knapp>
            </MaintenancePanel>
        </MaintenanceContainer>
    )
}


export default DashboardTemplate
