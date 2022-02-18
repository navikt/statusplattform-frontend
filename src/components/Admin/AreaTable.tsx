import styled from 'styled-components'
import { useContext, useEffect, useState } from "react";
import Head from 'next/head'
import { toast } from 'react-toastify';

import { Bag, Calculator, Expand, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Notes, Saving, SocialAid } from '@navikt/ds-icons'

import { Area, Service } from '../../types/navServices';
import { Element } from 'nav-frontend-typografi';
import ModalWrapper from 'nav-frontend-modal';

import { CloseCustomized } from '.';
import CustomNavSpinner from '../../components/CustomNavSpinner';

import { ModalInner } from '.';
import { getIconsFromGivenCode } from '../../utils/servicesOperations';
import { useLoader } from '../../utils/useLoader';
import { Button, Select, TextField } from '@navikt/ds-react';
import router from 'next/router';
import { TitleContext } from '../ContextProviders/TitleContext';
import { deleteArea, deleteServiceFromArea, fetchAreas, postAdminArea, putServiceToArea, updateArea } from '../../utils/areasAPI';
import { fetchServices } from '../../utils/servicesAPI';
import { RouterAdminAddOmråde } from '../../types/routes';






const AreaContainer = styled.div`
    .areas-overflow-container {
        overflow-x: auto;
        div {
            min-width: fit-content;
        }
    }

    .centered {
        display: flex;
        justify-content: center;

        margin: 60px 0;
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

    const { changeTitle } = useContext(TitleContext)

    useEffect(() => {
        changeTitle("Admin - Områder")
    })


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

    const confirmDeleteAreaHandler = () => {
        deleteArea(areaToDelete).then(() => {
            toast.info("Området ble slettet")
            setAreaToDelete(null);
            reloadAreas()
        }).catch(() => {
            toast.error("Kunne ikke slette området")
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
                contentLabel="Slettemodal"
            >
                <ModalInner>Ønsker du å slette området?
                    <Button variant="secondary" onClick={confirmDeleteAreaHandler}>Slett området</Button>
                    <Button variant="secondary" onClick={() => setAreaToDelete(null)}>Avbryt</Button>
                </ModalInner>
            </ModalWrapper>


            <div className="centered">
                <Button variant="secondary" 
                        onClick={() => router.push(RouterAdminAddOmråde.PATH)}>
                    <b>Legg til nytt område</b>
                </Button>
            </div>


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






/* ------------------------------------------- COMMON DATA BELOW --------------------------------------------------------- */




export const options = [
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
            max-width: 275px;

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
    toggleExpanded: () => void,
    toggleEditArea: (area) => void,
    setAreaToDelete: (area) => void
}


const AreaTableRow = ({ area, reloadAll, isExpanded, toggleExpanded, allServices, toggleEditArea, setAreaToDelete}: Props) => { 
    const [servicesInArea, setServicesInArea] = useState<Service[]>(() => area.services.map(service => service))


    const handleToggleEditArea = () => {
        if(!isExpanded) {
            toggleExpanded()
        }
        toggleEditArea(area)
    }

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
                                    Ingen tjenester er knyttet til området.
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
                <CustomButton className="option" onClick={() => handleToggleEditArea()}>
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
        id: area.id,
        name: area.name,
        description: area.description,
        icon: area.icon,
        services: area.services,
        components: area.components
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
        updateArea(updatedArea).then(() => {
            reloadAreas()
            if(isExpanded) {
                toggleExpanded(area)
            }
            toggleEditArea(area)
            toast.success("Oppdatering gjennomført")
        }).catch(() => {
            toast.error("Noe gikk galt i oppdatering av område")
        })
    }

    const handleDisableEditArea = (area) => {
        if(isExpanded) {
            toggleExpanded(area)
        }
        toggleEditArea(area)
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
                        <TextField label="Navn" hideLabel className="row-element editting" value={name} onChange={handleUpdatedArea("name")} onClick={(event) => event.stopPropagation()} />
                        <TextField label="Beskrivelse" hideLabel className="row-element editting" value={description} onChange={handleUpdatedArea("description")} onClick={(event) => event.stopPropagation()} />
                        <Select
                            label="Velg ikon"
                            hideLabel
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
                    <button type="button" className="option" onClick={handleSubmit}>
                        Lagre endringer
                    </button>
                    <button type="button" className="option" onClick={() => handleDisableEditArea(area)} aria-label="Fjern dashbord">
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


    const putHandler = () => {
        if(!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        handlePutServiceToArea(selectedService)
    }



    return (
        <TileDropdownColumn key="input">
            <Select
                value={selectedService !== null ? selectedService.id : ""} onChange={handleUpdateSelectedService}
                label="Velg tjenesteavhengighet"
                hideLabel
            >
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

            <div>
                <Button variant="secondary" type="button" onClick={putHandler} >Legg til</Button>
            </div>

            <div className="clickable" onClick={toggleAreaExpanded}></div>
        </TileDropdownColumn>
    )
}




export default AreaTable