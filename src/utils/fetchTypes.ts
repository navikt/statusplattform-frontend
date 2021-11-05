import { EndPathServiceTypes, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let endUrl = EndPathServiceTypes;

export const fetchTypes = async (): Promise<string[]> => {
    let response;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch(LocalhostEndpoint + endUrl);
    }
    else {
        response = await fetch(PortalDevEndpoint + endUrl);
    }
    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}