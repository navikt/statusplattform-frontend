
import { Area } from "../types/navServices";
import { EndPathSpecificArea } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const updateArea = async (area: Area): Promise<void> =>{
    let response;
    let endPath = EndPathSpecificArea(area.id)


    response = await fetch(endPath, {
            method: "PUT",
            body: JSON.stringify({
                id: area.id,
                name: area.name,
                description: area.description,
                icon: area.icon,
                services: area.services
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