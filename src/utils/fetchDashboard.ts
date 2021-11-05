import { Dashboard } from "types/navServices";
import { EndPathSpecificDashboard, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchDashboard = async (dashboardId: string): Promise<Dashboard> => {
    let response;
    let endPath = EndPathSpecificDashboard(dashboardId)

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch(LocalhostEndpoint + endPath);
    }
    else {
        response = await fetch(PortalDevEndpoint + endPath);
    }
    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}