export interface NavAreaServicesList {
    areas: NavAreaService[]
}
export interface NavAreaService {
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