// Areas
export const EndPathArea = () =>  {
    return "/rest/Area"
}

export const EndPathAreas = () =>  {
    return "/rest/Areas"
}

export const EndPathSpecificArea = (areaId: string) =>  {
    return EndPathArea() + "/" + areaId
}

export const EndPathServiceToArea = (areaId: string, serviceId: string) =>  {
    return EndPathArea() + "/" + areaId + "/" + serviceId
}
// ---



// Dashboards
export const EndPathPutAreasToDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathDashboard = () => {
    return "/rest/Dashboard"
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
    return "/rest/Dashboards"
}
// ---



// Services
export const EndPathService = () => {
    return "/rest/Service"
}

export const EndPathServices = () => {
    return "/rest/Services"
}

export const EndPathAreaContainingServices = (serviceId: string) => {
    return "/rest/Service/Areas/" + serviceId
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
    return "/rest/Service/" + serviceId
}

export const EndPathPutServiceDependency = (serviceId: string, dependencyId: string) => {
    return EndPathService() + "/addDependency/" + serviceId + "/" + dependencyId
}
// ---


// Components
export const EndPathComponent = () => {
    return "/rest/Service"
}

export const EndPathComponents = () => {
    return "/rest/Components"
}

export const EndPathAreaContainingComponents = (componentId: string) => {
    return "/rest/Component/Areas/" + componentId
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
    return "/rest/Component/" + componentId
}

export const EndPathPutComponentDependency = (componentId: string, dependencyId: string) => {
    return EndPathService() + "/addDependency/" + componentId + "/" + dependencyId
}
// ---


// Login
export const EndPathGetLoginInfo = () => {
    return "/oauth2/NavUser"
}
// ---



// SubAreas
export const EndPathSubAreas = () => {
    return "/rest/SubAreas/"
}