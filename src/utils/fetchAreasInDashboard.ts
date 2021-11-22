import { Area } from "types/navServices";
import { EndPathDashboardWithArea } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchAreasInDashboard = async (dashboardId: string): Promise<Area[]> => {
    let response;
    let endPath = EndPathDashboardWithArea(dashboardId)

    response = await fetch(endPath);
    
    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}