const urlBasedOnEnvironment = (): string => {
    let thisUrl = window.location.href;

    if(thisUrl.includes('localhost')){
        return "http://localhost:3005"
    }

    else if(thisUrl.includes("portal.labs")) {
        return "https://digitalstatus.ekstern.dev.nav.no"
    }

    else {
        return "https://status.nav.no/sp"
    }
}

// Areas
export const EndPathArea = () =>  {
    return urlBasedOnEnvironment() + "/rest/Area"
}

export const EndPathAreas = () =>  {
    return urlBasedOnEnvironment() + "/rest/Areas"
}

export const EndPathSpecificArea = (areaId: string) =>  {
    return EndPathArea() + "/" + areaId
}

export const EndPathServiceToArea = (areaId: string, serviceId: string) =>  {
    return urlBasedOnEnvironment() + EndPathArea() + "/" + areaId + "/" + serviceId
}
// ---



// Dashboards
export const EndPathDashboard = () => {
    return urlBasedOnEnvironment() + "/rest/Dashboard"
}
export const EndPathPutAreasToDashboard = (dashboardId: string) => {
    return urlBasedOnEnvironment() + EndPathDashboard() + "/" + dashboardId
}


export const EndPathSpecificDashboard = (dashboardId: string) => {
    return EndPathDashboard() + "/" + dashboardId
}

export const EndPathUpdateDashboard = (dashboardId: string) => {
    return urlBasedOnEnvironment() + EndPathDashboard() + "/Update/" + dashboardId
}

export const EndPathDashboardWithArea = (dashboardId: string) => {
    return urlBasedOnEnvironment() + EndPathAreas() + "/" + dashboardId
}

export const EndPathDashboards = () => {
    return urlBasedOnEnvironment() + "/rest/Dashboards"
}
// ---



// Services
export const EndPathService = () => {
    return urlBasedOnEnvironment() + "/rest/Service"
}

export const EndPathServices = () => {
    return urlBasedOnEnvironment() + "/rest/Services"
}

export const EndPathServiceHistory = (serviceId: string) => {
    return urlBasedOnEnvironment() + EndPathService() + "/HistoryAggregated/" + serviceId
}

export const EndPathAreaContainingServices = (serviceId: string) => {
    return urlBasedOnEnvironment() + "/rest/Service/Areas/" + serviceId
}

export const EndPathServiceTypes = () => {
    return urlBasedOnEnvironment() + EndPathServices() + "/Types"
}

export const EndPathServiceStatus = () => {
    return urlBasedOnEnvironment() + EndPathServices() + "/Status"
}

export const EndPathUpdateService = (serviceId: string) => {
    return urlBasedOnEnvironment() + EndPathService() + "/" + serviceId
}

export const EndPathSpecificService = (serviceId: string) => {
    return "/rest/Service/" + serviceId
}

export const EndPathPutServiceDependency = (serviceId: string, dependencyId: string) => {
    return urlBasedOnEnvironment() + EndPathService() + "/addDependency/" + serviceId + "/" + dependencyId
}
// ---


// Components
export const EndPathComponent = () => {
    return urlBasedOnEnvironment() + "/rest/Service"
}

export const EndPathComponents = () => {
    return urlBasedOnEnvironment() + "/rest/Components"
}

export const EndPathAreaContainingComponents = (componentId: string) => {
    return urlBasedOnEnvironment() + "/rest/Component/Areas/" + componentId
}

export const EndPathComponentTypes = () => {
    return urlBasedOnEnvironment() + EndPathServices() + "/Types"
}

export const EndPathComponentStatus = () => {
    return urlBasedOnEnvironment() + EndPathServices() + "/Status"
}

export const EndPathUpdateComponent = (componentId: string) => {
    return urlBasedOnEnvironment() + EndPathService() + "/" + componentId
}

export const EndPathSpecificComponent = (componentId: string) => {
    return "/rest/Component/" + componentId
}

export const EndPathPutComponentDependency = (componentId: string, dependencyId: string) => {
    return urlBasedOnEnvironment() + EndPathService() + "/addDependency/" + componentId + "/" + dependencyId
}
// ---


// Login
export const EndPathGetLoginInfo = () => {
    return urlBasedOnEnvironment() + "/oauth2/NavUser"
}
// ---



// SubAreas
export const EndPathSubAreas = () => {
    return urlBasedOnEnvironment() + "/rest/SubAreas/"
}


// OPS
export const EndPathOps = () => {
    return urlBasedOnEnvironment() + "/rest/OpsMessage"
}

export const EndPathSpecificOps = (opsId: string) => {
    return EndPathOps() + "/" + opsId
}