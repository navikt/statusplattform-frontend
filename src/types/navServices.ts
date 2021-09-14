export interface AreaServicesList {
    tiles: Tile[]
}
export interface Tile {
    services: Service[]
    status: string
    area: Area
}

export interface Service {
    id?: string
    name: string
    type?: string
    team?: string
    dependencies?: []
    monitorLink?: string
    description?: string
    loggLink?: string
    status?: string
}

export interface Area {
    name: string
    id: string
    beskrivelse: string
    rangering: number
    ikon: string
}