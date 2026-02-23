import { json } from "msw/lib/types/context";
import { Component, HistoryOfSpecificService, Service } from "../types/types";
import { EndPathPutServiceDependency, EndPathService, EndPathServiceHistory, EndPathServices, EndPathServiceStatus, EndPathSpecificService, EndPathUpdateService } from "./apiHelper";
import { createApiRequest } from "./createApiRequest";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}


export const fetchServicesMinimal = async (): Promise<Service[]> => {
    let response;
    let endPath = EndPathServices()+ "/Minimal"


    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        let json = await response.json()
        return json
    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const fetchServices = async (): Promise<Service[]> => {
    let response;
    let endPath = EndPathServices();


    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        let json = await response.json()
        return json
    }
    throw new ResponseError("Failed to fetch from server", response)
}

export const fetchExternalServices = async (): Promise<Service[]> => {
    let response;
    let endPath = "/rest/services/external";

    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        let json = await response.json()
        return json
    }
    throw new ResponseError("Failed to fetch external services from server", response)
}

export const fetchServiceHistory = async (serviceId: string): Promise<HistoryOfSpecificService> => {
    let endPath = EndPathServiceHistory(serviceId);
    let response;



    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        let json = await response.json()
        return json
    }
    throw new ResponseError("Failed to fetch from server", response)
}




export const postService = async (service: Service): Promise<Service> =>{
    let response;
    let endPath = EndPathService()

    let body = JSON.stringify({
        name: service.name,
        type: service.type,
        team: service.team,
        serviceDependencies: service.serviceDependencies,
        componentDependencies: service.componentDependencies,
        monitorlink: service.monitorlink,
        pollingOnPrem:service.pollingOnPrem,
        pollingUrl: service.pollingUrl,
        areasContainingThisService: service.areasContainingThisService,
        statusNotFromTeam: service.statusNotFromTeam
    })

    
    let request = createApiRequest(endPath,"POST", body)
    response = await fetch(request);



    if (response.ok) {
        return await response.json()

    }
    throw new ResponseError("Failed to POST to server", response)


}




export const deleteService = async (service): Promise<Object[]> =>{
    let response;

    let endPath = EndPathSpecificService(service.id)

    let request = createApiRequest(endPath,"DELETE")

    response = await fetch(request);


    if (response.ok) {
        return await response

    }
    throw new ResponseError("Failed to POST to server", response)
}



export const updateService = async (service: Service): Promise<void> =>{
    let response;
    let endPath = EndPathUpdateService(service.id)

    let body = JSON.stringify({
        id: service.id,
        name: service.name,
        type: service.type,
        team: service.team,
        serviceDependencies: service.serviceDependencies,
        componentDependencies: service.componentDependencies,
        monitorlink: service.monitorlink,
        pollingUrl: service.pollingUrl,
        pollingOnPrem:service.pollingOnPrem,
        areasContainingThisService: service.areasContainingThisService,
        statusNotFromTeam: service.statusNotFromTeam
    })


    let request = createApiRequest(endPath,"PUT", body)
    response = await fetch(request);



    if (response.ok) {
        return await response

    }
    throw new ResponseError("Failed to POST to server", response)
}



export const fetchServiceFromId = async (serviceId: string): Promise<Service> => {

    let endPath = EndPathSpecificService(serviceId);
    let response;


    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        return  await response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const fetchServiceStatuses = async (): Promise<string[]> => {
    let endPath = EndPathServiceStatus();
    let response;

    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {
        return await response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const putServiceDependency = async (serviceId, dependencyId): Promise<Object[]> =>{
    let response;
    let endPath = EndPathPutServiceDependency(serviceId, dependencyId)


    let request = createApiRequest(endPath,"PUT")
    response = await fetch(request);

    if (response.ok) {
        return await response
    }
    throw new ResponseError("Failed to fetch from server", response)
}