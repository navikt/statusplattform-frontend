import Head from "next/head"
import Link from "next/link"
import styled from "styled-components"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"

import { ExpandIcon } from "@navikt/aksel-icons"
import { BodyShort, Button, Heading } from "@navikt/ds-react"

import { Area, Dashboard } from "../../types/types"
import { TitleContext } from "../../components/ContextProviders/TitleContext"
import { fetchDashboard } from "../../utils/dashboardsAPI"
import { RouterError } from "../../types/routes"
import StatusOverview from "../../components/StatusOverview"
import { PortalServiceTile } from "../../components/PortalServiceTile"
import { UserData } from "../../types/userData"
import IconDescription from "../../components/IconDescription"
import StatusList from "./statusList"

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
`

const PortalServiceTileContainer = styled.div<{ maxWidth: number }>`
    flex: 1;
    padding: 1rem 0;
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
`

const PortalServiceTileRow = styled.div`
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
    dashboardProp: Dashboard
    isFullScreen: boolean
    initialDashboard: Dashboard
    user: UserData
}

const DashboardTemplate = ({
    dashboardProp,
    isFullScreen,
    initialDashboard,
    user,
}: DashboardProps) => {
    const [expandAll, changeExpand] = useState(false)
    const [expandedTiles, setExpandedTiles] = useState([])
    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 0
    )
    const [dashboard, setDashboard] = useState<Dashboard>(initialDashboard)

    const { changeTitle } = useContext(TitleContext)

    const router = useRouter()

    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth))
    }, [width])

    // Timer for refetch of dashboard states
    useEffect(() => {
        let currentTime = 0
        const interval = setInterval(async () => {
            currentTime += 1
            if (currentTime === 30) {
                currentTime = 0
                const retrievedDashboard: Dashboard = await fetchDashboard(
                    dashboardProp.id
                )
                setDashboard(retrievedDashboard)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!dashboardProp) {
            router.push(RouterError.PATH)
        }
    }, [dashboardProp])

    if (!dashboard.areas) {
        return (
            <ErrorParagraph>
                Kunne ikke hente de digitale tjenestene. Hvis problemet
                vedvarer, kontakt support.
            </ErrorParagraph>
        )
    }

    // +32 because we have a 32*2px (right and left gaps. additional +20 because of content margin) flex-gap between tiles which we need to accomodate for
    let maxWidth =
        width > 1275 + 84
            ? 1275 + 84
            : window.innerWidth > 1275 + 84
            ? 1275 + 84
            : window.innerWidth > 850 + 52
            ? 850 + 52
            : 425

    const biggestModulo = (
        totalNumberOfTiles: number,
        maxTilesPerRow: number
    ) => {
        let calculatedMaxTiles = maxTilesPerRow
        while (calculatedMaxTiles > 1) {
            if (totalNumberOfTiles % calculatedMaxTiles == 0) {
                return calculatedMaxTiles
            }
            calculatedMaxTiles--
        }
        //Dersom ikke y, og ingen tall mindre enn y, ikke går opp i x, returneres y;
        return maxTilesPerRow
    }

    const calculateNumberOfTilesPerRow = () => {
        if (width < 600) {
            return 1
        }
        let widthOfTile = 425

        let maxNumberOfTilesPerRow = Math.floor(maxWidth / widthOfTile)
        let numberOfTilesPerRow = biggestModulo(
            dashboard.areas.length,
            maxNumberOfTilesPerRow
        )

        return numberOfTilesPerRow
    }

    let numberOfTilesPerRow = calculateNumberOfTilesPerRow()

    const generateRowsOfTiles = () => {
        //Endre denne oppførselen dersom det er ønskelig å bestemme antall per rad på brukersiden.

        let rows: Area[][] = []

        for (
            var i = 0;
            i < dashboard.areas.length;
            i = i + numberOfTilesPerRow
        ) {
            rows.push(dashboard.areas.slice(i, i + numberOfTilesPerRow))
        }
        return rows
    }

    const isTileExpanded = (
        rowIndex: number,
        index: number,
        startingIndex: number
    ): boolean => {
        return expandedTiles.includes(
            startingIndex + rowIndex * numberOfTilesPerRow + index
        )
    }

    const toggleExpandAll = () => {
        if (expandAll) {
            changeExpand(false)
            setExpandedTiles([])
        } else {
            changeExpand(true)
            setExpandedTiles(Array.from(Array(dashboard.areas.length).keys()))
        }
    }

    let rows = generateRowsOfTiles()

    const toggleTile = (index: number) => {
        if (expandedTiles.includes(index)) {
            setExpandedTiles(expandedTiles.filter((i) => i != index))
        } else {
            setExpandedTiles(expandedTiles.concat([index]))
        }
    }

    const getAllServiceIds = (areas: Area[]): string[] => {
        let serviceIds: string[] = []
        areas.forEach((area) => {
            area.services.forEach((service) => {
                serviceIds.push(service.id)
            })
        })
        return serviceIds
    }

    if (dashboard.areas.length == 0) {
        changeTitle("Feil ved henting av dashbord")
        return <NoAreasInDashboard />
    }

    if (isFullScreen) {
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
                <PortalServiceTileContainer maxWidth={maxWidth}>
                    <div style={{ marginBottom: '3rem' }}>
                        <StatusOverview dashboard={dashboard} user={user} />
                    </div>
                    {dashboard.areas.length > 0 && (
                        <AllAreas
                            expandAll={expandAll}
                            isTileExpanded={isTileExpanded}
                            toggleExpandAll={toggleExpandAll}
                            toggleTile={toggleTile}
                            maxWidth={maxWidth}
                            numberOfTilesPerRow={numberOfTilesPerRow}
                            rows={rows}
                        />
                    )}
                    {/* <MaintenanceScheduling /> */}
                    <IconDescription />
                    <StatusList service_ids={getAllServiceIds(dashboard.areas)} user={user}/>
                </PortalServiceTileContainer>
            </DigitalServicesContainer>
        </DashboardContainer>
    )
}

/* --------------------------------------- Helpers below --------------------------------------- */

interface AllAreasProps {
    maxWidth: number
    rows: Area[][]
    toggleTile: (index: number) => void
    numberOfTilesPerRow: number
    isTileExpanded: (
        rowIndex: number,
        index: number,
        startingIndex: number
    ) => boolean
    toggleExpandAll: () => void
    expandAll: boolean
}

const AllAreas = ({
    maxWidth,
    rows,
    toggleTile,
    numberOfTilesPerRow,
    isTileExpanded,
    toggleExpandAll,
    expandAll,
}: AllAreasProps) => {
    const [rowHeightsAsString, setRowHeights] = useState<string[]>(
        Array.from(Array(rows.length).keys()).map(() => "0px")
    )

    useEffect(() => {
        const allElementsRetrievedFromDom: Element[] = Array.from(
            document.getElementsByClassName("accordion")
        )
        const arrayFromDomElements = generateArrayFromTwoArrays(
            allElementsRetrievedFromDom
        )

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

        rows.forEach((row: any[]) => {
            const rowToAddToMatchingRowsList: HTMLElement[] = []

            row.forEach((rowElement: Area) => {
                allElements.forEach((element: HTMLElement) => {
                    // element.style.minHeight = "400px"
                    if (rowElement.name == element.firstChild.textContent) {
                        rowToAddToMatchingRowsList.push(element)
                    }
                })
            })
            matchingRowsInAllElementsBasedOnRowsProp.push(
                rowToAddToMatchingRowsList
            )
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
        <>
            {/*  <span className="expand-all-wrapper">
                <ExpandAllToggle
                    toggleExpandAll={toggleExpandAll}
                    expanded={expandAll}
                />
            </span>*/}
            {rows.map((row, rowIndex) => (
                <PortalServiceTileRow key={rowIndex}>
                    {row.map((area, index) => (
                        <PortalServiceTile
                            key={index}
                            toggleTile={toggleTile}
                            tileIndex={rowIndex * numberOfTilesPerRow + index}
                            area={area}
                            expanded={isTileExpanded(rowIndex, index, 0)}
                            isAllExpanded={expandAll}
                            heightOfTileInRowBasedOfLargestTileInRow={
                                rowHeightsAsString[rowIndex]
                            }
                        />
                    ))}
                </PortalServiceTileRow>
            ))}
        </>
    )
}

// -------------

const FullScreenTileContainer = styled.div`
    background-color: var(--a-gray-100);
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    .content {
        margin-top: 25.5ch;
    }
`

const FullScreenTileRow = styled.div`
    margin-bottom: 24px;
    gap: 32px;

    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
`

interface FullScreenProps {
    rows: Area[][]
    toggleTile: (index: number) => void
    numberOfTilesPerRow: number
    isTileExpanded: (
        rowIndex: number,
        index: number,
        startingIndex: number
    ) => boolean
    toggleExpandAll: () => void
    expandAll: boolean
}

const FullScreen = ({
    rows,
    toggleTile,
    numberOfTilesPerRow,
    isTileExpanded,
    toggleExpandAll,
    expandAll,
}: FullScreenProps) => {
    useEffect(() => {
        toggleExpandAll()
    }, [])

    return (
        <FullScreenTileContainer>
            <div className="content">
                {rows.map((row, rowIndex) => (
                    <FullScreenTileRow key={rowIndex}>
                        {row.map((area, index) => (
                            <PortalServiceTile
                                key={index}
                                toggleTile={toggleTile}
                                tileIndex={
                                    rowIndex * numberOfTilesPerRow + index
                                }
                                area={area}
                                expanded={isTileExpanded(rowIndex, index, 0)}
                                isAllExpanded={expandAll}
                            />
                        ))}
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

const ExpandAllToggle: React.FC<{
    toggleExpandAll: () => void
    expanded: boolean
}> = ({ toggleExpandAll, expanded }) => {
    return (
        <ToggleExpandAllButton
            variant="tertiary"
            size="small"
            aria-expanded={expanded}
            onClick={toggleExpandAll}
        >
            {!expanded ? (
                <BodyShort size="small">Ekspander områder</BodyShort>
            ) : (
                <BodyShort size="small">Trekk sammen områder</BodyShort>
            )}
            <span className={expanded ? "expanded" : ""}>
                <ExpandIcon />
            </span>
        </ToggleExpandAllButton>
    )
}

/* --------------------------------------- --------------------------------------- */

const ErrorWrapper = styled.div`
    margin: 2rem 0;
    background-color: var(--a-gray-100-light);
    border-radius: 0.25rem;
    padding: 1.5rem;
    max-width: 50rem;

    display: flex;
    flex-flow: column wrap;

    h1 {
        margin-right: 1.5rem;
        padding-right: 1.5rem;
        vertical-align: top;
    }
`

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
                <Heading size="large" level="2">
                    Ingen områder i Dashbord
                </Heading>
            </ErrorHeader>

            <div>
                <BodyShort spacing>
                    Det fins ingen områder i dashbordet enda. Hvis du mener
                    dette er feil, rapporter det til administratorene av
                    statusplattformen.
                </BodyShort>
                <Link href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                    Meld gjerne fra her
                </Link>
            </div>
        </ErrorWrapper>
    )
}

export default DashboardTemplate
