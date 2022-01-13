import { Service } from "../types/navServices";
import { EndPathUpdateService } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const updateService = async (service: Service): Promise<void> =>{
    let response;
    let endPath = EndPathUpdateService(service.id)


    response = await fetch(endPath, {
            method: "PUT",
            body: JSON.stringify({
                id: service.id,
                name: service.name,
                type: service.type,
                team: service.team,
                dependencies: service.dependencies,
                monitorlink: service.monitorlink,
                pollingUrl: service.pollingUrl
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit
        });
    

    if (response.ok) {
        return response
    }
    throw new ResponseError("Failed to post to server", response)
}