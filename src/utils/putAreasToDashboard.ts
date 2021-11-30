import { EndPathPutAreasToDashboard} from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const putAreasToDashboard = async (dashboardId: string, areasToPut: string[]): Promise<Object[]> =>{
    let response;
    let endPath = EndPathPutAreasToDashboard(dashboardId)
    
    response = await fetch(endPath,
    {
        method: "PUT",
        body: JSON.stringify(
            areasToPut
        ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        mode: 'cors', // no-cors, *cors, same-origin,
        credentials: 'same-origin', // include, *same-origin, omit

    });
    
    if (response.ok) {
        return response
    }
    throw new ResponseError("Failed to post to server", response)
}