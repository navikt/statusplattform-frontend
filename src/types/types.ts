import { OpsMessageI } from "./opsMessage"

export interface Dashboard {
    areas: Area[]
    name: string
    id?: string
    opsMessages: OpsMessageI[]
}

export interface Tile {
    services: Service[]
    status: string
    area: Area
}

export interface OHdisplay {
    isOpen: boolean
    rule: string
    name: string
    openingHours: string
    displayText: string
}
export interface Service {
    id?: string
    name: string
    type: string
    team?: string
    teamId?: string
    serviceDependencies?: Service[]
    componentDependencies?: Component[]
    monitorlink?: string
    pollingOnPrem?: boolean
    pollingUrl?: string
    record?: Record
    areasContainingThisService: Area[]
    statusNotFromTeam: boolean
    ohDisplay?: OHdisplay
}

export interface Component {
    id?: string
    name: string
    type: string
    team?: string
    teamId?: string
    componentDependencies?: Component[]
    monitorlink?: string
    pollingUrl?: string
    status?: string
    servicesDependentOnThisComponent?: Service[]
    record?: Record
    pollingOnPrem?: boolean
}

export interface Area {
    id?: string
    name: string
    description: string
    icon?: string
    services: Service[]
    components: Component[]
    status?: string
    subAreas?: SubArea[]
    contains_components: boolean
}

export interface SubArea {
    id?: string
    status: string
    name: string
    services: Service[]
}

export interface HistoryOfSpecificService {
    history: HistoryOfSpecificServiceMonths[]
}

export interface HistoryOfSpecificServiceMonths {
    month: string
    entries: HistoryOfSpecificServiceDayEntry[]
}
export interface HistoryOfSpecificServiceDayEntry {
    serviceId: string
    date: string
    status: string
    information?: string
}

export interface MaintenanceObject {
    isPlanned: boolean
    message: string
}

export interface StatusItem {
    result: string
}

export interface Record {
    serviceId: string
    status?: string
    description: string
    logLink: string
    timestamp: string
}

export interface Team {
    id: string
    name: string
    members?: string[]
}

export interface NOMPersonPhone {
    /**
     * @minLength 0
     * @maxLength 7
     */
    navident: string
    /**
     * @minLength 0
     * @maxLength 20
     */
    phoneNumber: string
}
