import { Tile, Dashboard } from "types/navServices";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchTiles = async (dashboard: Dashboard): Promise<Tile[]> => {
    let response;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001/rest/Tiles/" + dashboard.name);
    }
    else {
        response = await fetch("https://digitalstatus.ekstern.dev.nav.no/rest/Tiles/" + dashboard.name);
    }
    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}