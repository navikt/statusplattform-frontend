import { Area, Service } from "../types/types"

import {
    Bag,
    Folder,
    HealthCase,
    Money,
    FillForms,
    HandBandage,
    GuideDog,
    Calculator,
    FlowerBladeFall,
    SocialAid,
    Heart,
    Saving,
} from "@navikt/ds-icons"

interface AreaPropsI {
    areas: Area[]
}

export const mapStatusAndIncidentsToArray = (props: AreaPropsI) => {
    let areasArray: Array<String> = []
    props.areas.map((tile) => {
        areasArray.push(tile.status, "incidentsToBeAdded")
    })
    return areasArray
}

export const retrieveFilteredServiceList = (areas, areaName) => {
    const filteredArea = areas.find((area) => area.name == areaName)
    return filteredArea
}

export const countServicesInAreas = (areas: Area[]) => {
    let numberOfServices: number = 0
    areas.map(function (area) {
        numberOfServices += area.services.length
    })
    return numberOfServices
}

export const countHealthyServicesInListOfAreas = (areas: Area[]) => {
    let healthyServices: number = 0
    areas.map((area) => {
        healthyServices += area.services.filter(
            (service: Service) =>
                service.record &&(
                service.record.status == "OK" ||
                service.record.status == null ||
                service.record.status == "UNKNOWN")
        ).length
    })
    return healthyServices
}

export const countFailingServices = (props: AreaPropsI) => {
    let failingServices: number = 0
    props.areas.map((area) => {
        failingServices += area.services.filter(
            (service: Service) =>
                service.record.status == "DOWN" ||
                service.record.status == "ISSUE"
        ).length
    })
    return failingServices
}

const iconMap: Map<string, any> = new Map<string, any>([
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
    ["0011", <FlowerBladeFall />],
    ["0012", <Folder />],
])

export const getIconsFromGivenCode: any = (ikon: string) => {
    if (typeof ikon != "string") {
        return <Folder />
    }
    if (iconMap.has(ikon)) {
        return iconMap.get(ikon)
    }
}

export const getListOfTilesThatFail = (props: AreaPropsI) => {
    let listOfTilesThatFail: string[] = []
    props.areas.filter((area) => {
        if (area.status === "DOWN") {
            listOfTilesThatFail.push(area.name)
        } else {
            return
        }
    })
    return listOfTilesThatFail
}

export const beautifyListOfStringsForUI = (props: string[]) => {
    props.map((element, index) => {
        index === 0
            ? (props[index] = " " + element + ", ")
            : props.length === index + 1
            ? (props[index] = element + ".")
            : (props[index] = element + ", ")
    })
    return props
}
