import { UserData } from "../types/userData"

export class ResponseError extends Error {
    public constructor(message: string, public response: Response) {
        super(message)
    }
}

export const checkLoginInfoAndState = async (
    authorization: string = ""
): Promise<UserData | null> => {
    let base_url = process.env.BASE_URL || ""
    let request = new Request(base_url + "/api/userInfo")
    let response: Response

    const fetchOptions = {
        headers: {
            Authorization: authorization,
        },
    }

    if (authorization === "") {
        response = await fetch(request)
    } else {
        response = await fetch(request, fetchOptions)
    }

    if (response.ok) {
        let data = response.json()
        return data
    }

    throw new ResponseError("Failed to fetch from server", response)
}
