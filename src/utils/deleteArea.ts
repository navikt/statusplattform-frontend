import { Area } from "types/navServices";
import { EndPathArea } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const deleteArea = async (area: Area): Promise<void> =>{
    let response;
    let endPath = EndPathArea() + area.id

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001" + endPath,
        {
            method: "DELETE",
            body: JSON.stringify({
                id: area.id,
                name: area.name,
                description: area.description,
                icon: area.icon
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit

        });
    }
    else {
        response = await fetch("https://digitalstatus.ekstern.dev.nav.no" + endPath,
        {
            method: "DELETE",
            body: JSON.stringify({
                id: area.id,
                name: area.name,
                description: area.description,
                icon: area.icon
            }),
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