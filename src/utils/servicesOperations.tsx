import { AreaServicesList, Service } from 'types/navServices'

import { 
    Bag, Folder, HealthCase, Money, FillForms, HandBandage, GuideDog, Calculator,
    FlowerBladeFall, SocialAid, Heart, Saving
} from '@navikt/ds-icons'




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

const iconMap: Map<string, any> = new Map<string, any> ([
    ["0001", <Bag />],
    ["0002", <Saving />],
    ["0003", <Heart />],
    ["0004", <SocialAid />],
    ["0005", <HandBandage />],
    ["0006", <FillForms />], //Denne er feil ifht nav.no
    ["0007", <HealthCase />],
    ["0008", <GuideDog />],
    ["0009", <Money />], //Denne er feil ifht nav.no
    ["0010", <Calculator />],
    ["0011", <FillForms />], //Denne er feil ifht nav.no
    ["0012", <FlowerBladeFall />],
])


export const getIconsFromGivenCode: any = (ikon: string) => {
    if(typeof(ikon) != "string") {
        return <Folder />
    }
    if(iconMap.has(ikon)) {
        return iconMap.get(ikon)
    }
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