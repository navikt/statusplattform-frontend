import { AreaServicesList, Service } from 'types/navServices'



export const mapStatusAndIncidentsToArray = (props: AreaServicesList) => {
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

export const countServicesInAreas = (props: AreaServicesList) => {
    let numberOfServices: number = 0
    props.tiles.map(function (area){
        numberOfServices += area.services.length
    })
    return numberOfServices
}

export const countHealthyServices = (props: AreaServicesList) => {
    let healthyServices: number = 0
    props.tiles.map(area => {
        healthyServices += area.services.filter(
            (service: Service) => service.status !== "DOWN").length
    })
    return healthyServices
}

export const countFailingServices = (props: AreaServicesList) => {
    let failingServices: number = 0
    props.tiles.map(area => {
        failingServices += area.services.filter(
            (service: Service) => service.status == "DOWN").length
    })
    return failingServices
}

export const getListOfTilesThatFail = (props: AreaServicesList) => {
    let listOfTilesThatFail: string[] = []
    props.tiles.filter(tile => {
        if(tile.status === "DOWN") {
            listOfTilesThatFail.push(tile.area.name)
        }else {return}
    })
    return listOfTilesThatFail
}

export const beautifyListOfStringsForUI = (props: string[]) => {
    props.map((element, index) => {
        index === 0 ?
            props[index] = " " + element + ", "
        :

        props.length === (index+1) ? 
            props[index] = element + "."
        :
            props[index] = element + ", "
    })
    return props
}