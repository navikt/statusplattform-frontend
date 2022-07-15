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
    startTime: Date
    endTime: Date
    severity: SeverityEnum
    state: string
}

export enum SeverityEnum {
    OK = "OK",
    ISSUE = "ISSUE",
    DOWN = "DOWN",
    NEUTRAL = "NEUTRAL"
}