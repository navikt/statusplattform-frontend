import { EndPathArea, EndPathServiceToArea, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const putServiceToArea = async (areaId, serviceId): Promise<Object[]> =>{
    let response;
    let endPath = EndPathServiceToArea(areaId, serviceId)

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch(LocalhostEndpoint + endPath,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit

        });
    }
    else {
        response = await fetch(PortalDevEndpoint + endPath,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin
        });
    }
    
    if (response.ok) {
        return response
    }
    throw new ResponseError("Failed to post to server", response)
}