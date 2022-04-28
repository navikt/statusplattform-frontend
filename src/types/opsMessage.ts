export interface OpsMessageI {
    id?: string
    internalHeader: string
    internalMessage: string
    externalHeader: string
    externalMessage: string
    onlyShowForNavEmployees: boolean
    isActive: boolean
    affectedServices: string[]
}