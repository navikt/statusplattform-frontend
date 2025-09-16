import { useContext, useEffect, useState } from "react"
import router from "next/router"
import Head from "next/head"
import styled from "styled-components"
import { toast } from "react-toastify"

import {
    BaggageIcon,
    CalculatorIcon,
    XMarkIcon,
    TrashIcon,
    ChevronDownIcon,
    TasklistIcon,
    FlowerPetalFallingIcon,
    FolderIcon,
    PersonGroupIcon,
    HandBandageIcon,
    HeartIcon,
    HeartIcon as HealthCaseIcon,
    KronerIcon,
    DocPencilIcon,
    FloppydiskIcon,
    KronerIcon as SavingIcon,
    PersonGroupIcon as SocialAidIcon,
} from "@navikt/aksel-icons"

import { BodyShort, Button, Modal, Select, TextField } from "@navikt/ds-react"
import { useLoader } from "../../utils/useLoader"
import {
    deleteArea,
    fetchAreas,
    fetchSubAreas,
    updateArea,
} from "../../utils/areasAPI"
import { fetchServices } from "../../utils/servicesAPI"
import { TitleContext } from "../ContextProviders/TitleContext"
import { Area, Service, SubArea } from "../../types/types"
import {
    AdminCategoryContainer,
    CloseCustomized,
    DependencyList,
    ModalInner,
} from "../../pages/Admin"
import { RouterAdminAddOmråde } from "../../types/routes"
import CustomNavSpinner from "../CustomNavSpinner"

const AreaHeader = styled.div`
    padding: 1rem;
    font-weight: bold;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);

    display: flex;
    gap: 5ch;

    .area-header-content {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        gap: 5ch;
        span {
            width: 100%;
        }
    }

    .empty-space {
        padding: 0 calc(3rem + 40px);
        display: flex;
        flex-direction: row;
    }
`

const AreaElementContainer = styled.div`
    padding: 1px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    :hover {
        padding: 0;

        border-top: 2px solid rgba(0, 0, 0, 0.55);
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);
    }
    :last-child {
        padding-bottom: 1px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);
        :hover {
            padding-bottom: 0;
            border-bottom: 3px solid rgba(0, 0, 0, 0.55);
        }
    }
    &.editting {
        border-color: var(--a-blue-500);
    }
`

