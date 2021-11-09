import { Service } from "types/navServices";
import { EndPathSpecificService, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const fetchServiceFromId = async (serviceId: string): Promise<Service> => {

    let endUrl = EndPathSpecificService(serviceId);
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