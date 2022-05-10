import { UserData } from "../types/userData";
import { EndPathGetLoginInfo } from "./apiHelper";
import Cookies from 'cookies';


export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const checkLoginInfoAndState = async (): Promise<UserData | null> => {
    let response;
    let endPath = EndPathGetLoginInfo();

    response = await fetch(endPath);

    const cookies = new Cookies(response, response)
    
    console.log(cookies)

    
    if (response.ok) {
        return response.json()
    }

    throw new ResponseError("Failed to fetch from server", response)
}