const TableOmraade = () => {
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [anchorId, setAnchorId] = useState<string>("")

    const [areasToEdit, changeAreasToEdit] = useState<string[]>([])
    const [areaToDelete, setAreaToDelete] = useState<Area>()

    const [allAreas, setAllAreas] = useState<Area[]>()
    const [allServices, setAllServices] = useState<Service[]>()

    const [isLoadingAreas, setIsLoadingAreas] = useState(true)
    const [isLoadingServices, setIsLoadingServices] = useState(true)

    const { changeTitle } = useContext(TitleContext)

    useEffect(() => {
        changeTitle("Admin - Områder")
        setIsLoadingAreas(true)
        setIsLoadingServices(true)
        let controlVar = true

        const setup = async () => {
            if (controlVar) {
                try {
                    const areas: Area[] = await fetchAreas()
                    const services: Service[] = await fetchServices()
                    await setAllAreas(areas)
                    await setAllServices(services)
                } catch (e) {
                    // console.log(e)
                    toast.error("Noe gikk galt ved henting av data")
                } finally {
                    setIsLoadingAreas(false)
                    setIsLoadingServices(false)
                }
            }
        }
        if (controlVar) {
            setup()
        }
        controlVar = false
    }, [])

    const reloadAll = async () => {
        let controlVar = true

        if (controlVar) {
            try {
                await reloadAreas()
                await reloadServices()
            } catch (error) {
                // console.log(error)
                toast.error("Noe gikk galt i hentingen.")
            }
        }
        controlVar = false
    }

    const reloadAreas = async () => {
        let controlVar = true
        setIsLoadingAreas(true)

        if (controlVar) {
            try {
                const reloadedAreas: Area[] = await fetchAreas()
                setAllAreas(reloadedAreas)
                setIsLoadingAreas(false)
            } catch (error) {
                // console.log(error)
                setIsLoadingAreas(false)
                toast.error("Noe gikk galt i hentingen.")
            }
        }
        controlVar = false
    }
    const reloadServices = async () => {
        let controlVar = true
        setIsLoadingServices(true)

        if (controlVar) {
            try {
                const reloadedServices: Service[] = await fetchServices()
                setAllServices(reloadedServices)
            } catch (error) {
                setIsLoadingServices(false)
                // console.log(error)
                toast.error("Noe gikk galt i hentingen.")
            }
        }
        controlVar = false
    }

    useEffect(() => {
        setTimeout(() => {
            const element = document.getElementById(anchorId)
            if (element) {
                element.scrollIntoView()
            }
        }, 300)
    }, [anchorId])

    if (isLoadingAreas || isLoadingServices) {
        return <CustomNavSpinner />
    }

    const toggleExpandedFor = (tileAreaId) => {
        if (expanded.includes(tileAreaId)) {
            toggleExpanded([...expanded.filter((i) => i !== tileAreaId)])
        } else {
            toggleExpanded([...expanded, tileAreaId])
        }
    }

    const toggleEditArea = (area: Area) => {
        let edittingAreas: string[] = [...areasToEdit]
        if (edittingAreas.includes(area.id)) {
            changeAreasToEdit(edittingAreas.filter((d) => d != area.id))
            return
        }
        edittingAreas.push(area.id)
        changeAreasToEdit(edittingAreas)
    }

    const confirmDeleteAreaHandler = () => {
        deleteArea(areaToDelete)
            .then(() => {
                toast.info("Området ble slettet")
                setAreaToDelete(null)
                reloadAreas()
            })
            .catch(() => {
                toast.error("Kunne ikke slette området")
            })
    }

    return (
        <AdminCategoryContainer>
            <Head>
                <title>Admin - Områder - status.nav.no</title>
            </Head>

            <Modal
                open={!!areaToDelete}
                onClose={() => setAreaToDelete(null)}
                header={{ heading: "Bekreft sletting" }}
            >
                <Modal.Body>
                    Ønsker du å slette området?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setAreaToDelete(null)}
                    >
                        Avbryt
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDeleteAreaHandler}
                    >
                        Slett området
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="centered">
                <Button
                    variant="secondary"
                    onClick={() => router.push(RouterAdminAddOmråde.PATH)}
                >
                    <b>Legg til nytt område</b>
                </Button>
            </div>

            <div className="category-overflow-container">
                <div>
                    <AreaHeader>
                        <div className="area-header-content">
                            <span>Navn</span>
                            <span>Beskrivelse</span>
                        </div>
                        <div className="empty-space"></div>
                    </AreaHeader>

                    <div>
                        {allAreas.map((area, index) => {
                            return (
                                <AreaElementContainer
                                    className={
                                        areasToEdit.includes(area.id)
                                            ? "editting"
                                            : ""
                                    }
                                    key={index}
                                >
                                    {!areasToEdit.includes(area.id) ? (
                                        <AreaTableRow
                                            area={area}
                                            allServices={allServices}
                                            reloadAll={reloadAll}
                                            isExpanded={expanded.includes(
                                                area.id
                                            )}
                                            toggleExpanded={() =>
                                                toggleExpandedFor(area.id)
                                            }
                                            toggleEditArea={() =>
                                                toggleEditArea(area)
                                            }
                                            setAreaToDelete={() =>
                                                setAreaToDelete(area)
                                            }
                                        />
                                    ) : (
                                        <CurrentlyEdittingArea
                                            area={area}
                                            allServices={allServices}
                                            reloadAreas={reloadAreas}
                                            isExpanded={expanded.includes(
                                                area.id
                                            )}
                                            toggleExpanded={() =>
                                                toggleExpandedFor(area.id)
                                            }
                                            toggleEditArea={() =>
                                                toggleEditArea(area)
                                            }
                                            setAreaToDelete={() =>
                                                setAreaToDelete(area)
                                            }
                                        />
                                    )}
                                </AreaElementContainer>
                            )
                        })}
                    </div>
                </div>
            </div>
        </AdminCategoryContainer>
    )
}

