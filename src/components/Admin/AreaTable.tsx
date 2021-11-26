import styled from 'styled-components'
import { useEffect, useState } from "react";
import Head from 'next/head'
import { toast } from 'react-toastify';

import { Bag, Calculator, Collapse, Expand, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Notes, Saving, SocialAid } from '@navikt/ds-icons'
import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp, Knapp  } from 'nav-frontend-knapper';

import { Area, Service } from 'types/navServices';
import { Element } from 'nav-frontend-typografi';
import ModalWrapper from 'nav-frontend-modal';

import { CloseCustomized } from '.';
import CustomNavSpinner from 'components/CustomNavSpinner';

import { ModalInner } from '.';
import { postAdminArea } from 'utils/postArea'
import { fetchServices } from 'utils/fetchServices';
import { fetchAreas } from 'utils/fetchAreas';
import { getIconsFromGivenCode } from 'utils/servicesOperations';
import { putServiceToArea } from 'utils/putServiceToArea';
import { deleteServiceFromArea } from 'utils/deleteServiceFromArea';
import { deleteArea } from 'utils/deleteArea';
import { useLoader } from 'utils/useLoader';






const AreaContainer = styled.div`
    .areas-overflow-container {
        overflow-x: auto;
        div {
            min-width: fit-content;
        }
    }
`

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
    &.editting {
        border-color: var(--navBla);
    }
`




const AreaTable = () => { 
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [anchorId, setAnchorId] = useState<string>("")
    const [editNewArea, toggleNewAreaEdit] = useState(false)
    const [areasToEdit, changeAreasToEdit] = useState<string[]>([])
    const [areaToDelete, setAreaToDelete] = useState<Area>()
    
    const { data: allAreas, isLoading: isLoadingAreas, reload: reloadAreas } = useLoader(fetchAreas,[]);
    const { data: allServices, isLoading: isLoadingServices, reload: reloadServices } = useLoader(fetchServices,[]);



    const reloadAll = () => {
        reloadAreas()
        reloadServices()
    }


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

    const handleDeleteArea = (area) => {
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

    const confirmDeleteServiceHandler = () => {
        deleteArea(areaToDelete).then(() => {
            toast.info("Dashbordet ble slettet")
            setAreaToDelete(null);
            reloadAreas()
        }).catch(() => {
            toast.error("Kunne ikke slette dashbord")
        })
    }


    return (
        <AreaContainer>
            <Head>
                <title>Admin - Områder</title>
            </Head>

            <ModalWrapper
                isOpen={!!areaToDelete}
                onRequestClose={() => setAreaToDelete(null)}
                closeButton={true}
                contentLabel="Min modalrute"
            >
                <ModalInner>Ønsker du å slette området?
                    <Knapp mini onClick={confirmDeleteServiceHandler}>Slett området</Knapp>
                    <Knapp mini onClick={() => setAreaToDelete(null)}>Avbryt</Knapp>
                </ModalInner>
            </ModalWrapper>



            <Knapp mini onClick={() => toggleNewAreaEdit(!editNewArea)}>{!editNewArea ? "Legg til nytt område" : "Avbryt nytt område"}</Knapp>
            {editNewArea &&
                <AddNewArea dashboardAreas={allAreas} reloadAll={reloadAll} setAnchorId={setAnchorId} />
            }
            <div className="areas-overflow-container">
                <div>
                    <AreaHeader>
                        <div className="area-header-content">
                            <span>Navn</span>
                            <span>Beskrivelse</span>
                            <span>Ikon</span>
                        </div>
                        <div className="empty-space"></div>
                    </AreaHeader>
                    <div>
                        {allAreas.map( (area, index) => {
                            return (
                                <AreaElementContainer className={areasToEdit.includes(area.id) ? "editting" : ""} key={index}>
                                    {!areasToEdit.includes(area.id) ?
                                        <AreaTableRow
                                            area={area}
                                            allServices={allServices}
                                            reloadAll={reloadAll} 
                                            isExpanded={expanded.includes(area.id)}
                                            toggleExpanded={() => toggleExpandedFor(area.id)}
                                            toggleEditArea={() => toggleEditArea(area)}
                                            setAreaToDelete={() => setAreaToDelete(area)}
                                       />
                                    :
                                        <CurrentlyEdittingArea
                                            area={area}
                                            allServices={allServices}
                                            reloadAreas={reloadAreas}
                                            isExpanded={expanded.includes(area.id)}
                                            toggleExpanded={() => toggleExpandedFor(area.id)}
                                            toggleEditArea={() => toggleEditArea(area)}
                                            setAreaToDelete={() => setAreaToDelete(area)}
                                        />}
                                </AreaElementContainer>
                            )
                        })}
                    </div>
                </div>
            </div>
        </AreaContainer>
    )
} 





/* -------------------------------- -------------------------------- */




const AddNewAreaContainer = styled.div`
    max-width: 400px;
    input, .knapp {
        margin-bottom: 1rem;
    }
    .knapp:last-child {
        margin-bottom: 0;
        margin-top: 1rem;
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


    const handlePostAdminArea = (areaToAdd: Area, event) => {
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

    const { name, description: description} = newAdminArea


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

                <Hovedknapp htmlType="button" onClick={(event) => handlePostAdminArea(newAdminArea, event)}>
                    Legg til
                </Hovedknapp>

            </form>
        </AddNewAreaContainer>
    )
}





