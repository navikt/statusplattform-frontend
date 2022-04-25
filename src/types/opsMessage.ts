export interface OpsMessageI {
    id?: string
    internalHeader: string
    internalMessage: string
    externalHeader: string
    externalMessage: string
    onlyShowForInternal: boolean
    isActive: boolean
    createdAt: string
    closedAt: string
    affectedServices: string[]
}