import styled from 'styled-components'
import { useEffect, useState } from "react";
import Head from 'next/head'
import { toast } from 'react-toastify';

import { Bag, Calculator, Close, Collapse, Expand, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Notes, Saving, SocialAid } from '@navikt/ds-icons'
import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp, Knapp  } from 'nav-frontend-knapper';

import { Area, Service } from 'types/navServices';

import { postAdminArea } from 'utils/postArea'
import { fetchServices } from 'utils/fetchServices';
import CustomNavSpinner from 'components/CustomNavSpinner';
import { fetchAreas } from 'utils/fetchAreas';
import { getIconsFromGivenCode } from 'utils/servicesOperations';
import { Element } from 'nav-frontend-typografi';
import { putServiceToArea } from 'utils/putServiceToArea';
import { deleteServiceFromArea } from 'utils/deleteServiceFromArea';
import { deleteArea } from 'utils/deleteArea';
import { useLoader } from 'utils/useLoader';

const AreaContainer = styled.div`
    .table-div {
        overflow-x: auto;
        div {
            min-width: fit-content;
        }
    }
`

const AreaHeader = styled.div`
    width: 100%;
    padding: 1rem;
    font-weight: bold;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    display: flex;
    gap: 5ch;
    span {
        min-width: 200px;
    }
`

const AreaRowContainer = styled.div`
    padding: 1px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    :hover {
        padding: 0;
        cursor: pointer;
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
`

const AreaTable = () => { 
    // const [dashboardAreas, setDashboardAreas] = useState<Area[]>([])
    // const [allServices, setAllServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [anchorId, setAnchorId] = useState<string>("")
    const [editNewArea, toggleNewAreaEdit] = useState(false)
    const [areasToEdit, changeAreasToEdit] = useState<string[]>([])
    
    const { data: allAreas, isLoading: isLoadingAreas, reload: reloadAreas } = useLoader(fetchAreas,[]);
    const { data: allServices, isLoading: isLoadingServices, reload: reloadServices } = useLoader(fetchServices,[]);


    // const fetchData = async () => {
    //     setIsLoading(true)
    //     const areas: Area[] = await fetchAreas()
    //     setDashboardAreas(areas)
    //     const services: Service[] = await fetchServices()
    //     setAllServices(services)
    //     setIsLoading(false)
    // };
    const reloadAll = () => {
        reloadAll()
        reloadServices()
    }

    useEffect(() => {
        // fetchData()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            const element = document.getElementById(anchorId);
            if (element) {
              element.scrollIntoView();
            }
          }, 300);
    }, [anchorId])

    if (isLoadingAreas || isLoadingServices) {
        return (
            <CustomNavSpinner />
        )
    }

    const handleDeleteArea = (area, event) => {
        event.stopPropagation()
        deleteArea(area)
            .then(() => {
                reloadAreas()
                toast.info("Område slettet")
            })
            .catch(() => {
                toast.warn("Område ble ikke slettet grunnet feil")
            })
    }
    
    const toggleExpandedFor = (tileAreaId) => {
        if(expanded.includes(tileAreaId)) {
            toggleExpanded([...expanded.filter(i => i !== tileAreaId)])
        } else {
            toggleExpanded([...expanded, tileAreaId])
        }
    }

    const toggleEditArea = (area: Area) => {
        let edittingAreas: string[] = [...areasToEdit]
        if(edittingAreas.includes(area.id)) {
            changeAreasToEdit(edittingAreas.filter(d => d != area.id))
            return
        }
        edittingAreas.push(area.id)
        changeAreasToEdit(edittingAreas)
    }


    return (
        <AreaContainer>
            <Head>
                <title>Admin - Områder</title>
            </Head>
            <Knapp mini onClick={() => toggleNewAreaEdit(!editNewArea)}>{!editNewArea ? "Legg til nytt område" : "Avbryt nytt område"}</Knapp>
            {editNewArea &&
                <AddNewArea dashboardAreas={allAreas} reloadAll={reloadAll} setAnchorId={setAnchorId} />
            }
            <div className="table-div">
                <div>
                    <AreaHeader>
                        <span>Navn</span>
                        <span>Beskrivelse</span>
                        <span>Ikon</span>
                    </AreaHeader>
                    <div>
                        {allAreas.map( (area, index) => {
                            return (
                                <AreaRowContainer key={index}>
                                    {!areasToEdit.includes(area.id) ?
                                        <AreaTableRow area={area}
                                            allServices={allServices}
                                            reloadAll={reloadAll} isExpanded={expanded.includes(area.id)}
                                            toggleExpanded={() => toggleExpandedFor(area.id)}
                                            toggleEditArea={() => toggleEditArea(area)}
                                       />
                                    :
                                        <CurrentlyEdittingArea area={area}
                                            reloadAreas={reloadAreas}
                                            handleDeleteArea={(dashboard) => handleDeleteArea(dashboard)}
                                            toggleEditArea={() => toggleEditArea(area)}
                                        />}
                                </AreaRowContainer>
                            )
                        })}
                    </div>
                </div>
            </div>
        </AreaContainer>
    )
} 