/* ------------------------------------------- COMMON DATA BELOW --------------------------------------------------------- */




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






/* -------------------------------------------  --------------------------------------------------------- */




const AreaRowContainer = styled.div`
    min-height: 5rem;
    background-color: var(--navGraBakgrunn);

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

        & > * {
            display: flex;
            flex-basis: 100%;
        }
        .bottom-row-column {
            display: flex;
            flex-direction: column;
            max-width: fit-content;

            p {
                max-width: fit-content;
            }
        }
        .row-element {
            margin-right: 5ch;
            display: flex;
            flex-direction: column;
        }
        span:first-child {
            margin: 0 2rem;
        }
        .clickable {
            width: 100%;
        }
    }

    &.clickable {
        flex-grow: 1;
    }
`
const AreaElements = styled.div`
    display: flex;
    align-items: center;
`

const IconContainer = styled.section`
	color: var(--navBla);
    font-size: 2rem;
    display: flex;
    align-items: center;
`;

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
    toggleExpanded: () => void,
    toggleEditArea: (area) => void,
    setAreaToDelete: (area) => void
}


const AreaTableRow = ({ area, reloadAll, isExpanded, toggleExpanded, allServices, toggleEditArea, setAreaToDelete}: Props) => { 
    const [servicesInArea, setServicesInArea] = useState<Service[]>(() => area.services.map(service => service))

    const { id: areaId, name, description: beskrivelse, icon: ikon } = area

    return (
        <AreaRowContainer id={areaId}>
            <AreaRowInner className="clickable" onClick={toggleExpanded}>
                <div className="top-row">
                    <span className="row-element">{name}</span>
                    <span className="row-element">{beskrivelse}</span>
                    <span className="row-element"><IconContainer>{getIconsFromGivenCode(ikon)}</IconContainer></span>
                </div>
        
                {isExpanded && 
                    <div className="bottom-row">
                        <div className="bottom-row-column">
                            {servicesInArea.length === 0 ?
                                <div className="row-element">
                                    Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste
                                </div>
                            :
                                <div className="row-element">
                                    <Element>Tjenester i område</Element>
                                    <ul>
                                        {servicesInArea.map(service => {
                                            return (
                                                <li key={service.id}>
                                                    {service.name} 
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>

                                
                        }
                        </div>
                    </div>
                }
            </AreaRowInner>
            <div className="button-container">
                <CustomButton className="option" onClick={toggleEditArea}>
                    <Notes />
                </CustomButton>
                <button className="option" onClick={setAreaToDelete} aria-label="Slett område"><CloseCustomized /></button>
                <button className="option" onClick={toggleExpanded} aria-expanded={isExpanded}>
                    <Expand className={isExpanded ? "expanded" : "not-expanded"} />
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


const DependencyList = styled.ul`
    list-style: none;
    padding: 0;

    li {
        height: fit-content;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`




interface EditProps {
    area: Area
    allServices: Service[]
    isExpanded: boolean
    reloadAreas: () => void
    toggleExpanded: (area) => void
    toggleEditArea: (area) => void
    setAreaToDelete: (area) => void
}





const CurrentlyEdittingArea = ({area, allServices, reloadAreas, isExpanded, toggleExpanded, toggleEditArea, setAreaToDelete}: EditProps) => {
    const [updatedArea, changeUpdatedArea] = useState({
        name: area.name,
        description: area.description,
        icon: area.icon
    })
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

    const handleUpdatedArea = (field: keyof typeof updatedArea) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const changedDashboard = {
            ...updatedArea,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
        changeUpdatedArea(changedDashboard)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        toast.info("Mangler endepunkt")
        // Uncomment det nedenfor når endepunkt er implementert
        // reloadDashboards()
    }

    const handleAreaIconChange = (event) => {
        const newArea = {
            ...updatedArea,
        }
        newArea.icon = event.target.value
        changeUpdatedArea(newArea)
    }


    const { name, description, icon } = updatedArea

    return (
        <form onSubmit={handleSubmit}>

            <AreaRowContainer id={area.id} className="clickable editting">
                <AreaRowInner>

                    <AreaElements className="top-row" onClick={toggleExpanded}>
                        <Input className="row-element editting" value={name} onChange={handleUpdatedArea("name")} onClick={(event) => event.stopPropagation()} />
                        <Input className="row-element editting" value={description} onChange={handleUpdatedArea("description")} onClick={(event) => event.stopPropagation()} />
                        <Select
                            className="row-element editting"
                            onChange={handleAreaIconChange}
                            defaultValue={options[0].value}
                            onClick={(event) => event.stopPropagation()}
                        >
                            {options.map(option => {
                                return (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                )
                            })}
                        </Select>
                    </AreaElements>
                    

                
                    {isExpanded &&
                        <div className="bottom-row">
                            <div className="bottom-row-column">
                                {servicesInArea.length === 0 &&
                                    <p>
                                        Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste å legge til.
                                    </p>
                                }

                                <DropdownRowSelect 
                                    allServices={allServices}
                                    servicesInArea={servicesInArea} 
                                    handlePutServiceToArea={handlePutServiceToArea}
                                    toggleAreaExpanded={toggleExpanded} 
                                />

                                {servicesInArea.length > 0 &&
                                    <ServicesInAreaList>
                                        <EditDependeciesContainer>
                                            <Element>Tjenester i område:</Element>
                                            <DependencyList>
                                                {servicesInArea.map(service => {
                                                    return (
                                                        <li key={service.id}>
                                                            {service.name} 
                                                            <button type="button"
                                                                    aria-label="Fjern tjenesten fra område"
                                                                    onClick={() => handleDeleteServiceOnArea(service.id)}>
                                                                <CloseCustomized />
                                                            </button>
                                                        </li>
                                                    )
                                                })}
                                            </DependencyList>
                                        </EditDependeciesContainer>
                                    </ServicesInAreaList>
                                }
                            </div>
                            
                            <div className="clickable" onClick={toggleExpanded}/>
                        </div>
                    }

                </AreaRowInner>

                <div className="button-container">
                    <button type="button" className="option" onClick={() => toggleEditArea(area)} aria-label="Fjern dashbord">
                        Avbryt endringer
                    </button>
                    <button type="button" className="option" onClick={setAreaToDelete} aria-label="Slett område"><CloseCustomized /></button>
                    <button type="button" className="option" onClick={toggleExpanded} aria-expanded={isExpanded}>
                        <Expand className={isExpanded ? "expanded" : "not-expanded"} />
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

const DropdownRowSelect = ({allServices, servicesInArea: servicesInArea, handlePutServiceToArea, toggleAreaExpanded}: DropdownProps) => {
    const availableServices = allServices.filter(service => !servicesInArea.map(s => s.id).includes(service.id))
    
    const [selectedService, updateSelectedService] = useState<Service | null>(() => availableServices.length > 0 ? availableServices[0] : null)

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

            <Hovedknapp htmlType="button" disabled={!selectedService} onClick={() => handlePutServiceToArea(selectedService)} >Legg til</Hovedknapp>
            <div className="clickable" onClick={toggleAreaExpanded}></div>
        </TileDropdownColumn>
    )
}




export default AreaTable