import { Dashboard } from "../types/types";
import { EndPathDashboard, EndPathDashboards, EndPathSpecificDashboard, EndPathUpdateDashboard } from "./apiHelper";
import { createApiRequest } from "./createApiRequest";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const fetchDashboardsList = async (): Promise<Dashboard[]> => {
    let response
    let endPath = EndPathDashboards()


    let request = createApiRequest(endPath, "GET")
    response = await fetch(request)

    if (response.ok) {
        let json = await response.json()
        return json
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const fetchDashboard = async (dashboardId: string): Promise<Dashboard> => {
    let response;
    let endPath = EndPathSpecificDashboard(dashboardId)
    let request = createApiRequest(endPath, "GET")
    response = await fetch(request)

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}



export const postDashboard = async (dashboard: Dashboard): Promise<Object[]> =>{
    let response
    let endPath = EndPathDashboard()


    let body = JSON.stringify({
        name: dashboard.name,
        areas: dashboard.areas
    })

    let request = createApiRequest(endPath,"POST", body)
    response = await fetch(request)



    if (response.ok) {
        return await response.json()

    }
    throw new ResponseError("Failed to POST to server", response)
}




export const deleteDashboard = async (dashboard: Dashboard): Promise<void> =>{
    let response
    let endPath = EndPathSpecificDashboard(dashboard.id)

    let request = createApiRequest(endPath,"DELETE")
    response = await fetch(request)



    if (response.ok) {
        return await response

    }
    throw new ResponseError("Failed to DELETE to server", response)
}



export const updateDashboard = async (dashboard: Dashboard): Promise<void> =>{
    let response
    let path = EndPathUpdateDashboard(dashboard.id)
    const listOfAreaIds: string[] = dashboard.areas.map(area => area.id)

    let body = JSON.stringify({
        name: dashboard.name,
        areas: listOfAreaIds
    })

    let request = createApiRequest(path, "PUT", body)
    response = await fetch(request)

    if (response.ok) {
        return await response

    }
    throw new ResponseError("Failed to PUT to server", response)
}
