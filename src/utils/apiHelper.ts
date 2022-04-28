// Areas
export const EndPathArea = () =>  {
    return "/sp/rest/Area"
}

export const EndPathAreas = () =>  {
    return "/sp/rest/Areas"
}

export const EndPathSpecificArea = (areaId: string) =>  {
    return EndPathArea() + "/" + areaId
}

export const EndPathServiceToArea = (areaId: string, serviceId: string) =>  {
    return EndPathArea() + "/" + areaId + "/" + serviceId
}
// ---



// Dashboards
export const EndPathDashboard = () => {
    return "/sp/rest/Dashboard"
}
export const EndPathPutAreasToDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}


export const EndPathSpecificDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathUpdateDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/Update/" + dashboardId
}

export const EndPathDashboardWithArea = (dashboardId: string) => {
    return EndPathAreas() + "/" + dashboardId
}

export const EndPathDashboards = () => {
    return "/sp/rest/Dashboards"
}
// ---



// Services
export const EndPathService = () => {
    return "/sp/rest/Service"
}

export const EndPathServices = () => {
    return "/sp/rest/Services"
}

export const EndPathServiceHistory = (serviceId: string) => {
    return EndPathService() + "/HistoryAggregated/" + serviceId
}

export const EndPathAreaContainingServices = (serviceId: string) => {
    return "/sp/rest/Service/Areas/" + serviceId
}

export const EndPathServiceTypes = () => {
    return EndPathServices() + "/Types"
}

export const EndPathServiceStatus = () => {
    return EndPathServices() + "/Status"
}

export const EndPathUpdateService = (serviceId: string) => {
    return EndPathService() + "/" + serviceId
}

export const EndPathSpecificService = (serviceId: string) => {
    return "/sp/rest/Service/" + serviceId
}

export const EndPathPutServiceDependency = (serviceId: string, dependencyId: string) => {
    return EndPathService() + "/addDependency/" + serviceId + "/" + dependencyId
}
// ---


// Components
export const EndPathComponent = () => {
    return "/sp/rest/Service"
}

export const EndPathComponents = () => {
    return "/sp/rest/Components"
}

export const EndPathAreaContainingComponents = (componentId: string) => {
    return "/sp/rest/Component/Areas/" + componentId
}

export const EndPathComponentTypes = () => {
    return EndPathServices() + "/Types"
}

export const EndPathComponentStatus = () => {
    return EndPathServices() + "/Status"
}

export const EndPathUpdateComponent = (componentId: string) => {
    return EndPathService() + "/" + componentId
}

export const EndPathSpecificComponent = (componentId: string) => {
    return "/sp/rest/Component/" + componentId
}

export const EndPathPutComponentDependency = (componentId: string, dependencyId: string) => {
    return EndPathService() + "/addDependency/" + componentId + "/" + dependencyId
}
// ---


// Login
export const EndPathGetLoginInfo = () => {
    return "/sp/oauth2/NavUser"
}
// ---



// SubAreas
export const EndPathSubAreas = () => {
    return "/sp/rest/SubAreas/"
}


// OPS
export const EndPathOps = () => {
    return "/sp/rest/OpsMessage"
}

export const EndPathSpecificOps = (opsId: string) => {
    return EndPathOps() + "/" + opsId
}