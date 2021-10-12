import styled from 'styled-components'
import { useEffect, useState } from "react";

import { Collapse, Expand } from '@navikt/ds-icons'
import { Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import { Close } from '@navikt/ds-icons'
import { Element } from 'nav-frontend-typografi';

import { deleteArea } from 'utils/deleteArea'
import { deleteServiceFromArea } from 'utils/deleteServiceFromArea'
import { Dashboard, Service, Tile } from 'types/navServices';
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
    tile: Tile
    selectedDashboard: Dashboard
    allServices: Service[]
    reload: () => void
    isExpanded: boolean
    toggleExpanded: () => void
}


const AreaTableRow = ({ selectedDashboard, tile, reload, isExpanded, toggleExpanded, allServices}: Props) => { 
    const [serviceIdsInTile, setServiceIdsInTile] = useState<string[]>(() => tile.services.map(service => service.id))
    
    const handleDeleteArea = (event) => {
        event.stopPropagation()
        deleteArea(tile.area, selectedDashboard)
            .then(() => {
                reload()
                toast.info("Område slettet")
            })
            .catch(() => {
                toast.warn("Område ble ikke slettet grunnet feil")
            })
    }

    const handleDeleteServiceOnArea = (serviceId) => {
        deleteServiceFromArea(tile.area.id, serviceId)
            .then(() => {
                setServiceIdsInTile([...serviceIdsInTile.filter(id => id !== serviceId)])
                toast.info("Tjeneste slettet fra område")
            })
            .catch(() => {
                toast.warn("Tjeneste ble ikke slettet fra område grunnet feil")
            }) 
    }

    const handlePutServiceToArea = (serviceId) => {
        if(serviceIdsInTile.includes(serviceId)) {
            toast.warn("Denne tjenesten fins allerede i området")
            return
        }
        
        putServiceToArea(tile.area.id, serviceId)
            .then(() => {
                setServiceIdsInTile([...serviceIdsInTile, serviceId]);
                toast.success("Tjenesten har blitt lagt til i området")
            })
            .catch(() => {
                toast.warn("Tjenesten kunne ikke bli lagt til")
            })
    }


    const { id: areaId, name, beskrivelse, rangering, ikon } = tile.area
    
    return (
        <CustomTBody key={areaId}>
            <tr className="clickable" onClick={toggleExpanded}>
                <td><span>{areaId}</span></td>
                <td><span>{name}</span></td>
                <td><span>{beskrivelse}</span></td>
                <td><span>{rangering}</span></td>
                <td><span><IconContainer>{getIconsFromGivenCode(ikon)}</IconContainer></span></td>
                <td><span><CloseCustomized onClick={handleDeleteArea} /></span></td>
                <td><span>{isExpanded ? <Collapse /> : <Expand />}</span></td>
            </tr>


            {isExpanded && 
                (serviceIdsInTile.length === 0 ?
                <TileDropdownRow onClick={toggleExpanded}>
                    <td colSpan={7}>Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste</td>
                </TileDropdownRow>

                :
                
                <TileDropdownRow>
                    <td colSpan={2}>
                        <ServicesInAreaList>
                            <Element>Tjenester i område: {name}</Element>
                            <Element>med id: {areaId}</Element>
                            {serviceIdsInTile.map(id => {
                                return (
                                    <li key={id}>{id} <CloseCustomized aria-label="Fjern tjenesten fra område"
                                        onClick={() => handleDeleteServiceOnArea(id)}/>
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
                    serviceIdsInTile={serviceIdsInTile} 
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
    serviceIdsInTile: string[]
    handlePutServiceToArea: (selectedServiceId: string) => void
    toggleAreaExpanded: () => void
}

const DropdownRowSelect = ({allServices, serviceIdsInTile, handlePutServiceToArea, toggleAreaExpanded}: DropdownProps) => {
    const [selectedService, updateSelectedService] = useState<string>(serviceIdsInTile[0])

    const availableServices = allServices.filter(service => !serviceIdsInTile.includes(service.id))

    useEffect(() => {
        if(availableServices.length > 0){
            updateSelectedService(availableServices[0].id)
        }
        else {
            updateSelectedService(null)
        }
    }, [allServices, serviceIdsInTile])

    return (
        <TileDropdownRow key="input">
            <td colSpan={2}>
                <Select value={selectedService !== null ? selectedService : ""} onChange={(event) => updateSelectedService(event.target.value)}>
                    {availableServices.length > 0 ?
                    availableServices.map(service => {
                        return (
                            <option key={service.id} value={service.id}>{service.id}</option>
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