const AddNewAreaContainer = styled.div`
    max-width: 600px;
    input, .knapp {
        margin: 1rem 0;
    }
    label {
        margin: 0;
    }
    select {
        min-width: 150px;
    }
    .input-error {
        input {
            border: 1px solid red;
        }
    }
`


interface NewAreaProps {
    dashboardAreas: Area[]
    reloadAll: () => void
    setAnchorId: Function
}


const AddNewArea = ({dashboardAreas, reloadAll, setAnchorId}: NewAreaProps) => {
    const [newAdminArea, updateNewAdminArea] = useState<Area>({
        id: "",
        name: "",
        description: "",
        icon: "0001",
        services: []
    })
    
    const options = [
        { value: "0001", label: "Bag", icon: <Bag/> },
        { value: "0002", label: "Sparepenger", icon: <Saving/> },
        { value: "0003", label: "Hjerte", icon: <Heart/> },
        { value: "0004", label: "Sosialstøtte", icon: <SocialAid/> },
        { value: "0005", label: "Bandasje", icon: <HandBandage/> },
        { value: "0006", label: "Skjemautfylt", icon: <FillForms/> },
        { value: "0007", label: "Førstehjelp", icon: <HealthCase/> },
        { value: "0008", label: "Guidehund", icon: <GuideDog/> },
        { value: "0009", label: "Penger", icon: <Money/> },
        { value: "0010", label: "Kalkulator", icon: <Calculator/> },
        { value: "0011", label: "Blomst", icon: <FlowerBladeFall/> },
        { value: "0012", label: "Mappe", icon: <Folder/> },
	];


    const handlePostAdminArea = (areaToAdd: Area, event) => {
        event.preventDefault()
        const newlist = dashboardAreas.filter(area =>area.id === areaToAdd.id)
        if(newlist.length > 0) {
            toast.error("Denne IDen er allerede i bruk")
            return
        }
        if(postAdminArea(areaToAdd).then(() => {
            setAnchorId(areaToAdd.id);
            toast.success("Området ble lagt til")
            reloadAll()
            updateNewAdminArea({
                id: "",
                name: "",
                description: "",
                icon: "",
                services: []
            })
        }).catch(() => {
            toast.warn("Område ble ikke lagt til")
        })) {
        }

    }

    const handleAreaDataChange = (field: keyof typeof newAdminArea) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newArea = {
            ...newAdminArea,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
            updateNewAdminArea(newArea)
    }
    const handleAreaIconChange = (event) => {
        const newArea = {
            ...newAdminArea,
        }
        newArea.icon = event.target.value
        updateNewAdminArea(newArea)
    }

    const { id, name, description: description} = newAdminArea


    return (
        <AddNewAreaContainer>
            <p>Felter markert med * er obligatoriske</p>

            <form id="form" action="" onSubmit={(event) => handlePostAdminArea(newAdminArea, event)}>

                <Input form="form" type="text" className={name.length == 0 ? "input-error" : ""}
                    label="Navn*" required value={name} onChange={handleAreaDataChange("name")} placeholder="Navn*"
                />

                <Input form="form" type="text" label="Beskrivelse*" className={description.length == 0 ? "input-error" : ""}
                    required value={description} onChange={handleAreaDataChange("description")} placeholder="Beskrivelse*"
                />

                <Select
                    label="Velg ikon til området*"
                    form="form"
                    onChange={handleAreaIconChange}
                    defaultValue={options[0].value}
                >
                    {options.map(option => {
                        return (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        )
                    })}
                </Select>

                <Hovedknapp htmlType="submit">
                    Legg til
                </Hovedknapp>

            </form>
        </AddNewAreaContainer>
    )
}










