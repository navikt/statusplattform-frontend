import { EndPathPutServiceDependency } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const putServiceDependency = async (serviceId, dependencyId): Promise<Object[]> =>{
    let response;
    let endPath = EndPathPutServiceDependency(serviceId, dependencyId)


    response = await fetch(endPath,
    {
        method: "PUT",
        body: JSON.stringify({
            serviceId: serviceId,
            dependencyId: dependencyId
        }),
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