import { Dashboard } from "types/navServices";
import { EndPathUpdateDashboard } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const updateDashboard = async (dashboard: Dashboard, newName: String): Promise<void> =>{
    let response;
    let endPath = EndPathUpdateDashboard(dashboard.id)


    response = await fetch(endPath, {
            method: "PUT",
            body: JSON.stringify({
                name: newName
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