// const AreaRowContainer = styled.div`
//     padding: 1px 0;
//     border-top: 1px solid rgba(0, 0, 0, 0.55);
//     border-bottom: 1px solid rgba(0, 0, 0, 0.55);
//     :hover {
//         padding: 0;
//         cursor: pointer;
//         border-top: 2px solid rgba(0, 0, 0, 0.55);
//         border-bottom: 2px solid rgba(0, 0, 0, 0.55);
//     }
//     :last-child {
//         padding-bottom: 1px;
//         border-bottom: 2px solid rgba(0, 0, 0, 0.55);
//         :hover {
//             padding-bottom: 0;
//             border-bottom: 3px solid rgba(0, 0, 0, 0.55);
//         }
//     }
// `

const AreaRow = styled.div`
    min-height: 5rem;
    background-color: var(--navGraBakgrunn);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    button {
        background-color: transparent;
        border: none;
        height: 100%;
        padding: 0 1rem;
        :hover {
            cursor: pointer;
            color: grey;
        }
    }
    :first-child {
        padding-left: 1rem;
    }
`

const AreaRowColumn = styled.div`
    display: flex;
    align-items: center;
    &.clickable {
        flex-grow: 1;
    }
`
const AreaElements = styled.div`
    display: flex;
    align-items: center;
    gap: 5ch;
`
const RowElement = styled.span`
    padding-right: 0.5rem;
    min-width: 200px;
    flex-basis: 80%;
    white-space: normal;
    word-wrap: break-word;
`

const IconContainer = styled.section`
	color: var(--navBla);
    font-size: 2rem;
    display: flex;
    align-items: center;
`;

const TileDropdownColumn = styled.div`
    min-width: 300px;
    display: flex;
    flex-direction: column;
    cursor: default;
    select {
        cursor: pointer;
        margin: 1rem 0;
    }
`

const TileDropdownRow = styled.div`
    width: 100%;
    padding: 1rem 0;
    padding-left: 1rem;
    display: flex;
    flex-direction: row;
    .clickable {
        width: 100%;
    }
`

