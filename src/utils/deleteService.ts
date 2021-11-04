import { EndPathSpecificService } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const deleteService = async (service): Promise<Object[]> =>{
    let response;
    let endPath = EndPathSpecificService(service.id)

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001" + endPath,
        {
            method: "DELETE",
            body: JSON.stringify({
                Service_id: service.id,
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
                Service_id: service.id,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin
        });
    }

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to send DELETE request to server", response)
}