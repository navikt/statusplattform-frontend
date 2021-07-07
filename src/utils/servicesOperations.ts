import Alertstripe from 'nav-frontend-alertstriper'
import { NavAreaService, NavAreaServicesList } from 'types/navServices'

import { fetchData } from './fetchServices'

// export const mapStatusAndIncidentsToArray = (areas) => {
//     let areasArray: Array<String> = []
//     areas.map(area => {
//         areasArray.push(area)
//     })
//     return areasArray;
// }

export const retrieveFilteredServiceList = (areas, areaName) => {
    const filteredArea = areas.find(
        area => area.name == areaName
    )
    return filteredArea
}

export const countServicesInAreas = (props: NavAreaServicesList) => {
    let numberOfServices: number = 0;
    props.areas.map(function (area){
        numberOfServices += area.services.length
    })
    return numberOfServices
}

export const countHealthyServices = (props: NavAreaServicesList) => {
    let healthyServices: number = 0;
    props.areas.map(area => {
        healthyServices += area.services.filter(
            (service: any) => service.status !== "DOWN").length
    })
    return healthyServices
}