const ServicesInAreaList = styled.ul`
    padding: 0;
    li {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    toggleExpanded: () => void,
    toggleEditArea: (area) => void
}


const AreaTableRow = ({ area, reloadAll, isExpanded, toggleExpanded, allServices, toggleEditArea}: Props) => { 
    const [servicesInArea, setServicesInArea] = useState<Service[]>(() => area.services.map(service => service))

    const handleDeleteServiceOnArea = (serviceId) => {
        deleteServiceFromArea(area.id, serviceId)
            .then(() => {
                setServicesInArea([...servicesInArea.filter(service => service.id !== serviceId)])
                toast.info("Tjeneste slettet fra område")
            })
            .catch(() => {
                toast.warn("Tjeneste ble ikke slettet fra område grunnet feil")
            }) 
    }

    const handlePutServiceToArea = (service: Service) => {
        if(servicesInArea.map(s => s.id).includes(service.id)) {
            toast.warn("Denne tjenesten fins allerede i området")
            return
        }
        
        putServiceToArea(area.id, service.id)
            .then(() => {
                setServicesInArea([...servicesInArea, service]);
                toast.success("Tjenesten har blitt lagt til i området")
            })
            .catch(() => {
                toast.warn("Tjenesten kunne ikke bli lagt til")
            })
    }


    const { id: areaId, name, description: beskrivelse, icon: ikon } = area

    
    return (
        <div key={areaId}>
            <AreaRow id={areaId}>
                <AreaRowColumn className="clickable" onClick={toggleExpanded}>
                    <AreaElements>
                        <RowElement>{name}</RowElement>
                        <RowElement>{beskrivelse}</RowElement>
                        <RowElement><IconContainer>{getIconsFromGivenCode(ikon)}</IconContainer></RowElement>
                    </AreaElements>
                </AreaRowColumn>
                <AreaRowColumn>
                    <div>
                        <CustomButton onClick={toggleEditArea}>
                            <Notes />
                        </CustomButton>
                    </div>
                    <button onClick={handleDeleteArea} aria-label="Slett område"><Close/></button>
                    <button onClick={toggleExpanded} aria-expanded={isExpanded}>{isExpanded ? <Collapse /> : <Expand />}</button>
                </AreaRowColumn>
            </AreaRow>
            
            {isExpanded && 
                <TileDropdownRow>
                    <TileDropdownColumn>
                        {(servicesInArea.length === 0 ?
                            <TileDropdownColumn>
                                Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste
                            </TileDropdownColumn>
                        :
                            <ServicesInAreaList>
                                <Element>Tjenester i område</Element>
                                {servicesInArea.map(service => {
                                    return (
                                        <li key={service.id}>
                                            {service.name} 
                                            <button aria-label="Fjern tjenesten fra område" onClick={() => handleDeleteServiceOnArea(service.id)}>
                                                <Close />
                                            </button>
                                        </li>
                                    )
                                })}
                            </ServicesInAreaList>
                        )
                    }
                        <DropdownRowSelect 
                            allServices={allServices}
                            servicesInArea={servicesInArea} 
                            handlePutServiceToArea={handlePutServiceToArea}
                            toggleAreaExpanded={toggleExpanded} 
                        />
                    </TileDropdownColumn>
                    <div className="clickable" onClick={toggleExpanded}/>
                </TileDropdownRow>
            }
        </div>
    )
} 









// ----------------------------------------------------------------------------------------------------







interface DropdownProps {
    allServices: Service[]
    servicesInArea: Service[]
    handlePutServiceToArea: (selectedServiceId: Service) => void
    toggleAreaExpanded: () => void
}

const DropdownRowSelect = ({allServices, servicesInArea: servicesInArea, handlePutServiceToArea, toggleAreaExpanded}: DropdownProps) => {
    const availableServices = allServices.filter(service => !servicesInArea.map(s => s.id).includes(service.id))
    
    const [selectedService, updateSelectedService] = useState<Service|null>(() => availableServices.length > 0 ? availableServices[0] : null)

    useEffect(() => {
        if(availableServices.length > 0){
            updateSelectedService(availableServices[0])
        }
        else {
            updateSelectedService(null)
        }
    }, [allServices, servicesInArea])

    const handleUpdateSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = availableServices.find(service => idOfSelectedService === service.id)
        updateSelectedService(newSelectedService)
    }

    return (
        <TileDropdownColumn key="input">
            <Select value={selectedService !== null ? selectedService.id : ""} onChange={handleUpdateSelectedService}>
                {availableServices.length > 0 ?
                availableServices.map(service => {
                    return (
                        <option key={service.id} value={service.id}>{service.name}</option>
                    )
                })
                :
                    <option key={undefined} value={""}>Ingen tjeneste å legge til</option>
                }
            </Select>

            <Hovedknapp disabled={!selectedService} onClick={() => handlePutServiceToArea(selectedService)} >Legg til</Hovedknapp>                                            
            <div className="clickable" onClick={toggleAreaExpanded}></div>
        </TileDropdownColumn>
    )
}












interface EditProps {
    area: Area
    reloadAreas: () => void
    setAreaToDelete: (area) => void
    toggleEditArea: (area) => void
    handleDeleteArea: (area) => void
}

const CurrentlyEdittingArea = ({area, reloadAreas, setAreaToDelete, toggleEditArea, handleDeleteArea}: EditProps) => {
    const [updatedArea, changeUpdatedArea] = useState({
        name: area.name
    })

    const handleUpdatedArea = (event) => {
        const changedDashboard = {
            name: event.target.value,
        }
        changeUpdatedArea(changedDashboard)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        toast.info("Mangler endepunkt")
        // Uncomment det nedenfor når endepunkt er implementert
        // reloadDashboards()
    }

    const { name, id, description, icon } = area

    return (
        <form onSubmit={handleSubmit}>

            <AreaRow id={id} className="clickable">
                <AreaRowColumn>
                    <AreaElements>
                        <RowElement>{name}</RowElement>
                        <RowElement>{description}</RowElement>
                        <RowElement><IconContainer>{getIconsFromGivenCode(icon)}</IconContainer></RowElement>
                    </AreaElements>
                </AreaRowColumn>
                <AreaRowColumn>
                    <button type="button" onClick={() => toggleEditArea(area)} aria-label="Fjern dashbord">
                        Avbryt endringer
                    </button>
                    <button onClick={handleDeleteArea} aria-label="Slett område"><Close/></button>
                </AreaRowColumn>
            </AreaRow>
        </form>
    )
}

export default AreaTable