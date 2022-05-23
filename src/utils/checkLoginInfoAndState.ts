import { UserData } from "../types/userData";
import { EndPathGetLoginInfo } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

const createRequest = (path, headers)  => new Request(path, {
    headers: new Headers(headers)
})

const fetcher = (url) => fetch(url).then((res) => res.json())


export const checkLoginInfoAndState = async (path: string, method: string): Promise<UserData | null> => {
    let headers = new Headers()

    headers.append("backendendpath", path)
    headers.append("method", method)

    let request = createRequest("/sp/api/requestGateway", headers)
    let response = await fetch(request)

    if(response.ok) {
        return response.json()
    }
    
    throw new ResponseError("Failed to fetch from server", response)
}
