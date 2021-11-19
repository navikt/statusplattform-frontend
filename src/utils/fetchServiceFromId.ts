import { Service } from "types/navServices";
import { EndPathSpecificService } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const fetchServiceFromId = async (serviceId: string): Promise<Service> => {

    let endUrl = EndPathSpecificService(serviceId);
    let response;

    response = await fetch(endUrl);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}