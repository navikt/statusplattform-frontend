import { Dashboard } from "../types/navServices";
import { EndPathDashboard, EndPathDashboards, EndPathSpecificDashboard, EndPathUpdateDashboard } from "./apiHelper";
import { createApiRequest } from "./createApiRequest";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}



export const fetchDashboard = async (dashboardId: string): Promise<Dashboard> => {
    let response;
    let endPath = EndPathSpecificDashboard(dashboardId)
    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
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




export const fetchDashboardsList = async (): Promise<Dashboard[]> => {
    let response;
    let endPath = EndPathDashboards()


    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}




