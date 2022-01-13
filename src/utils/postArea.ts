import { EndPathAreas } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

export const postAdminArea = async (adminArea): Promise<Object[]> =>{
    let response;
    let endPath = EndPathAreas()

    response = await fetch(endPath,
    {
        method: "POST",
        body: JSON.stringify({
            name: adminArea.name,
            description: adminArea.description,
            icon: adminArea.icon,
            services: adminArea.services
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        mode: 'cors', // no-cors, *cors, same-origin,
        credentials: 'same-origin', // include, *same-origin, omit

    });

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to post to server", response)
}