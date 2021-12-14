import { EndPathServiceTypes } from "./apiHelper";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let endPath: string = EndPathServiceTypes();

export const fetchTypes = async (): Promise<string[]> => {
    let response;

    response = await fetch(endPath)

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}