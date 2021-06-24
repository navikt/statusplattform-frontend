export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postAdminAreas = async (adminArea): Promise<string[]> =>{
    let response;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        response = await fetch("http://localhost:3001/rest/adminAreas",
        {
            method: "POST",
            body: JSON.stringify({
                Id: "2",
                name: "adminArea.name",
                beskrivelse: "adminArea.beskrivelse",
                rangering: 10
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            mode: 'cors', // no-cors, *cors, same-origin,
            credentials: 'same-origin', // include, *same-origin, omit

        });
    }
    else {
        response = await fetch("https://portalserver.labs.nais.io/rest/adminAreas",
        {
            method: "POST",
            body: JSON.stringify({
                id: "adminArea.id",
                name: "adminArea.name",
                beskrivelse: "adminArea.beskrivelse",
                rangering: 10
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