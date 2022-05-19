import { UserData } from "../types/userData";
import { EndPathGetLoginInfo } from "./apiHelper";
import useSWR from 'swr';





export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

const createRequest = (path,headers)  => new Request(path, {
    headers: new Headers(headers),
  });

const fetcher = (url) => fetch(url).then((res) => res.json())

export const testing = async (path:string, method: string): Promise<UserData | any> => {
    let headers = new Headers();
    headers.append("backendendpath",path);
    headers.append("method", method)
    let request = createRequest("/sp/api/testApi",headers)
    let response = await fetch(request)
    await response.json()
    .then((result) => {console.log(result)})
    .catch((e) => {
        console.log("oh no")
    }
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
