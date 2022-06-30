import { Service } from "./types"

export interface OpsMessageI {
    id?: string
    internalHeader: string
    internalMessage: string
    externalHeader: string
    externalMessage: string
    onlyShowForNavEmployees: boolean
    isActive: boolean
    affectedServices: Service[]
    startDate: Date
    endDate: Date
    startTime: Date
    endTime: Date
    severity?: string
    state: string
}