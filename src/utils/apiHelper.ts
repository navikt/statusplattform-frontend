export const LocalhostEndpoint = ""


export const PortalDevEndpoint = ""




export const EndPathArea = () =>  {
    return "/rest/Area"
}

export const EndPathAreas = () =>  {
    return "/rest/Areas"
}

export const EndPathSpecificArea = (areaId: string) =>  {
    return "/rest/Area/" + areaId
}

export const EndPathServiceToArea = (areaId: string, serviceId: string) =>  {
    return "/rest/Area/" + areaId + "/" + serviceId
}




export const EndPathPutAreasToDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}


export const EndPathDashboard = () => {
    return "/rest/Dashboard"
}

export const EndPathSpecificDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathDashboardWithArea = (dashboardId: string) => {
    return EndPathAreas() + "/" + dashboardId
}

export const EndPathDashboards = () => {
    return "/rest/Dashboards"
}




export const EndPathService = () => {
    return "/rest/Service"
}

export const EndPathServices = () => {
    return "/rest/Services"
}

export const EndPathServiceTypes = () => {
    return EndPathServices() + "/Types"
}

export const EndPathServiceStatus = () => {
    return EndPathServices() + "/Status"
}

export const EndPathSpecificService = (serviceId: string) => {
    return "/rest/Service/" + serviceId
}

export const EndPathPutServiceDependency = (serviceId: string, dependencyId: string) => {
    return EndPathService() + "/addDependency/" + serviceId + "/" + dependencyId
}



export const EndPathGetLoginInfo = () => {
    return "/oauth2/NavUser"
}