import { Area, Service } from "../types/types"

import {
    BaggageIcon,
    FolderIcon,
    HeartIcon,
    TasklistIcon,
    HandBandageIcon,
    PersonGroupIcon,
    CalculatorIcon,
    FlowerPetalFallingIcon,
    PersonGroupFillIcon,
    HeartFillIcon,
    KronerIcon,
} from "@navikt/aksel-icons"

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
    ["0001", <BaggageIcon key="0001" />],
    ["0002", <KronerIcon key="0002" />],
    ["0003", <HeartIcon key="0003" />],
    ["0004", <PersonGroupIcon key="0004" />],
    ["0005", <HandBandageIcon key="0005" />],
    ["0006", <TasklistIcon key="0006" />], //Denne er feil ifht nav.no
    ["0007", <HeartFillIcon key="0007" />],
    ["0008", <PersonGroupFillIcon key="0008" />],
    ["0009", <KronerIcon key="0009" />], //Denne er feil ifht nav.no
    ["0010", <CalculatorIcon key="0010" />],
    ["0011", <FlowerPetalFallingIcon key="0011" />],
    ["0012", <FolderIcon key="0012" />],
])

export const getIconsFromGivenCode: any = (ikon: string) => {
    if (typeof ikon != "string") {
        return <FolderIcon />
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
