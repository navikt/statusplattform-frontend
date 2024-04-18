import { requestBearerTokenForBackend } from "src/pages/api/utils/authHelper"
import { UserData } from "../types/userData"
import { NextApiRequest } from "next"

export class ResponseError extends Error {
    public constructor(message: string, public response: Response) {
        super(message)
    }
}

export const checkLoginInfoAndState = async (
    authorization: string
): Promise<UserData | null> => {
    let base_url = process.env.BASE_URL || ""
    let request = new Request(base_url + "/sp/api/userInfo")
    let response = await fetch(request, {
        headers: {
            Authorization: authorization,
        },
    })

    if (response.ok) {
        let data = response.json()
        return data
    }

    throw new ResponseError("Failed to fetch from server", response)
}
