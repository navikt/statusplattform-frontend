import { EndPathServiceStatus } from "./apiHelper";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let endUrl = EndPathServiceStatus();

export const fetchServiceStatuses = async (): Promise<string[]> => {
    let response;

    response = await fetch(endUrl);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}