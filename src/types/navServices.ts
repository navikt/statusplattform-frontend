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
    id: string
    name: string
    type: string
    team?: string
    dependencies?: Service[]
    monitorlink?: string
    description?: string
    logglink?: string
    status?: string
}

export interface Area {
    id: string
    name: string
    description: string
    icon: string
    services: Service[]
    status?: string
}
