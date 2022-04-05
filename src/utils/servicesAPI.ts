import { Component, HistoryOfSpecificService, Service } from "../types/navServices";
import { EndPathPutServiceDependency, EndPathService, EndPathServiceHistory, EndPathServices, EndPathServiceStatus, EndPathSpecificService, EndPathUpdateService } from "./apiHelper";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}



export const fetchServices = async (): Promise<Service[]> => {
    let endPath = EndPathServices();
    let response;

    response = await fetch(endPath);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const fetchServiceHistory = async (serviceId: string): Promise<HistoryOfSpecificService> => {
    let endPath = EndPathServiceHistory(serviceId);
    let response;

    response = await fetch(endPath);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}




export const postService = async (service: Service): Promise<Object[]> =>{
    let response;
    let endPath = EndPathService()
    
    response = await fetch(endPath,
    {
        method: "POST",
        body: JSON.stringify({
            name: service.name,
            type: service.type,
            team: service.team,
            serviceDependencies: service.serviceDependencies,
            componentDependencies: service.componentDependencies,
            monitorlink: service.monitorlink,
            pollingUrl: service.pollingUrl,
            areasContainingThisService: service.areasContainingThisService
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




export const deleteService = async (service): Promise<Object[]> =>{
    let response;

    let endPath = EndPathSpecificService(service.id)

    response = await fetch(endPath,
    {
        method: "DELETE",
        body: JSON.stringify({
            Service_id: service.id,
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



export const updateService = async (service: Service): Promise<void> =>{
    let response;
    let endPath = EndPathUpdateService(service.id)


    response = await fetch(endPath, {
            method: "PUT",
            body: JSON.stringify({
                id: service.id,
                name: service.name,
                type: service.type,
                team: service.team,
                serviceDependencies: service.serviceDependencies,
                componentDependencies: service.componentDependencies,
                monitorlink: service.monitorlink,
                pollingUrl: service.pollingUrl,
                areasContainingThisService: service.areasContainingThisService
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



export const fetchServiceFromId = async (serviceId: string): Promise<Service> => {

    let endUrl = EndPathSpecificService(serviceId);
    let response;

    response = await fetch(endUrl);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}





export const fetchServiceStatuses = async (): Promise<string[]> => {
    let endUrl = EndPathServiceStatus();
    let response;

    response = await fetch(endUrl);

    if (response.ok) {
        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
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