export interface Dashboard {
    areas: Area[]
    name: string
    id?: string
}

export interface AreaServicesList {
    areas: Area[]
}
export interface Tile {
    services: Service[]
    status: string
    area: Area
}

export interface Service {
    id?: string
    name: string
    type: string
    team?: string
    serviceDependencies?: Service[]
    componentDependencies?: Component[]
    monitorlink?: string
    pollingUrl?: string
    status?: string
    areasContainingThisService: Area[]
}

export interface ServiceHistory {
    serviceId: string
    date: Date
    status: string
}

export interface Component {
    id?: string
    name: string
    type: string
    team?: string
    componentDependencies?: Component[]
    monitorlink?: string
    pollingUrl?: string
    status?: string
    servicesDependentOnThisComponent?: Service[]
}

export interface Area {
    id?: string
    name: string
    description: string
    icon: string
    services: Service[]
    components: Component[]
    status?: string
    subAreas?: SubArea[]
}

export interface SubArea {
    id?: string
    status: string
    name: string
    services: Service[]
}


export interface MaintenanceObject {
    isPlanned: boolean,
    message: string
}