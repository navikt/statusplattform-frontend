import styled from 'styled-components'
import { useEffect, useState } from "react";

import { Collapse, Expand } from '@navikt/ds-icons'
import { Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import { Close } from '@navikt/ds-icons'
import { Element } from 'nav-frontend-typografi';

import { deleteArea } from 'utils/deleteArea'
import { deleteServiceFromArea } from 'utils/deleteServiceFromArea'
import { Area, Service } from 'types/navServices';
import { getIconsFromGivenCode } from 'utils/servicesOperations';
import { putServiceToArea } from 'utils/putServiceToArea'

import { toast } from 'react-toastify';

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
`
const AreaElements = styled.div`
    display: flex;
    align-items: center;
`
const RowElement = styled.span`
    padding-right: 0.5rem;
    width: 200px;
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


interface Props {
    area: Area
    allServices: Service[]
    reload: () => void
    isExpanded: boolean
    toggleExpanded: () => void
}


const AreaTableRow = ({ area, reload, isExpanded, toggleExpanded, allServices}: Props) => { 
    const [servicesInArea, setServicesInArea] = useState<Service[]>(() => area.services.map(service => service))
    
    const handleDeleteArea = (event) => {
        event.stopPropagation()
        deleteArea(area)
            .then(() => {
                reload()
                toast.info("Område slettet")
            })
            .catch(() => {
                toast.warn("Område ble ikke slettet grunnet feil")
            })
    }

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
        <AreaRowContainer key={areaId}>
            <AreaRow id={areaId} className="clickable" onClick={toggleExpanded}>
                <AreaRowColumn>
                    <AreaElements>
                        <RowElement>{name}</RowElement>
                        <RowElement>{beskrivelse}</RowElement>
                        <RowElement><IconContainer>{getIconsFromGivenCode(ikon)}</IconContainer></RowElement>
                    </AreaElements>
                </AreaRowColumn>
                <AreaRowColumn>
                    <button onClick={handleDeleteArea} ><Close/></button>
                    <button>{isExpanded ? <Collapse /> : <Expand />}</button>
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
                                            <button>
                                                <Close aria-label="Fjern tjenesten fra område"
                                                    onClick={() => handleDeleteServiceOnArea(service.id)}
                                                />
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
        </AreaRowContainer>
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


export default AreaTableRow
