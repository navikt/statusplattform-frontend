import { Dashboard } from "types/navServices";
import { EndPathDashboards } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchDashboardsList = async (): Promise<Dashboard[]> => {
    let response;
    let endPath = EndPathDashboards()

    response = await fetch(endPath);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}