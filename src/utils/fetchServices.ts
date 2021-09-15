import { Tile } from "types/navServices";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let endUrl = "/rest/Services";

export const fetchServices = async (): Promise<Tile[]> => {
    let response;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001" + endUrl);
    }
    else {
        response = await fetch("https://digitalstatus.ekstern.dev.nav.no" + endUrl);
    }
    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}