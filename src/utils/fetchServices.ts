import { Service } from "types/navServices";
import { EndPathServices } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let endPath = EndPathServices();

export const fetchServices = async (): Promise<Service[]> => {
    let response;

    response = await fetch(endPath);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}