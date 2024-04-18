import { UserData } from "../types/userData"

export class ResponseError extends Error {
    public constructor(message: string, public response: Response) {
        super(message)
    }
}

export const checkLoginInfoAndState = async (): Promise<UserData | null> => {
    let base_url = process.env.BASE_URL || ""
    let request = new Request(base_url + "/sp/api/userInfo")
    let response = await fetch(request)

    if (response.ok) {
        let data = response.json()
        return data
    }

    throw new ResponseError("Failed to fetch from server", response)
}
