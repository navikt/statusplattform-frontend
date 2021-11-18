import { EndPathGetLoginInfo, LocalhostEndpoint, PortalDevEndpoint } from "./apiHelper";


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

let endUrl = EndPathGetLoginInfo();

export const checkLoginInfoAndState = async (): Promise<string[]> => {
    let response;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch(LocalhostEndpoint + endUrl,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                mode: 'cors', // no-cors, *cors, same-origin
        });
    }
    else {
        response = await fetch(PortalDevEndpoint + endUrl,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                mode: 'cors', // no-cors, *cors, same-origin
        });
    }
    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}