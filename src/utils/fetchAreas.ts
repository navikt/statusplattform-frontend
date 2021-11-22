import { Area } from "types/navServices";
import { EndPathAreas } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchAreas = async (): Promise<Area[]> => {
    let response;
    let endPath = EndPathAreas()

    response = await fetch(endPath);


    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}