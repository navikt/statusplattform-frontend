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


export const checkLoginInfoAndState = async (): Promise<UserData | null> => {
    let headers = new Headers()

    headers.append("backendendpath", EndPathGetLoginInfo())
    headers.append("method", "GET")

    let request = createRequest("/sp/api/requestGateway", headers)
    let response = await fetch(request)

    if(response.ok) {
        return response.json()
    }
    
    throw new ResponseError("Failed to fetch from server", response)
}
