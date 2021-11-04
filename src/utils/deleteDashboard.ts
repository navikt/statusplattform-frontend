import { Dashboard } from "types/navServices";
import { EndPathSpecificDashboard } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const deleteDashboard = async (dashboard: Dashboard): Promise<void> =>{
    let response;
    let endPath = EndPathSpecificDashboard(dashboard.id)

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001" + endPath,
        {
            method: "DELETE",
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