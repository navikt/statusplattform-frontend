import { Component } from "../types/navServices";
import { EndPathComponent, EndPathComponents, EndPathComponentStatus, EndPathPutComponentDependency, EndPathSpecificComponent, EndPathUpdateComponent } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const fetchComponents = async (): Promise<Component[]> => {
    let endPath = EndPathComponents();
    let response;

    response = await fetch(endPath);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}




export const postComponent = async (component: Component): Promise<Object[]> =>{
    let response;
    let endPath = EndPathComponent()

    response = await fetch(endPath,
    {
        method: "POST",
        body: JSON.stringify({
            name: component.name,
            type: component.type,
            team: component.team,
            dependencies: component.componentDependencies,
            monitorlink: component.monitorlink,
            pollingUrl: component.pollingUrl
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




export const deleteComponent = async (component): Promise<Object[]> =>{
    let response;

    let endPath = EndPathSpecificComponent(component.id)

    response = await fetch(endPath,
    {
        method: "DELETE",
        body: JSON.stringify({
            Component_id: component.id,
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
    throw new ResponseError("Failed to send DELETE request to server", response)
}



export const updateComponent = async (component: Component): Promise<void> =>{
    let response;
    let endPath = EndPathUpdateComponent(component.id)


    response = await fetch(endPath, {
            method: "PUT",
            body: JSON.stringify({
                id: component.id,
                name: component.name,
                type: component.type,
                team: component.team,
                componentDependencies: component.componentDependencies,
                monitorlink: component.monitorlink,
                pollingUrl: component.pollingUrl
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




export const fetchComponentFromId = async (componentId: string): Promise<Component> => {

    let endUrl = EndPathSpecificComponent(componentId);
    let response;

    response = await fetch(endUrl);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}





export const fetchComponentStatuses = async (): Promise<string[]> => {
    let endUrl = EndPathComponentStatus();
    let response;

    response = await fetch(endUrl);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const putComponentDependency = async (componentId, dependencyId): Promise<Object[]> =>{
    let response;
    let endPath = EndPathPutComponentDependency(componentId, dependencyId)


    response = await fetch(endPath,
    {
        method: "PUT",
        body: JSON.stringify({
            componentId: componentId,
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