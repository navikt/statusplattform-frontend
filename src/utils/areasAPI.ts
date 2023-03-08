
import { Area, SubArea } from "../types/types";
import { EndPathAreasMinimal,EndPathArea, EndPathAreaContainingServices, EndPathAreas, EndPathDashboardWithArea, EndPathPutAreasToDashboard, EndPathServiceToArea, EndPathSpecificArea, EndPathSubAreas } from "./apiHelper";
import { createApiRequest } from "./createApiRequest";

export class ResponseError extends Error {
    public constructor (message: string, public response: Response) {
        super(message)
    }
}

const myHeaders = new Headers()
myHeaders.append("backendpath", EndPathArea())



const createRequest = (path, headers)  => new Request(path, {
    headers: new Headers(headers)
})


export const fetchAreasMinimal = async (): Promise<Area[]> => {
    let response;
    let endPath = EndPathAreas() + "/Minimal"

    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {

        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}



export const fetchAreas = async (): Promise<Area[]> => {
    let response;
    let endPath = EndPathAreas()

    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {

        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}



export const postAdminArea = async (adminArea): Promise<Object[]> =>{
    let response;
    let endPath = EndPathAreas()

    let body = JSON.stringify({
        name: adminArea.name,
        description: adminArea.description,
        icon: adminArea.icon,
        services: adminArea.services
    })
    
    let request = createApiRequest(endPath,"POST", body)
    response = await fetch(request)



    if (response.ok) {
        return await response.json()

    }
    throw new ResponseError("Failed to fetch from server", response)
}



export const updateArea = async (area: Area): Promise<void> =>{
    let response;
    let path = EndPathSpecificArea(area.id)

    let body = JSON.stringify({
        id: area.id,
        name: area.name,
        description: area.description,
        icon: area.icon,
        services: area.services,
        subAreas: area.subAreas
    })

    let request = createApiRequest(path, "PUT", body)


    response = await fetch(request);

    if (response.ok) {
        return await response

    }

    throw new ResponseError("Failed to fetch from server", response)
}




export const deleteArea = async (area: Area): Promise<void> =>{
    let response;
    let endPath = EndPathSpecificArea(area.id)

    let body = JSON.stringify({
        id: area.id,
        name: area.name,
        description: area.description,
        icon: area.icon
    })

    let request = createApiRequest(endPath,"DELETE", body)


    response = await fetch(request);

    if (response.ok) {
        return await response

    }
    throw new ResponseError("Failed to fetch from server", response)

}





export const fetchAreasContainingService = async (serviceId: string): Promise<Area[]> => {
    let response;
    let endPath = EndPathAreaContainingServices(serviceId)


    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {

        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}




export const fetchAreasInDashboard = async (dashboardId: string): Promise<Area[]> => {
    let response;
    let endPath = EndPathDashboardWithArea(dashboardId)

    let request = createApiRequest(endPath,"GET")
    response = await fetch(request);

    if (response.ok) {

        return response.json()
    }
    throw new ResponseError("Failed to fetch from server", response)
}





export const putAreasToDashboard = async (dashboardId: string, areasToPut: string[]): Promise<Object[]> =>{
    let response;
    let endPath = EndPathPutAreasToDashboard(dashboardId)
    let body =  JSON.stringify(
        areasToPut
    )
    
    let request = createApiRequest(endPath,"PUT", body)


    response = await fetch(request);

    if (response.ok) {
        return await response.json()

    }
    throw new ResponseError("Failed to fetch from server", response)
}



export const deleteServiceFromArea = async (areaId, serviceId): Promise<void> =>{
    let response;
    let endPath = EndPathArea() + "/"+ areaId + "/" + serviceId

    let body = JSON.stringify({
        areaId: areaId,
        serviceId: serviceId,
    })
    
    let request = createApiRequest(endPath,"DELETE", body)


    response = await fetch(request);

    if (response.ok) {
        return await response.json()

    }
    throw new ResponseError("Failed to fetch from server", response)
}


export const putServiceToArea = async (areaId, serviceId): Promise<Object[]> =>{
    let response;
    let endPath = EndPathServiceToArea(areaId, serviceId)

    
    let request = createApiRequest(endPath,"PUT")


    response = await fetch(request);

    if (response.ok) {
        return await response.json()

    }
    throw new ResponseError("Failed to fetch from server", response)
}





// SubAreas

export const fetchSubAreas = async(): Promise<SubArea[]> => {
    let response;
    let endPath = EndPathSubAreas()

    
    let request = createApiRequest(endPath,"GET")


    response = await fetch(request);

    if (response.ok) {
        return await response.json()

    }
    throw new ResponseError("Failed to fetch from server", response)

}