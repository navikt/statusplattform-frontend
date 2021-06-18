export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const fetchData = async (): Promise<string[]> => {

    let endPath = "/rest/rest/adminAreas"
    let response;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001"+endPath);
    }
    else {
        response = await fetch("https://portalserver.labs.nais.io"+ endPath);
    }

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}