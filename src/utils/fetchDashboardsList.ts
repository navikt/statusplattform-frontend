import { Dashboard } from "types/navServices";
import { EndPathDashboards, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchDashboardsList = async (): Promise<Dashboard[]> => {
    let response;
    let endPath = EndPathDashboards()

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