import { Dashboard } from "types/navServices";
import { EndPathDashboard, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postDashboard = async (dashboard: Dashboard): Promise<Object[]> =>{
    let response;
    let endPath = EndPathDashboard()

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch(LocalhostEndpoint + endPath,
        {
            method: "POST",
            body: JSON.stringify({
                name: dashboard.name
            }),
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
            method: "POST",
            body: JSON.stringify({
                name: dashboard.name
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
    throw new ResponseError("Failed to post to server", response)
}