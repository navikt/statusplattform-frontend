import { Dashboard } from "../types/navServices";
import { EndPathDashboard } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postDashboard = async (dashboard: Dashboard): Promise<Object[]> =>{
    let response;
    let endPath = EndPathDashboard()

    response = await fetch(endPath,
    {
        method: "POST",
        body: JSON.stringify({
            name: dashboard.name,
            areas: dashboard.areas
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
    throw new ResponseError("Failed to post to server", response)
}