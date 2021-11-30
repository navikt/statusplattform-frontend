import { EndPathArea } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const deleteServiceFromArea = async (areaId, serviceId): Promise<void> =>{
    let response;
    let endPath = EndPathArea() + "/"+ areaId + "/" + serviceId

    response = await fetch(endPath,
    {
        method: "DELETE",
        body: JSON.stringify({
            areaId: areaId,
            serviceId: serviceId,
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