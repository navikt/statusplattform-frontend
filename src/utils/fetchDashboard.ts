import { Area, Dashboard } from "types/navServices";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchDashboard = async (dashboardId: string): Promise<Dashboard> => {
    let response;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001/rest/Dashboard/" + dashboardId);
    }
    else {
        response = await fetch("https://digitalstatus.ekstern.dev.nav.no/rest/Dashboard/" + dashboardId);
    }
    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}