/* ------------------------------------------- COMMON DATA BELOW --------------------------------------------------------- */

export const options = [
    { value: "0001", label: "Bag", icon: <BaggageIcon /> },
    { value: "0002", label: "Sparepenger", icon: <SavingIcon /> },
    { value: "0003", label: "Hjerte", icon: <HeartIcon /> },
    { value: "0004", label: "Sosialstøtte", icon: <SocialAidIcon /> },
    { value: "0005", label: "Bandasje", icon: <HandBandageIcon /> },
    { value: "0006", label: "Skjemautfylt", icon: <TasklistIcon /> },
    { value: "0007", label: "Førstehjelp", icon: <HealthCaseIcon /> },
    { value: "0008", label: "Guidehund", icon: <PersonGroupIcon /> },
    { value: "0009", label: "Penger", icon: <KronerIcon /> },
    { value: "0010", label: "Kalkulator", icon: <CalculatorIcon /> },
    { value: "0011", label: "Blomst", icon: <FlowerPetalFallingIcon /> },
    { value: "0012", label: "Mappe", icon: <FolderIcon /> },
]

/* -------------------------------------------  --------------------------------------------------------- */

const AreaRowContainer = styled.div`
    min-height: 5rem;
    background-color: var(--a-gray-100);

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    :first-child {
        padding-left: 1rem;
    }
`

const AreaRowInner = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .top-row {
        min-height: 5rem;
        padding-right: 5ch;

        display: flex;
        align-items: center;
        flex-grow: 1;

        & > * {
            display: flex;
            flex-basis: 100%;
        }
        .row-element {
            flex-basis: 100%;
            margin-right: 5ch;
            word-break: break-word;
            width: 10rem;

            & > * {
                width: 20ch;
            }
        }
        :hover {
            cursor: pointer;
        }
    }

    .bottom-row {
        border-top: 2px solid rgba(0, 0, 0, 0.1);
        min-height: 5rem;
        padding: 1rem 0;

        display: flex;
        flex: row;
        gap: 3rem;

        & > * {
            display: flex;
            flex-basis: 100%;
        }
        .bottom-row-column {
            display: flex;
            flex-direction: column;
            max-width: 275px;

            p {
                max-width: fit-content;
            }
        }
        .row-element {
            margin-right: 5ch;
            display: flex;
            flex-direction: column;

            ul {
                margin-top: 0;
            }
        }
        span:first-child {
            margin: 0 2rem;
        }
        .clickable {
            width: 100%;

            :hover {
                cursor: pointer;
            }
        }
    }

    &.clickable {
        flex-grow: 1;
        :hover {
            cursor: pointer;
        }
    }
`
const AreaElements = styled.div`
    display: flex;
    align-items: center;
`

// const IconContainer = styled.section`
// 	color: var(--a-blue-500);
//     font-size: 2rem;
//     display: flex;
//     align-items: center;
// `;

const TileDropdownColumn = styled.div`
    max-width: 300px;
    display: flex;
    flex-direction: column;

    :hover {
        cursor: default;
    }

    select {
        cursor: pointer;
        margin: 1rem 0;
    }

    button {
        max-width: 148px;
    }
`

const ServicesInAreaList = styled.ul`
    max-width: 100%;
    padding: 0;

    word-break: break-word;

    li {
        list-style: none;

        border: 1px solid transparent;
        border-radius: 5px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        :hover {
            border: 1px solid black;
        }
    }

    button {
        background-color: transparent;
        border: none;

        :hover {
            cursor: pointer;
            color: grey;
        }
    }
`

