import { UserData } from "../types/userData";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const checkLoginInfoAndState = async (): Promise<UserData | null> => {

    let request = new Request("/sp/api/userInfo")
    let response = await fetch(request)

    if(response.ok) {
        let data = response.json()
        console.log(data)
        return data
    }
    
    throw new ResponseError("Failed to fetch from server", response)
}
