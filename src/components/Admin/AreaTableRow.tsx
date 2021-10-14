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

const CustomTBody = styled.tbody `
    .clickable {
        :hover {
            cursor: pointer;
        }
    }
    :hover {
        box-shadow: 0 0 3px black;
    }
`

const IconContainer = styled.section`
	color: var(--navBla);
    font-size: 2rem;
`;

const TileDropdownRow = styled.tr`
    td {
        border: 0px transparent !important;
        background-color: white !important;
    }
    select {
        transform: translateY(-2px);
        min-width: 100px;
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
    cursor: default;
`

const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
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
        <CustomTBody key={areaId}>
            <tr id={areaId} className="clickable" onClick={toggleExpanded}>
                <td><span>{name}</span></td>
                <td><span>{beskrivelse}</span></td>
                <td><span><IconContainer>{getIconsFromGivenCode(ikon)}</IconContainer></span></td>
                <td><span><CloseCustomized onClick={handleDeleteArea} /></span></td>
                <td><span>{isExpanded ? <Collapse /> : <Expand />}</span></td>
            </tr>


            {isExpanded && 
                (servicesInArea.length === 0 ?
                <TileDropdownRow onClick={toggleExpanded}>
                    <td colSpan={7}>Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste</td>
                </TileDropdownRow>

                :
                
                <TileDropdownRow>
                    <td colSpan={2}>
                        <ServicesInAreaList>
                            <Element>Tjenester i område</Element>
                            {/* {area.services.map(service => {
                                return (
                                    <li key={service.id}>{service.name} <CloseCustomized aria-label="Fjern tjenesten fra område"
                                        onClick={() => handleDeleteServiceOnArea(service.id, )}/>
                                    </li>
                                )
                            })} */}
                            {servicesInArea.map(service => {
                                return (
                                    <li key={service.id}>
                                        {service.name} 
                                        <CloseCustomized aria-label="Fjern tjenesten fra område"
                                            onClick={() => handleDeleteServiceOnArea(service.id)}
                                        />
                                    </li>
                                )
                            })}
                        </ServicesInAreaList>
                    </td>
                    <td colSpan={5} className="clickable" onClick={toggleExpanded}/>
                </TileDropdownRow>)
            }

            {isExpanded && 
                <DropdownRowSelect 
                    allServices={allServices}
                    servicesInArea={servicesInArea} 
                    handlePutServiceToArea={handlePutServiceToArea}
                    toggleAreaExpanded={toggleExpanded} 
                />
            }
        </CustomTBody>
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
    const availableServices = allServices.filter(service => !servicesInArea.map((s)=>s.id).includes(service.id))
    
    const [selectedService, updateSelectedService] = useState<Service>(availableServices[0])

    useEffect(() => {
        if(availableServices.length > 0){
            updateSelectedService(availableServices[0])
        }
        else {
            updateSelectedService(null)
        }
    }, [allServices, servicesInArea])

    const handleUpdateSelectedService = (event) => {
        console.log(event.target.value)
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = availableServices.find(service => idOfSelectedService === service.id)
        updateSelectedService(newSelectedService)
    }

    return (
        <TileDropdownRow key="input">
            <td colSpan={2}>
                <Select value={selectedService.id !== null ? selectedService.id : ""} onChange={handleUpdateSelectedService}>
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
            </td>

            <td colSpan={2}>
                <Hovedknapp disabled={!selectedService} onClick={() => handlePutServiceToArea(selectedService)} >Legg til</Hovedknapp>                                            
            </td>
            <td colSpan={6} className="clickable" onClick={toggleAreaExpanded}></td>
        </TileDropdownRow>
    )
}


export default AreaTableRow
