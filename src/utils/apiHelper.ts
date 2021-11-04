
export const EndPathArea = () =>  {
    return "/rest/Area"
}

export const EndPathAreas = () =>  {
    return "/rest/Areas"
}




export const EndPathPutAreasToDashboard = (dashboardId: string) => {
    return "/" + EndPathDashboard() + "/" + dashboardId
}


export const EndPathDashboard = () => {
    return "/rest/Dashboard"
}

export const EndPathSpecificDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathDashboardWithArea = (dashboardId: string) => {
    return "/" + EndPathAreas() + "/" + dashboardId
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

export const EndPathPutServiceDependency = (serviceId: string, dependencyId: string) => {
    return EndPathService() + "/addDependency/" + serviceId + "/" + dependencyId
}