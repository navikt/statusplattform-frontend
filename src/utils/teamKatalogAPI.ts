const apiPath = "/sp/api/teamkatalog";
import { Team } from "../types/types";



export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


// export
const createTeamRequest = (endpath: string, method: string, body? :string) =>{
//     let headers = new Headers()
//     headers.append("backendendpath",endpath)
//     headers.append("method", method)
//     body && headers.append("body", body)

    return new Request(apiPath, {
//         headers: new Headers(headers)
    })
}


export const fetchAllTeams = async (): Promise<Team[]> => {
    let response
    let endPath = "";


    let request = createTeamRequest(endPath, "GET")
    response = await fetch(request)

    if (response.ok) {
        let json = await response.json()
        return json
    }
    throw new ResponseError("Failed to fetch from server", response)
}