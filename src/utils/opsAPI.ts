import { OpsMessageI } from "../types/opsMessage";
import { EndPathOps } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postOpsMessage = async (opsMessage: OpsMessageI): Promise<Object> => {
    let endPath = EndPathOps();
    let response;

    response = await fetch(endPath,
        {
            method: "POST",
            body: JSON.stringify({
                internalHeader: opsMessage.internalHeader,
                internalMessage: opsMessage.internalMessage,
                externalHeader: opsMessage.externalHeader,
                externalMessage: opsMessage.externalMessage,
                onlyShowForInternal: opsMessage.onlyShowForInternal,
                isActive: opsMessage.isActive,
                createdAt: "",
                closeAt: "",
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