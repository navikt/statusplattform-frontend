import { UserData } from "types/userData";
import { EndPathGetLoginInfo, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const checkLoginInfoAndState = async (): Promise<UserData> => {
    let response;
    let endPath = EndPathGetLoginInfo();

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