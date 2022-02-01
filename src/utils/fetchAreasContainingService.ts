import { Area } from "../types/navServices";
import { EndPathAreaContainingServices } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchAreasContainingService = async (serviceId: string): Promise<Area[]> => {
    let response;
    let endPath = EndPathAreaContainingServices(serviceId)


    response = await fetch(endPath);


    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}