const CustomButton = styled.button`
    background-color: transparent;
    border: none;
    :hover {
        cursor: pointer;
    }
`

interface Props {
    area: Area
    allServices: Service[]
    reloadAll: () => void
    isExpanded: boolean
    toggleExpanded: () => void
    toggleEditArea: (area) => void
    setAreaToDelete: (area) => void
}

const AreaTableRow = ({
    area,
    reloadAll,
    isExpanded,
    toggleExpanded,
    allServices,
    toggleEditArea,
    setAreaToDelete,
}: Props) => {
    const [servicesInArea, setServicesInArea] = useState<Service[]>(() =>
        area.services.map((service) => service)
    )

    const handleToggleEditArea = () => {
        if (!isExpanded) {
            toggleExpanded()
        }
        toggleEditArea(area)
    }

    const { id: areaId, name, description: beskrivelse, subAreas } = area

    return (
        <AreaRowContainer id={areaId}>
            <AreaRowInner className="clickable" onClick={toggleExpanded}>
                <div className="top-row">
                    <span className="row-element">{name}</span>
                    <span className="row-element">{beskrivelse}</span>
                </div>

                {isExpanded && (
                    <div className="bottom-row">
                        <div className="bottom-row-column">
                            {servicesInArea.length === 0 ? (
                                <div className="row-element">
                                    Ingen tjenester er knyttet til området.
                                </div>
                            ) : (
                                <div className="row-element">
                                    <BodyShort spacing>
                                        <b>Tjenester i område</b>
                                    </BodyShort>
                                    <ul>
                                        {servicesInArea.map((service) => {
                                            return (
                                                <li key={service.id}>
                                                    {service.name}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="bottom-row-column">
                            {subAreas.length === 0 ? (
                                <div className="row-element">
                                    Ingen underområder knyttet til området.
                                </div>
                            ) : (
                                <div className="row-element">
                                    <BodyShort spacing>
                                        <b>Underområder i område</b>
                                    </BodyShort>
                                    <ul>
                                        {subAreas.map((subArea) => {
                                            return (
                                                <li key={subArea.id}>
                                                    {subArea.name}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AreaRowInner>

            <div className="button-container">
                <CustomButton
                    className="option"
                    onClick={() => handleToggleEditArea()}
                >
                    <a>
                        <DocPencilIcon /> Rediger
                    </a>
                </CustomButton>
                <button
                    className="option"
                    onClick={setAreaToDelete}
                    aria-label="Slett område"
                >
                    <a>
                        <TrashIcon /> Slett
                    </a>
                </button>
                <button
                    className="option"
                    onClick={toggleExpanded}
                    aria-expanded={isExpanded}
                >
                    <ChevronDownIcon
                        className={isExpanded ? "expanded" : "not-expanded"}
                    />
                </button>
            </div>
        </AreaRowContainer>
    )
}

// ----------------------------------------------------------------------------------------------------

const EditDependeciesContainer = styled.div`
    min-width: 100px;

    select {
        transform: translateY(-2px);
    }
`

interface EditProps {
    area: Area
    allServices: Service[]
    isExpanded: boolean
    reloadAreas: () => void
    toggleExpanded: (area: any) => void
    toggleEditArea: (area: any) => void
    setAreaToDelete: (area: any) => void
}

const CurrentlyEdittingArea = ({
    area,
    allServices,
    reloadAreas,
    isExpanded,
    toggleExpanded,
    toggleEditArea,
    setAreaToDelete,
}: EditProps) => {
    const [updatedArea, changeUpdatedArea] = useState({
        id: area.id,
        name: area.name,
        description: area.description,
        icon: area.icon,
        services: area.services,
        components: area.components,
        subAreas: area.subAreas,
        contains_components: area.contains_components
    })

    const [servicesInArea, setServicesInArea] = useState<Service[]>(() =>
        area.services.map((service) => service)
    )
    const [subAreasInArea, setSubAreasInArea] = useState<SubArea[]>(() =>
        area.subAreas.map((subArea) => subArea)
    )

    const { data: subAreas, isLoading, reload } = useLoader(fetchSubAreas, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const handleDeleteServiceOnArea = (serviceId) => {
        setServicesInArea([
            ...servicesInArea.filter((service) => service.id !== serviceId),
        ])
        toast.info("Tjeneste slettet fra område")
        // deleteServiceFromArea(area.id, serviceId)
        //     .then(() => {
        //     })
        //     .catch(() => {
        //         toast.warn("Tjeneste ble ikke slettet fra område grunnet feil")
        //     })
    }

    const handlePutServiceToArea = (service: Service) => {
        if (servicesInArea.map((s) => s.id).includes(service.id)) {
            toast.warn("Denne tjenesten fins allerede i området")
            return
        }

        setServicesInArea([...servicesInArea, service])
        const newArea = {
            ...updatedArea,
            services: [...servicesInArea, service],
        }

        changeUpdatedArea(newArea)
        toast.success("Tjenesten har blitt lagt til i området")
    }

    const handleDeleteSubAreaOnArea = (subAreaId) => {
        setSubAreasInArea([
            ...subAreasInArea.filter((subArea) => subArea.id !== subAreaId),
        ])
        toast.info("Underområde slettet fra område")
    }

    const handlePutSubAreaToArea = (subArea: SubArea) => {
        if (subAreasInArea.map((a) => a.id).includes(subArea.id)) {
            toast.warn("Dette underområdet fins allerede i området")
            return
        }

        setSubAreasInArea([...subAreasInArea, subArea])
        const newArea = {
            ...updatedArea,
            subAreas: [...subAreasInArea, subArea],
        }

        changeUpdatedArea(newArea)
        toast.success("Underområdet har blitt lagt til i området")
    }

    const handleUpdatedArea =
        (field: keyof typeof updatedArea) =>
            (evt: React.ChangeEvent<HTMLInputElement>) => {
                const changedArea = {
                    ...updatedArea,
                    [field]:
                        evt.target.getAttribute("type") === "number"
                            ? parseInt(evt.target.value)
                            : evt.target.value,
                }

                changeUpdatedArea(changedArea)
            }

    const handleSubmit = () => {
        let fetching = true
        try {
            if (fetching) {
                updateArea(updatedArea).then(() => {
                    reloadAreas()
                    if (isExpanded) {
                        toggleExpanded(area)
                    }
                    toggleEditArea(area)
                    toast.success("Oppdatering gjennomført")
                    fetching = false
                })
            }
        } catch (error) {
            // console.log(error)
            toast.error("Noe gikk galt i oppdatering av område")
        }
    }

    const handleDisableEditArea = (area) => {
        if (isExpanded) {
            toggleExpanded(area)
        }
        toggleEditArea(area)
    }

    const { name, description } = updatedArea

    return (
        <form onSubmit={handleSubmit}>
            <AreaRowContainer id={area.id} className="clickable editting">
                <AreaRowInner>
                    <AreaElements className="top-row" onClick={toggleExpanded}>
                        <TextField
                            label="Navn"
                            hideLabel
                            className="row-element editting"
                            value={name}
                            onChange={handleUpdatedArea("name")}
                            onClick={(event) => event.stopPropagation()}
                        />
                        <TextField
                            label="Beskrivelse"
                            hideLabel
                            className="row-element editting"
                            value={description}
                            onChange={handleUpdatedArea("description")}
                            onClick={(event) => event.stopPropagation()}
                        />
                    </AreaElements>

                    {isExpanded && (
                        <div className="bottom-row">
                            <div className="bottom-row-column">
                                {servicesInArea.length === 0 && (
                                    <p>
                                        Ingen tjenester er knyttet til området.
                                        Nedenfor kan du velge en ny tjeneste å
                                        legge til.
                                    </p>
                                )}

                                {servicesInArea.length > 0 && (
                                    <ServicesInAreaList>
                                        <EditDependeciesContainer>
                                            <BodyShort spacing>
                                                <b>Tjenester i område:</b>
                                            </BodyShort>
                                            <DependencyList>
                                                {servicesInArea.map(
                                                    (service) => {
                                                        return (
                                                            <li
                                                                key={service.id}
                                                            >
                                                                {service.name}
                                                                <button
                                                                    type="button"
                                                                    aria-label="Fjern tjenesten fra område"
                                                                    onClick={() =>
                                                                        handleDeleteServiceOnArea(
                                                                            service.id
                                                                        )
                                                                    }
                                                                >
                                                                    <CloseCustomized />
                                                                </button>
                                                            </li>
                                                        )
                                                    }
                                                )}
                                            </DependencyList>
                                        </EditDependeciesContainer>
                                    </ServicesInAreaList>
                                )}

                                <DropdownRowSelect
                                    allServices={allServices}
                                    servicesInArea={servicesInArea}
                                    handlePutServiceToArea={
                                        handlePutServiceToArea
                                    }
                                    toggleAreaExpanded={toggleExpanded}
                                />
                            </div>

                            <div className="bottom-row-column">
                                <ServicesInAreaList>
                                    <EditDependeciesContainer>
                                        <BodyShort spacing>
                                            <b>Subområder i område:</b>
                                        </BodyShort>
                                        <DependencyList>
                                            {subAreasInArea.map((subArea) => {
                                                return (
                                                    <li key={subArea.id}>
                                                        {subArea.name}
                                                        <button
                                                            type="button"
                                                            aria-label="Fjern underområde fra område"
                                                            onClick={() =>
                                                                handleDeleteSubAreaOnArea(
                                                                    subArea.id
                                                                )
                                                            }
                                                        >
                                                            <CloseCustomized />
                                                        </button>
                                                    </li>
                                                )
                                            })}
                                        </DependencyList>
                                    </EditDependeciesContainer>
                                </ServicesInAreaList>

                                <DropdownSubAreaSelect
                                    subAreas={subAreas}
                                    subAreasInArea={subAreasInArea}
                                    handlePutSubAreaToArea={
                                        handlePutSubAreaToArea
                                    }
                                    toggleAreaExpanded={toggleExpanded}
                                />
                            </div>

                            <div
                                className="clickable"
                                onClick={toggleExpanded}
                            />
                        </div>
                    )}
                </AreaRowInner>

                <div className="button-container">
                    <button
                        type="button"
                        className="option"
                        onClick={handleSubmit}
                    >
                        <a>
                            <FloppydiskIcon /> Lagre
                        </a>
                    </button>
                    <button
                        type="button"
                        className="option"
                        onClick={() => handleDisableEditArea(area)}
                        aria-label="Fjern dashbord"
                    >
                        <a>
                            <XMarkIcon /> Avbryt
                        </a>
                    </button>
                    <button
                        type="button"
                        className="option"
                        onClick={setAreaToDelete}
                        aria-label="Slett område"
                    >
                        <a>
                            <TrashIcon /> Slett
                        </a>
                    </button>
                    <button
                        type="button"
                        className="option"
                        onClick={toggleExpanded}
                        aria-expanded={isExpanded}
                    >
                        <ChevronDownIcon
                            className={isExpanded ? "expanded" : "not-expanded"}
                        />
                    </button>
                </div>
            </AreaRowContainer>
        </form>
    )
}

// ----------------------------------------------------------------------------------------------------

interface DropdownProps {
    allServices: Service[]
    servicesInArea: Service[]
    handlePutServiceToArea: (selectedServiceId: Service) => void
    toggleAreaExpanded: (area) => void
}

const DropdownRowSelect = ({
    allServices,
    servicesInArea,
    handlePutServiceToArea,
    toggleAreaExpanded,
}: DropdownProps) => {
    const availableServices = allServices.filter(
        (service) => !servicesInArea.map((s) => s.id).includes(service.id)
    )

    const [selectedService, updateSelectedService] = useState<Service | null>(
        () => (availableServices.length > 0 ? availableServices[0] : null)
    )

    useEffect(() => {
        if (availableServices.length > 0) {
            updateSelectedService(availableServices[0])
        } else {
            updateSelectedService(null)
        }
    }, [allServices, servicesInArea])

    const handleUpdateSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = availableServices.find(
            (service) => idOfSelectedService === service.id
        )
        updateSelectedService(newSelectedService)
    }

    const putHandler = () => {
        if (!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        handlePutServiceToArea(selectedService)
    }

    return (
        <TileDropdownColumn key="input">
            <Select
                value={selectedService !== null ? selectedService.id : ""}
                onChange={handleUpdateSelectedService}
                label="Velg tjenesteavhengighet"
                hideLabel
            >
                {availableServices.length > 0 ? (
                    availableServices.map((service) => {
                        return (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        )
                    })
                ) : (
                    <option key={undefined} value={""}>
                        Ingen tjeneste å legge til
                    </option>
                )}
            </Select>

            <div>
                <Button variant="secondary" type="button" onClick={putHandler}>
                    Legg til
                </Button>
            </div>

            <div className="clickable" onClick={toggleAreaExpanded}></div>
        </TileDropdownColumn>
    )
}

interface DropdownSubAreasProps {
    subAreas: SubArea[]
    subAreasInArea: SubArea[]
    handlePutSubAreaToArea: (selectedSubAreaId: SubArea) => void
    toggleAreaExpanded: (area) => void
}

const DropdownSubAreaSelect = ({
    subAreas,
    subAreasInArea,
    handlePutSubAreaToArea,
    toggleAreaExpanded,
}: DropdownSubAreasProps) => {
    const availableSubAreas = subAreas.filter(
        (subArea) => !subAreasInArea.map((sa) => sa.id).includes(subArea.id)
    )

    const [selectedSubArea, updatedSelectedSubArea] = useState<SubArea | null>(
        () => (availableSubAreas.length > 0 ? availableSubAreas[0] : null)
    )

    useEffect(() => {
        if (availableSubAreas.length > 0) {
            updatedSelectedSubArea(availableSubAreas[0])
        } else {
            updatedSelectedSubArea(null)
        }
    }, [subAreas, subAreasInArea])

    const handleUpdateSelectedSubArea = (event) => {
        const idOfSelectedSubArea: string = event.target.value
        const newSelectedSubArea: SubArea = availableSubAreas.find(
            (service) => idOfSelectedSubArea === service.id
        )
        updatedSelectedSubArea(newSelectedSubArea)
    }

    const putHandler = () => {
        if (!selectedSubArea) {
            toast.info("Ingen underområde valgt")
            return
        }
        handlePutSubAreaToArea(selectedSubArea)
    }

    return (
        <TileDropdownColumn key="input">
            <Select
                value={selectedSubArea !== null ? selectedSubArea.id : ""}
                onChange={handleUpdateSelectedSubArea}
                label="Velg underuområde"
                hideLabel
            >
                {availableSubAreas.length > 0 ? (
                    availableSubAreas.map((subArea) => {
                        return (
                            <option key={subArea.id} value={subArea.id}>
                                {subArea.name}
                            </option>
                        )
                    })
                ) : (
                    <option key={undefined} value={""}>
                        Ingen underområder å legge til
                    </option>
                )}
            </Select>

            <div>
                <Button variant="secondary" type="button" onClick={putHandler}>
                    Legg til
                </Button>
            </div>

            <div className="clickable" onClick={toggleAreaExpanded}></div>
        </TileDropdownColumn>
    )
}

export default TableOmraade
