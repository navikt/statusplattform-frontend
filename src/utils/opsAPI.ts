import { OpsMessageI } from "../types/opsMessage";
import { EndPathOps, EndPathSpecificOps } from "./apiHelper";
import { createApiRequest } from "./createApiRequest";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postOpsMessage = async (opsMessage: OpsMessageI): Promise<Object> => {
    let response;
    let endPath = EndPathOps();

    let body = JSON.stringify({
        internalHeader: opsMessage.internalHeader,
        internalMessage: opsMessage.internalMessage,
        externalHeader: opsMessage.externalHeader,
        externalMessage: opsMessage.externalMessage,
        onlyShowForNavEmployees: opsMessage.onlyShowForNavEmployees,
        isActive: opsMessage.isActive,
        affectedServices: opsMessage.affectedServices,
        startTime: opsMessage.startTime,
        endTime: opsMessage.endTime,
    })

    let request = createApiRequest(endPath, "POST", body)
    response = await fetch(request)

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const fetchOpsMessages = async (): Promise<OpsMessageI[]> => {
    let response;
    let endPath = EndPathOps()

    let request = createApiRequest(endPath, "GET")
    response = await fetch(request)


    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const fetchSpecificOpsMessage = async (id: string): Promise<OpsMessageI> => {
    let response;
    let endPath = EndPathSpecificOps(id);

    let request = createApiRequest(endPath, "GET")
    response = await fetch(request)


    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const deleteOpsMessage = async (id: string): Promise<OpsMessageI> => {
    let response;
    let endPath = EndPathSpecificOps(id);

    let request = createApiRequest(endPath, "DELETE")
    response = await fetch(request)


    if (response.ok) {
        return response
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const updateSpecificOpsMessage = async (opsMessage: OpsMessageI): Promise<OpsMessageI> => {
    let response;
    let endPath = EndPathOps();

    let body = JSON.stringify({
        id: opsMessage.id,
        internalHeader: opsMessage.internalHeader,
        internalMessage: opsMessage.internalMessage,
        externalHeader: opsMessage.externalHeader,
        externalMessage: opsMessage.externalMessage,
        onlyShowForNavEmployees: opsMessage.onlyShowForNavEmployees,
        isActive: opsMessage.isActive,
        affectedServices: opsMessage.affectedServices,
        startTime: opsMessage.startTime,
        endTime: opsMessage.endTime,
        severity: opsMessage.severity
    })

    let request = createApiRequest(endPath, "PUT", body)
    response = await fetch(request)
    
    
    if (response.ok) {
        return response
    }
    throw new ResponseError("Failed to fetch from server", response)
}