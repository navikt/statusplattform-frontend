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
    status: StatusEnum
    state: string
}

export enum SeverityEnum {
    OK = "OK",
    ISSUE = "ISSUE",
    DOWN = "DOWN",
    NEUTRAL = "NEUTRAL",
}

export enum StatusEnum {
    EXAMINING = "EXAMINING",
    SOLVING = "SOLVING",
    SOLVED = "SOLVED",
}
