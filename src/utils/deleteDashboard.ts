import { Dashboard } from "../types/navServices";
import { EndPathSpecificDashboard } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const deleteDashboard = async (dashboard: Dashboard): Promise<void> =>{
    let response;
    let endPath = EndPathSpecificDashboard(dashboard.id)

    response = await fetch(endPath,
    {
        method: "DELETE",
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