import { Dashboard } from "types/navServices";
import { EndPathSpecificDashboard } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchDashboard = async (dashboardId: string): Promise<Dashboard> => {
    let response;
    let endPath = EndPathSpecificDashboard(dashboardId)

    response = await fetch(endPath);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}