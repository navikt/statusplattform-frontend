export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const deleteServiceFromArea = async (areaId, serviceId): Promise<void> =>{
    let response;
    let endPath = "/rest/Area/" + areaId + "/" + serviceId

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001" + endPath,
        {
            method: "DELETE",
            body: JSON.stringify({
                areaId: areaId,
                serviceId: serviceId,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit

        });
    }
    else {
        response = await fetch("https://portalserver.labs.nais.io" + endPath,
        {
            method: "DELETE",
            body: JSON.stringify({
                areaId: areaId,
                serviceId: serviceId,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin
        });
    }

    if (response.ok) {
        return response
    }
    throw new ResponseError("Failed to post to server", response)
}