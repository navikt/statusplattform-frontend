import { UserData } from "../types/userData";
import { EndPathGetLoginInfo } from "./apiHelper";
import useSWR from 'swr';





export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}



const fetcher = (url) => fetch(url).then((res) => res.json())

export const testing = async (): Promise<UserData | null> => {


    fetch('/sp/api/testApi').then((result) => {
        console.log("heya")
    }).catch((result) => 
        console.log("oh no")
    )
    
    /*
  
    const { data, error } = useSWR('/api/testApi', fetcher)

    if (error) console.log("error")
    if (!data) console.log("no data")
    else{
        console.log(data);
    }
    */

    return

}

export const checkLoginInfoAndState = async (): Promise<UserData | null> => {
    return; }
    /*
    const { data, error } = useSWR('/api/testApi', fetcher)

    if (error) console.log("error")
    if (!data) console.log("no data")
    else{
        console.log(data);
    }
    return
/**
 * re
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
**/
