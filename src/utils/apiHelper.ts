export const RestPath = () => {
    //return "https://digitalstatus.ekstern.dev.nav.no/rest" //TODO configure environment-specific paths
    return "/rest"
    //All environments now use "/rest"
    //Unified path structure
}

// Areas
export const EndPathArea = () => {
    return RestPath() + "/Area"
}

export const EndPathAreas = () => {
    return RestPath() + "/Areas"
}

export const EndPathSpecificArea = (areaId: string) => {
    return EndPathArea() + "/" + areaId
}

export const EndPathServiceToArea = (areaId: string, serviceId: string) => {
    return EndPathArea() + "/" + areaId + "/" + serviceId
}
// ---

// Dashboards
export const EndPathDashboard = () => {
    return RestPath() + "/Dashboard"
}
export const EndPathPutAreasToDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathSpecificDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathUpdateDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathDashboardWithArea = (dashboardId: string) => {
    return EndPathAreas() + "/" + dashboardId
}

export const EndPathDashboards = () => {
    return RestPath() + "/Dashboards"
}
// ---

// Services
export const EndPathService = () => {
    return RestPath() + "/Service"
}

export const EndPathServices = () => {
    return RestPath() + "/Services"
}

export const EndPathServiceHistory = (serviceId: string) => {
    return EndPathService() + "/HistoryAggregated/" + serviceId
}

export const EndPathAreaContainingServices = (serviceId: string) => {
    return RestPath() + "/Service/Areas/" + serviceId
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
    return RestPath() + "/Service/" + serviceId
}

export const EndPathPutServiceDependency = (
    serviceId: string,
    dependencyId: string
) => {
    return EndPathService() + "/addDependency/" + serviceId + "/" + dependencyId
}
// ---

// ---- Teams:

export const EndPathSimpleTeamBySearch = (name: string) => {
    // ${backendPath}/rest/teams/simplified/search/${name}
    return RestPath() + "/teams/" + name
}

// ------

// Components
export const EndPathComponent = () => {
    return RestPath() + "/Service"
}

export const EndPathComponents = () => {
    return RestPath() + "/Components"
}

export const EndPathAreaContainingComponents = (componentId: string) => {
    return RestPath() + "/Component/Areas/" + componentId
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
    return RestPath() + "/Component/" + componentId
}

export const EndPathPutComponentDependency = (
    componentId: string,
    dependencyId: string
) => {
    return (
        EndPathService() + "/addDependency/" + componentId + "/" + dependencyId
    )
}
// ---

// Login
export const EndPathGetLoginInfo = () => {
    return RestPath() + "/NavUser"
}
// ---

// SubAreas
export const EndPathSubAreas = () => {
    return RestPath() + "/SubAreas/"
}

// OPS
export const EndPathOps = () => {
    return RestPath() + "/OpsMessage"
}

export const EndPathSpecificOps = (opsId: string) => {
    return EndPathOps() + "/" + opsId
}

// UU
export const EndPathUUTjeneste = () => {
    return RestPath() + "/Wcag/Tjeneste"
}

export const EndPathUUKrav = () => {
    return RestPath() + "/Wcag/Krav"
}
