import { EndPathServiceTypes } from "./apiHelper";
import { createApiRequest } from "./createApiRequest";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let path: string = EndPathServiceTypes();

export const fetchTypes = async (): Promise<string[]> => {
    let response;

    let request = createApiRequest(path, "GET")
    response = await fetch(request)

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}