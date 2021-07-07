export interface NavAreaServicesList {
    tiles: NavAreaTile[]
}
export interface NavAreaTile {
    services: NavService[]
    status: string
    area: NavArea
}

export interface NavService {
    name: string
    status: string
}

export interface NavArea {
    name: string
    id: string
    beskrivelse: string
    rangering: number
}