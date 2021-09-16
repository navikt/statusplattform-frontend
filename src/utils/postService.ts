export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postService = async (service): Promise<Object[]> =>{
    let response;
    let endPath = "/rest/Service"

    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001" + endPath,
        {
            method: "POST",
            body: JSON.stringify({
                id: service.id,
                name: service.name,
                type: service.type,
                team: service.team,
                dependencies: [service.dependencies],
                monitorlink: service.monitorlink,
                description: service.description,
                logglink: service.logglink
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit

        });
    }
    else {
        response = await fetch("https://digitalstatus.ekstern.dev.nav.no" + endPath,
        {
            method: "POST",
            body: JSON.stringify({
                id: service.id,
                name: service.name,
                type: service.type,
                team: service.team,
                dependencies: [service.dependencies],
                monitorlink: service.monitorlink,
                description: service.description,
                logglink: service.logglink
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin
        });
    }

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to post to server", response)
}