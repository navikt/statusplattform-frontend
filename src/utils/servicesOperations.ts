import Alertstripe from 'nav-frontend-alertstriper'
import { NavAreaServicesList, NavService } from 'types/navServices'

import { fetchData } from './fetchServices'

export const mapStatusAndIncidentsToArray = (props: NavAreaServicesList) => {
    let areasArray: Array<String> = []
    props.tiles.map(tile => {
        areasArray.push(tile.status, "incidentsToBeAdded")
    })
    return areasArray;
}

export const retrieveFilteredServiceList = (areas, areaName) => {
    const filteredArea = areas.find(
        area => area.name == areaName
    )
    return filteredArea
}

export const countServicesInAreas = (props: NavAreaServicesList) => {
    let numberOfServices: number = 0
    props.tiles.map(function (area){
        numberOfServices += area.services.length
    })
    return numberOfServices
}

export const countHealthyServices = (props: NavAreaServicesList) => {
    let healthyServices: number = 0
    props.tiles.map(area => {
        healthyServices += area.services.filter(
            (service: NavService) => service.status !== "DOWN").length
    })
    return healthyServices
}

export const countFailingServices = (props: NavAreaServicesList) => {
    let failingServices: number = 0
    props.tiles.map(area => {
        failingServices += area.services.filter(
            (service: NavService) => service.status == "DOWN").length
    })
    return failingServices
}

export const getListOfTilesThatFail = (props: NavAreaServicesList) => {
    let listOfTilesThatFail: string[] = []
    props.tiles.filter(tile => {
        if(tile.status === "OK") {
            listOfTilesThatFail.push(tile.area.name)
        }else {return}
    })
    return listOfTilesThatFail
}

export const beautifyListOfStringsForUI = (props: string[]) => {
    props.map((element, index) => {
        props.length === (index+1) ? 
            props[index] = element += "."
        :
            props[index] = element += ", "
    })
    return props
}