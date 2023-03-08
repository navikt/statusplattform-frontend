import { Component } from "../types/types";
import { EndPathComponent, EndPathComponents, EndPathComponentStatus, EndPathPutComponentDependency, EndPathSpecificComponent, EndPathUpdateComponent } from "./apiHelper";
import { createApiRequest } from "./createApiRequest";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const fetchComponents = async (): Promise<Component[]> => {
    let path = EndPathComponents()
    let response

    let request = createApiRequest(path, "GET")
    response = await fetch(request)

    if (response.ok) {
        return response.json()
    }

    throw new ResponseError("Failed to fetch from server", response)
}


export const fetchComponentsMinimal = async (): Promise<Component[]> => {
    let path = EndPathComponents() + "/Minimal"
    let response

    let request = createApiRequest(path, "GET")
    response = await fetch(request)

    if (response.ok) {
        return response.json()
    }

    throw new ResponseError("Failed to fetch from server", response)
}




export const postComponent = async (component: Component): Promise<Component> =>{
    let path = EndPathComponent()
    let response

    let body = JSON.stringify({
        name: component.name,
        type: component.type,
        team: component.team,
        dependencies: component.componentDependencies,
        servicesDependentOnThisComponent: component.servicesDependentOnThisComponent,
        monitorlink: component.monitorlink,
        pollingUrl: component.pollingUrl
    })

    let request = createApiRequest(path, "POST", body)
    response = await fetch(request)

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to post to server", response)
}




export const deleteComponent = async (component): Promise<Object[]> =>{
    let path = EndPathSpecificComponent(component.id)
    let response


    let body = JSON.stringify({
        Component_id: component.id,
    })

    let request = createApiRequest(path, "DELETE", body)
    response = await fetch(request)
    
    if (response.ok) {
        return await response
    }

    throw new ResponseError("Failed to send DELETE request to server", response)
}



export const updateComponent = async (component: Component): Promise<void> =>{
    let response
    let path = EndPathUpdateComponent(component.id)

    let body = JSON.stringify({
        id: component.id,
        name: component.name,
        type: component.type,
        team: component.team,
        componentDependencies: component.componentDependencies,
        servicesDependentOnThisComponent: component.servicesDependentOnThisComponent,
        monitorlink: component.monitorlink,
        pollingUrl: component.pollingUrl
    })

    let request = createApiRequest(path, "PUT", body)
    response = await fetch(request)
    

    if (response.ok) {
        return response
    }
    
    throw new ResponseError("Failed to post to server", response)
}




export const fetchComponentFromId = async (componentId: string): Promise<Component> => {

    let path = EndPathSpecificComponent(componentId)
    let response

    response = await fetch(path)

    let request = createApiRequest(path, "GET")
    response = await fetch(request)



    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}





export const fetchComponentStatuses = async (): Promise<string[]> => {
    let path = EndPathComponentStatus()
    let response

    let request = createApiRequest(path, "GET")
    response = await fetch(request)

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const putComponentDependency = async (componentId, dependencyId): Promise<Object[]> =>{
    let response
    let path = EndPathPutComponentDependency(componentId, dependencyId)

    let body = JSON.stringify({
        componentId: componentId,
        dependencyId: dependencyId
    })

    let request = createApiRequest(path, "PUT", body)
    response = await fetch(request)
       
    if (response.ok) {
        return response
    }
    throw new ResponseError("Failed to post to server", response)
}