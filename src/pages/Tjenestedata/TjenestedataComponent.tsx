import Link from "next/link"
import styled from "styled-components"
import { SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"

import {
    BodyShort,
    Detail,
    Heading,
    Panel,
    Popover,
    Tabs,
} from "@navikt/ds-react"
import CustomNavSpinner from "../../components/CustomNavSpinner"

import {
    Area,
    Component,
    HistoryOfSpecificService,
    HistoryOfSpecificServiceDayEntry,
    HistoryOfSpecificServiceMonths,
    Record,
    Service,
} from "../../types/types"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import { RouterTjenestedata } from "../../types/routes"
import { useLoader } from "../../utils/useLoader"
import { fetchAreasContainingService } from "../../utils/areasAPI"
import { handleAndSetStatusIcon } from "../../components/PortalServiceTile"
import { fetchServiceHistory } from "../../utils/servicesAPI"

const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`

const CategoryContainer = styled.div`
    width: 100%;
    padding: 0;

    display: flex;
    flex-direction: column;

    .title-container {
        svg {
            margin-right: 0.6rem;
        }
        margin-bottom: 2rem;
    }

    .info-hover-text,
    .arrow {
        visibility: hidden;
    }

    .no-status-wrapper {
        :hover {
            .info-hover-text,
            .arrow {
                visibility: visible;
            }
        }
    }

    .no-status-wrapper {
        position: relative;
        display: inline-block;

        .info-hover-text {
            position: absolute;
            background: white;

            z-index: 100;
            border-radius: 4px;

            top: -0.7rem;
            padding: 0.7rem;

            width: 200px;
        }

        .arrow {
            position: absolute;
            top: 25%;
            right: 0;

            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-right: 10px solid white;
        }
    }

    button {
        margin: 32px 0 40px 0;
    }

    .top-row {
        margin-bottom: 3rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 50px;

        .navds-panel {
            width: 100%;
            padding: 2rem;
            border: none;
            background: none;

            -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        @media (min-width: 825px) {
            flex-direction: row;
        }
    }

    @media (min-width: 650px) {
        padding: 0rem 2rem;
    }
`

const ServiceContainer = styled.div`
    min-width: 100px;
    min-height: 75px;

    border-radius: 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;
`

const ServiceWrapper = styled.div`
    width: 100%;
`

interface TjenesteDataContentI {
    service?: Service
    component?: Component
    areasContainingThisService?: Area[]
}

const TjenestedataContent = ({
    service,
    component,
    areasContainingThisService,
}: TjenesteDataContentI) => {
    service.areasContainingThisService = areasContainingThisService

    const router = useRouter()

    if (!service && !component) {
        return (
            <ErrorParagraph>
                Kunne ikke hente tjenesten. Hvis problemet vedvarer, kontakt
                support.
            </ErrorParagraph>
        )
    }

    if (service && !component) {
        return (
            <ServiceData
                service={service}
                areasContainingThisService={areasContainingThisService}
            />
        )
    }

    return <ComponentData component={component} />
}

const ComponentData = ({ component }: TjenesteDataContentI) => {
    return (
        <CategoryContainer>
            <div className="title-container">
                <Heading level="1" size="large">
                    {handleAndSetStatusIcon(component.record.status, true)}
                    {component.name}
                </Heading>
            </div>

            {/* <div>
                <Button variant="secondary" onClick={() => router.push(RouterOpprettVarsling.PATH)}><Bell/> Bli varslet ved avvik</Button> 
            </div> */}

            <div className="top-row">
                <Panel>
                    <ServiceContainer>
                        <ServiceWrapper>
                            <TjenesteData component={component} />
                        </ServiceWrapper>
                    </ServiceContainer>
                </Panel>

                {component.record && <StatusRecord record={component.record} />}
            </div>
            {/* TODO: Denne må tilbake når det er klart! */}
            {/* <IncidentHistoryComponent component={component} /> */}
        </CategoryContainer>
    )
}

const ServiceData = ({
    service,
    areasContainingThisService,
}: TjenesteDataContentI) => {
    return (
        <CategoryContainer>
            <div className="title-container">
                <Heading level="1" size="large">
                    {handleAndSetStatusIcon(service.record.status, true)}
                    {service.name}
                </Heading>
            </div>

            {/* <div>
                <Button variant="secondary" onClick={() => router.push(RouterOpprettVarsling.PATH)}><Bell/> Bli varslet ved avvik</Button> 
            </div> */}

            <div className="top-row">
                <Panel>
                    <ServiceContainer>
                        <ServiceWrapper>
                            <TjenesteData service={service} />
                        </ServiceWrapper>
                    </ServiceContainer>
                </Panel>

                {service.record && <StatusRecord record={service.record} />}
            </div>
            {/* TODO: Denne må tilbake når det er klart! */}
            {/* <IncidentHistoryComponent service={service} /> */}
        </CategoryContainer>
    )
}

/*------------------------------------------ Helpers for Root: below ------------------------------------------*/

const TjenesteDataContainer = styled.div`
    &,
    .classified {
        display: flex;
        flex-direction: column;
    }

    .row {
        padding: 0.5rem 0;

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
    }

    a {
        color: black;
    }
`

interface TjenesteDataI {
    service?: Service
    component?: Component
}

const TjenesteData = ({ service, component }: TjenesteDataI) => {
    const { navIdent } = useContext(UserStateContext)

    const regex = new RegExp(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    )

    const {
        type,
        serviceDependencies,
        componentDependencies,
        id,
        monitorlink,
        team,
        areasContainingThisService,
    } = service

    return (
        <>
            {navIdent && (
                <TjenesteDataContainer>
                    <div className="row">
                        <BodyShort spacing>
                            <b>Team</b>
                        </BodyShort>
                        <BodyShort>{team}</BodyShort>
                    </div>

                    {serviceDependencies.length > 0 && (
                        <div className="row">
                            <BodyShort spacing>
                                <b>Avhengigheter til tjenester</b>
                            </BodyShort>
                            <ServicesAndComponentsList
                                serviceDependencies={serviceDependencies}
                            />
                        </div>
                    )}

                    {componentDependencies.length > 0 && (
                        <div className="row">
                            <BodyShort spacing>
                                <b>Avhengigheter til komponenter</b>
                            </BodyShort>
                            <ServicesAndComponentsList
                                componentDependencies={componentDependencies}
                            />
                        </div>
                    )}

                    {areasContainingThisService.length > 0 && (
                        <div className="row">
                            <BodyShort spacing>
                                <b>Områder som inneholder tjenesten</b>
                            </BodyShort>
                            <ul>
                                {areasContainingThisService.map(
                                    (area, index) => {
                                        return (
                                            <li key={area.id}>{area.name}</li>
                                        )
                                    }
                                )}
                            </ul>
                        </div>
                    )}

                    {monitorlink && (
                        <div className="row">
                            <BodyShort spacing>
                                <b>Monitorlenke</b>
                            </BodyShort>
                            <BodyShort>
                                {regex.test(monitorlink) ? (
                                    <a href={monitorlink}>{monitorlink}</a>
                                ) : (
                                    "Ikke definert"
                                )}
                            </BodyShort>
                        </div>
                    )}
                </TjenesteDataContainer>
            )}
        </>
    )
}

const RecordWrapper = styled(Panel)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

interface StatusRecordI {
    record: Record
}

const StatusRecord = ({ record }: StatusRecordI) => {
    const prettifyRecordTimestamp = (recordDate: string): string => {
        const date = new Date(recordDate)
        const dateFromRecord =
            (date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()) +
            "." +
            (date.getMonth() + 1 <= 9
                ? `0${date.getMonth() + 1}`
                : date.getMonth() + 1) +
            "." +
            date.getFullYear() +
            " " +
            (date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours()) +
            ":" +
            (date.getMinutes() <= 9
                ? `0${date.getMinutes()}`
                : date.getMinutes()) +
            ":" +
            (date.getSeconds() <= 9
                ? `0${date.getSeconds()}`
                : date.getSeconds())
        return dateFromRecord
    }

    const prettifiedTimestamp = prettifyRecordTimestamp(record.timestamp)

    if (!record) {
        return null
    }

    return (
        <RecordWrapper>
            <b>Statusinfo:</b>
            <div>Status: {record.status}</div>
            {record.timestamp && (
                <div>Sist oppdatert: {prettifiedTimestamp}</div>
            )}
            {record.description && <div>Beskrivelse: {record.description}</div>}
            {record.logLink && <div>Logglenke: {record.logLink}</div>}
        </RecordWrapper>
    )
}

/*------------------------------------------  ------------------------------------------*/

const PublicDataContainer = styled.div`
    display: flex;
    flex-flow: column;
    justify-content: center;
`

interface IncidentHistoryI {
    service?: Service
    component?: Component
}

const IncidentHistoryComponent = ({ service, component }: IncidentHistoryI) => {
    const [isLast90Days, setIsLast90Days] = useState<boolean>(true)
    // TODO: Henting av tjenestehistorikkdata som driftsmeldinger og diverse
    // const { data, isLoading, reload } = useLoader(() => fetchServiceHistory(service.id), [])
    const [history, setHistory] = useState<HistoryOfSpecificService>()
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        let fetching = true
        setIsLoading(true)

        const fetchHistory = async () => {
            try {
                let res
                if (service && !component) {
                    res = await fetchServiceHistory(service.id)
                } else {
                    res = await fetchServiceHistory(component.id)
                }
                if (fetching) {
                    setHistory(res)
                    setIsLoading(false)
                    fetching = false
                }
            } catch (error) {
                console.log(error)
            } finally {
                if (fetching) {
                    setIsLoading(false)
                }
            }
        }

        fetchHistory()

        return () => {
            fetching = false
        }
    }, [])

    useEffect(() => {
        router.query.history == ("90dager" || undefined)
            ? setIsLast90Days(true)
            : setIsLast90Days(false)
    }, [router])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    if (service && !component) {
        return (
            <PublicDataContainer>
                <span>
                    <Heading size="medium" level="2" spacing>
                        Historikk
                    </Heading>
                </span>

                <TabHistory
                    setIsLast90Days={setIsLast90Days}
                    isLast90Days={isLast90Days}
                />
                <HistoryOfServiceOrComponent
                    isLast90Days={isLast90Days}
                    history={history.history}
                />
            </PublicDataContainer>
        )
    }

    return (
        <PublicDataContainer>
            <span>
                <Heading size="medium" level="2" spacing>
                    Historikk
                </Heading>
            </span>

            <TabHistory
                setIsLast90Days={setIsLast90Days}
                isLast90Days={isLast90Days}
            />
            <HistoryOfServiceOrComponent
                isLast90Days={isLast90Days}
                history={history.history}
            />
        </PublicDataContainer>
    )
}

const TabMenu = styled.ul`
    list-style: none;
    padding: 0;
    width: 100%;

    span:first-child {
        padding: 1rem 1rem 1rem 0;
    }

    span:not(:first-child) {
        padding: 1rem;
    }

    li {
        display: inline-block;

        :hover {
            cursor: pointer;
        }

        &.inactive {
            border-bottom: transparent 3px solid;

            :hover {
                border-bottom: var(--a-blue-500) 3px solid;
            }
        }
        &.active {
            border-bottom: var(--a-border-focus) 3px solid;
        }

        :focus,
        :active {
            background-color: transparent;
            outline: var(--a-border-focus) 3px solid;
            box-shadow: 0 0 0 0;
            outline-offset: 3px;
        }

        a {
            text-decoration: none;
            color: black;
        }
    }
`

const TabsCustomized = styled(Tabs)`
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    display: flex;
    justify-content: center;
`

interface History {
    setIsLast90Days: React.Dispatch<SetStateAction<boolean>>
    isLast90Days: boolean
}

const TabHistory = ({ setIsLast90Days, isLast90Days }: History) => {
    const router = useRouter()

    const [selectedHistoryTab, changeSelectedHistoryTab] =
        useState<string>("månedlig")

    const historyMenu: string[] = ["90dager", "månedlig"]

    useEffect(() => {
        setIsLast90Days(selectedHistoryTab === "90dager")
    }, [selectedHistoryTab])

    const findSelectedHistoryTab = (historyMenu: string[]) => {
        const router = useRouter()
        // const tab = router.query.tab || ""
        const tab = selectedHistoryTab

        let selected = historyMenu.indexOf(Array.isArray(tab) ? tab[0] : tab)
        return selected >= 0 ? historyMenu[selected] : historyMenu[1]
    }

    const handleNewSelectedTab = (newTab: string) => {
        changeSelectedHistoryTab(newTab)
    }

    return (
        <TabMenu>
            <TabsCustomized
                value={selectedHistoryTab}
                defaultValue={"månedlig"}
                size="small"
            >
                <Tabs.List>
                    <Tabs.Tab
                        value={"90dager"}
                        label={"Siste 90 dager"}
                        onClick={() => handleNewSelectedTab("90dager")}
                    />
                    <Tabs.Tab
                        value={"månedlig"}
                        label={"Måned for måned"}
                        onClick={() => handleNewSelectedTab("månedlig")}
                    />
                </Tabs.List>
            </TabsCustomized>
        </TabMenu>
    )
}

const HistoryContainer = styled.div``

const DailyOverview = styled.div`
    height: 92px;
    background: white;
    padding: 20px;

    border-radius: 4px;

    width: min-content;

    display: flex;
    flex-direction: row;
    gap: 8px;

    .entry {
        display: block;
        position: relative;

        height: 100%;
        width: 8px;
        border-radius: 2px;

        &.ok {
            background: var(--a-green-500);
        }
        &.issue  {
            background: var(--a-orange-500);
        }
        &.down {
            background: var(--a-red-500);
        }
    }
`

const MonthlyOverview = styled.div`
    display: flex;
    gap: 16px;
`

interface HistoryOfServiceOrComponentI {
    isLast90Days: boolean
    history: HistoryOfSpecificServiceMonths[]
}

interface HistoryLast90Days {
    entries: HistoryOfSpecificServiceDayEntry[]
    month: string
}

const HistoryOfServiceOrComponent = ({
    isLast90Days,
    history,
}: HistoryOfServiceOrComponentI) => {
    let numberOfDaysInView = 0

    const [historyLast90Days, setHistoryLast90Days] =
        useState<HistoryLast90Days>({
            entries: [],
            month: "",
        })
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        setIsLoading(true)
        let reversedForLast90Days = historyLast90Days

        history.map((month) => {
            month.entries.reverse().map((day) => {
                reversedForLast90Days.entries.push(day)
            })
        })

        setHistoryLast90Days(reversedForLast90Days)
        setIsLoading(false)
    }, [])

    const prettifyMonth = (dateString: string): string => {
        const date = new Date(dateString)
        let month = date.toLocaleString("no-NO", { month: "long" })
        month = month.charAt(0).toUpperCase() + month.slice(1)
        const day = date.getDate()
        return day + ". " + month
    }

    if (isLoading) {
        return <CustomNavSpinner />
    }

    return (
        <HistoryContainer id="history">
            {isLast90Days ? (
                <DailyOverview>
                    {historyLast90Days.entries.map((dailyEntry, index) => {
                        const month = prettifyMonth(dailyEntry.date)
                        if (numberOfDaysInView < 90) {
                            numberOfDaysInView++

                            return (
                                <DailyEntryComponent
                                    key={index}
                                    dailyEntry={dailyEntry}
                                    currentMonth={month}
                                />
                            )
                        }

                        return null
                    })}
                </DailyOverview>
            ) : (
                <MonthlyOverview>
                    {history.map((currentMonth, index) => {
                        // MIDLERTIDIG for å stoppe loop til max tre måneder tilbake per page
                        if (index > 2) {
                            return null
                        }
                        return (
                            <MonthlyCalendarStatuses
                                key={index}
                                currentMonth={currentMonth}
                            />
                        )
                    })}
                </MonthlyOverview>
            )}
        </HistoryContainer>
    )
}

/* ------------------ HELPERS ------------------ */

const ServiceAndComponentDependencies = styled.ul`
    display: flex;
    flex-flow: row wrap;
    column-gap: 1.5rem;
    row-gap: 0.5rem;

    padding: 0;
    list-style: none;

    li {
        a {
            display: flex;
            align-items: center;

            svg {
                margin-right: 5px;
            }
        }
    }
`

const ServicesAndComponentsList: React.FC<{
    componentDependencies?: Component[]
    serviceDependencies?: Service[]
}> = ({ componentDependencies, serviceDependencies }) => {
    if (componentDependencies) {
        return (
            <ServiceAndComponentDependencies>
                {componentDependencies.map((component) => {
                    return (
                        <li key={component.id}>
                            <a
                                href={
                                    "/sp" +
                                    RouterTjenestedata.PATH +
                                    component.id
                                }
                            >
                                {handleAndSetStatusIcon(
                                    component.record.status
                                )}
                                {component.name}
                            </a>
                        </li>
                    )
                })}
            </ServiceAndComponentDependencies>
        )
    }

    return (
        <ServiceAndComponentDependencies>
            {serviceDependencies.map((service) => {
                return (
                    <li key={service.id}>
                        <a href={"/sp" + RouterTjenestedata.PATH + service.id}>
                            {handleAndSetStatusIcon(service.record.status)}{" "}
                            {service.name}
                        </a>
                    </li>
                )
            })}
        </ServiceAndComponentDependencies>
    )
}

/* STYLES FOR DAILY ENTRIES*/
const DailyEntry = styled.div`
    .navds-popover__content {
        svg {
            margin-right: 8px;
        }
    }
`

const DailyEntryComponent: React.FC<{
    dailyEntry: HistoryOfSpecificServiceDayEntry
    currentMonth: string
}> = ({ dailyEntry, currentMonth }) => {
    const popoverRef = useRef(null)
    const [infoEntryVisible, changeInfoEntryVisible] = useState(false)
    const [infoContent, changeInfoContent] = useState("")
    const [infoStatusIconOnHover, setInfoStatusIconOnHover] =
        useState<JSX.Element>()
    const [formattedDateString, setFormattedDateString] = useState("")

    useEffect(() => {
        const monthPrettified: string =
            currentMonth.charAt(0) + currentMonth.slice(1).toLowerCase()
        const dateNumber: string = dailyEntry.date.split("-")[2]
        setFormattedDateString(dateNumber + ". " + monthPrettified)
    }, [])

    const toggleEntryInfoOnHover = (status, information) => {
        if (information) {
            changeInfoContent(information)
        } else {
            changeInfoContent("Statusinformasjon eksisterer ikke")
        }
        setInfoStatusIconOnHover(handleAndSetStatusIcon(status))
        changeInfoEntryVisible(true)
    }

    const { serviceId, date, status, information } = dailyEntry

    let statusMessage: string = generateTitleOfDayStatusEntry(status)

    return (
        <DailyEntry>
            <Popover
                open={infoEntryVisible}
                onClose={() => changeInfoEntryVisible(false)}
                anchorEl={popoverRef.current}
                placement="top"
            >
                <Popover.Content>
                    <Heading spacing size="medium" level="2">
                        {infoStatusIconOnHover}
                        {statusMessage}
                    </Heading>
                    <Detail>{currentMonth}</Detail>
                    {infoContent}
                </Popover.Content>
            </Popover>
            <span
                className={`entry ${status.toLowerCase()}`}
                onMouseEnter={() => toggleEntryInfoOnHover(status, information)}
                onMouseLeave={() => changeInfoEntryVisible(false)}
                ref={popoverRef}
            />
        </DailyEntry>
    )
}

// ----------------------

/* Helpers for calendar and daily entries */
const generateTitleOfDayStatusEntry = (status: string) => {
    switch (status) {
        case "OK":
            return "Ingen nedetid"
        case "ISSUE":
            return "Avvik på tjeneste"
        case "DOWN":
            return "Tjeneste var nede"
        default:
            break
    }
}

const MonthlyStatusContainer = styled.div``

const DaysInMonth = styled.div`
    width: 311px;
    /* height: 224px; */

    padding: 20px;
    border-radius: 4px;
    background: white;

    display: grid;
    grid-template-columns: 32px 32px 32px 32px 32px 32px 32px;
    grid-gap: 8px;

    .empty-field {
        display: block;
        height: 32px;
    }
`

const Day = styled.div`
    border-radius: 4px;
    height: 32px;

    &.down {
        background: var(--a-red-500);
    }

    &.issue {
        background: var(--a-orange-500);
    }

    &.ok {
        background: var(--a-green-500);
    }

    .navds-popover__content {
        display: flex;
        flex-direction: column;

        svg {
            margin-right: 8px;
        }
    }
`

interface MonthlyProps {
    currentMonth: HistoryOfSpecificServiceMonths
}

const MonthlyCalendarStatuses = ({ currentMonth }: MonthlyProps) => {
    // const [isLoading, setIsLoading] = useState(true)

    // useEffect(() => {
    //     console.log(currentMonth)
    //     setIsLoading(false)
    // },[])

    const firstDay = new Date(currentMonth.entries[0].date)
    const firstDayOfMonth = firstDay.getDay() - 1

    // if(isLoading) {
    //     return <CustomNavSpinner />
    // }

    return (
        <MonthlyStatusContainer>
            <div className="calendar-header">
                {`${
                    currentMonth.month
                } ${currentMonth.entries[0].date.substring(0, 4)}`}
            </div>

            <DaysInMonth>
                {firstDayOfMonth != 0 &&
                    [...Array(firstDayOfMonth)].map((e, i) => {
                        return <div key={i} className="empty-field" />
                    })}
                {currentMonth.entries.map((day, index) => {
                    if (index < 31) {
                        return (
                            <DayComponent
                                key={index}
                                day={day}
                                month={currentMonth.month}
                            />
                        )
                    }
                })}
            </DaysInMonth>
        </MonthlyStatusContainer>
    )
}

const DayComponent: React.FC<{
    day: HistoryOfSpecificServiceDayEntry
    month: string
}> = ({ day, month }) => {
    const popoverRef = useRef(null)

    const [infoEntryVisible, changeInfoEntryVisible] = useState(false)
    const [infoContent, changeInfoContent] = useState("")
    const [infoStatusIconOnHover, setInfoStatusIconOnHover] =
        useState<JSX.Element>()
    const [formattedDateString, setFormattedDateString] = useState("")

    useEffect(() => {
        const monthPrettified: string =
            month.charAt(0) + month.slice(1).toLowerCase()
        const dateNumber: string = day.date.split("-")[2]
        setFormattedDateString(dateNumber + ". " + monthPrettified)
    }, [])

    const toggleEntryInfoOnHover = (status, information) => {
        if (information) {
            changeInfoContent(information)
        } else {
            changeInfoContent("Statusinformasjon eksisterer ikke")
        }
        setInfoStatusIconOnHover(handleAndSetStatusIcon(status))
        changeInfoEntryVisible(true)
    }

    const { date, status, information } = day

    let statusMessage = generateTitleOfDayStatusEntry(status)

    return (
        <Day
            className={status.toLowerCase()}
            onMouseEnter={() => toggleEntryInfoOnHover(status, information)}
            onMouseLeave={() => changeInfoEntryVisible(false)}
            ref={popoverRef}
        >
            <Popover
                open={infoEntryVisible}
                onClose={() => changeInfoEntryVisible(false)}
                anchorEl={popoverRef.current}
                placement="top"
            >
                <Popover.Content>
                    <Heading spacing size="medium" level="2">
                        {infoStatusIconOnHover}
                        {statusMessage}
                    </Heading>
                    <Detail>{formattedDateString}</Detail>
                    {infoContent}
                </Popover.Content>
            </Popover>
        </Day>
    )
}

export default TjenestedataContent
