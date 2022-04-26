export interface OpsMessageI {
    id?: string
    internalHeader: string
    internalMessage: string
    externalHeader: string
    externalMessage: string
    onlyShowForInternal: boolean
    isActive: boolean
    affectedServices: string[]
}