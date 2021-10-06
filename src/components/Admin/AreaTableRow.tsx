import styled from 'styled-components'
import { useEffect, useRef, useState } from "react";
import Dropdown from 'react-dropdown';

import { Bag, BagFilled, Calculator, Collapse, Expand, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Saving, SocialAid } from '@navikt/ds-icons'
import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";
import { Close } from '@navikt/ds-icons'
import { Element } from 'nav-frontend-typografi';

import { postAdminAreas } from 'utils/postAreas'
import { deleteArea } from 'utils/deleteArea'
import { deleteServiceFromArea } from 'utils/deleteServiceFromArea'
import { Area, Dashboard, Service, Tile } from 'types/navServices';
import { getIconsFromGivenCode } from 'utils/servicesOperations';
import { putServiceToArea } from 'utils/putServiceToArea'

import { toast } from 'react-toastify';

const CustomTBody = styled.tbody `
    .clickable {
        :hover {
            cursor: pointer;
        }
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

export interface Props {
    tileIndexProp: any
    adminTiles: Tile[]
    setAdminTiles: Function
    tile: Tile
    // isLoading: boolean
    // setIsLoading: Function
    allServices: Service[]
    reFetchAdminTiles: Function
    selectedDashboard: Dashboard
}

// isLoading, setIsLoading,
const AreaTableRow = ({tileIndexProp, adminTiles: adminTiles, setAdminTiles, tile,
         allServices, reFetchAdminTiles, selectedDashboard}: Props) => { 
            const [expanded, toggleExpanded] = useState<boolean[]>(Array(adminTiles.length).fill(false))
            const [serviceIdsInTile, updateServiceIdsInTile] = useState<string[]>()
    
    useEffect(() => {
        updateServiceIdsInTile(tile.services.map(service => service.id))
    },[tile])

    const handleDeleteServiceOnArea = async (areaId, serviceId) => {
        let currentTiles = [...adminTiles]
        const tileIndex = adminTiles.findIndex(tile => tile.area.id === areaId)
        const serviceIndex = allServices.findIndex(service => service.id === serviceId)

        deleteServiceFromArea(areaId, serviceId).then((response: any) => {
            if (response.status >= 200 || response.status <= 210) {
                const oldTile = currentTiles.splice(tileIndex, 1)[0]
                const newTile = {...oldTile, services: oldTile.services.filter(service => service.id !== serviceId)}
                currentTiles.splice(tileIndex, 1, newTile)
                setAdminTiles([...currentTiles])
                toast.success("Tjenestekobling slettet")
            } else {
                toast.warn("Tjenestekobling kunne ikke bli slettet")
            }
        })
    }

    const toggleAreaExpanded = (index: number) => {
        const newArray = [...expanded]
        newArray[index] = !newArray[index]
        toggleExpanded(newArray)
    }

    const handleDeleteArea = async (areaToDelete: Area) => {
        deleteArea(areaToDelete, selectedDashboard).then((response: any) =>{
            if(response.status >= 200 || response.status <= 210) {
                const newTiles = adminTiles.filter(tile => 
                    tile.area.id != areaToDelete.id
                )
                setAdminTiles(newTiles)
                toast.info("Område slettet")
                return
            }
            else {
                toast.warn("Område ble ikke slettet grunnet feil")
            }
        })
    }

    const handlePutServiceToArea = async (tileId, serviceId) => {
        // setIsLoading(true)
        // Does service already exist in area
        const currentTiles = [...adminTiles]
        const tileIndex = adminTiles.findIndex(tile => tile.area.id === tileId)
        const serviceIndex = allServices.findIndex(service => service.id === serviceId)

        if(currentTiles[tileIndex].services.includes(allServices[serviceIndex])) {
            toast.warn("Denne tjenesten fins allerede i området")
        }
        // End of check

        else {
            putServiceToArea(tileId, serviceId).then((response: any) => {
                if (response.status >= 200 || response.status <= 210) {
                    const oldTile = currentTiles.splice(tileIndex, 1)[0]
                    const newTile = {...oldTile, services: [...oldTile.services, allServices[serviceIndex]]}
                    currentTiles.splice(tileIndex, 1, newTile)
                    setAdminTiles([...currentTiles])
                    toast.success("Tjenesten har blitt lagt til i området")
                } else {
                    toast.warn("Tjenesten kunne ikke bli lagt til")
                }
            })
        }
        // setIsLoading(false)
    }
    let area = tile.area
    
    return (
        <CustomTBody key={area.id}>
            <tr className="clickable" onClick={() => toggleAreaExpanded(tileIndexProp)}>
                <td><span>{area.id}</span></td>
                <td><span>{area.name}</span></td>
                <td><span>{area.beskrivelse}</span></td>
                <td><span>{area.rangering}</span></td>
                <td><span><IconContainer>{getIconsFromGivenCode(area.ikon)}</IconContainer></span></td>
                <td onClick={(event) => event.stopPropagation()}><span><CloseCustomized onClick={() => handleDeleteArea(area)} /></span></td>
                <td><span>{expanded[tileIndexProp] ? <Collapse /> : <Expand />}</span></td>
            </tr>


            {expanded[tileIndexProp] && 
                (tile.services.length === 0 ?
                <TileDropdownRow onClick={() => toggleAreaExpanded(tileIndexProp)}>
                    <td colSpan={7}>Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste</td>
                </TileDropdownRow>

                :
                
                <TileDropdownRow>
                    <td colSpan={2}>
                        <ServicesInAreaList onClick={(event) => event.stopPropagation()}>
                                <Element>Tjenester i område: {tile.area.name}</Element>
                                <Element>med id: {tile.area.id}</Element>
                                {serviceIdsInTile.map(id => {
                                    return (
                                        <li key={id}>{id} <CloseCustomized aria-label="Fjern tjenesten fra område"
                                            onClick={() =>
                                            handleDeleteServiceOnArea(tile.area.id, id)}/>
                                        </li>
                                    )
                                })}
                        </ServicesInAreaList>
                    </td>
                    <td colSpan={5} className="clickable" onClick={() => toggleAreaExpanded(tileIndexProp)}/>
                </TileDropdownRow>)
            }

            {expanded[tileIndexProp] && 
                <DropdownRowSelect 
                    allServices={allServices}
                    serviceIdsInTile={serviceIdsInTile} 
                    handlePutServiceToArea={(selectedServiceId) => handlePutServiceToArea(tile.area.id, selectedServiceId)}
                    toggleAreaExpanded={() => toggleAreaExpanded(tileIndexProp)} 
                />
            }
        </CustomTBody>
    )
} 






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
