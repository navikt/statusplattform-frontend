import { OpsMessageI } from "../types/opsMessage";
import { EndPathOps, EndPathSpecificOps } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postOpsMessage = async (opsMessage: OpsMessageI): Promise<Object> => {
    let response;
    let endPath = EndPathOps();

    response = await fetch(endPath,
        {
            method: "POST",
            body: JSON.stringify({
                internalHeader: opsMessage.internalHeader,
                internalMessage: opsMessage.internalMessage,
                externalHeader: opsMessage.externalHeader,
                externalMessage: opsMessage.externalMessage,
                onlyShowForNavEmployees: opsMessage.onlyShowForNavEmployees,
                isActive: opsMessage.isActive,
                affectedServices: opsMessage.affectedServices,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit
    
        });

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const fetchOpsMessages = async (): Promise<OpsMessageI[]> => {
    let response;
    let endPath = EndPathOps()

    response = await fetch(endPath);


    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const deleteOpsMessage = async (id: string): Promise<OpsMessageI> => {
    let response;
    let endPath = EndPathSpecificOps(id);

    response = await fetch(endPath,
        {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit
        });

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}