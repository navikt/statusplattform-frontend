import { Service } from "types/navServices";
import { EndPathServices } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let endUrl = EndPathServices();

export const fetchServices = async (): Promise<Service[]> => {
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