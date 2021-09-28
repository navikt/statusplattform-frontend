import styled from 'styled-components'
import { useRef, useState } from "react";
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

const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
`

const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

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

const AddNewAreaTr = styled.tr`
    td {
        vertical-align: bottom;
        select {
            min-width: 150px;
        }
    }
`

const getBag = () => {
    return <IconContainer><Bag /></IconContainer>
}

export interface Props {
    adminTiles: Tile[]
    setAdminTiles: Function
    isLoading: boolean
    setIsLoading: Function
    allServices: Service[]
    reFetchAdminTiles: Function
    selectedDashboard: Dashboard
}

const AreaTable = ({adminTiles: adminTiles, setAdminTiles, isLoading, setIsLoading, allServices, reFetchAdminTiles, selectedDashboard}: Props) => { 
    const [expanded, toggleExpanded] = useState<boolean[]>(Array(adminTiles.length).fill(false))
    const [selectedService, changeCurrentSelectedService] = useState(allServices[0].id)
    const [newAdminArea, updateNewAdminArea] = useState<Area>({
        id: "",
        name: "",
        beskrivelse: "",
        rangering: 0,
        ikon: ""
    })
    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }


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
        newArea.ikon = event.target.value
        updateNewAdminArea(newArea)
    }


    const handlePostAdminArea = (areaToAdd: Area) => {
        setIsLoading(true)
        const newlist = adminTiles.filter(tile => tile.area.id === areaToAdd.id)
        if(newlist.length > 0) {
            toast.error("Denne IDen er allerede i bruk")
            setIsLoading(false)
            return
        }
        if(postAdminAreas(areaToAdd, selectedDashboard)) {
            const newTiles = [...adminTiles]
            const newTile:Tile = {services:[], status:'', area:areaToAdd}
            newTiles.push(newTile)
            setAdminTiles(newTiles)
            reFetchAdminTiles()
            toast.success("Området ble lagt til")
            setIsLoading(false)
            return
        }
        toast.warn("Område ble ikke lagt til")
        setIsLoading(false)
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
        setIsLoading(true)
        const currentTiles = [...adminTiles]
        const tileIndex = adminTiles.findIndex(tile => tile.area.id === tileId)
        const serviceIndex = allServices.findIndex(service => service.id === serviceId)

        if(currentTiles[tileIndex].services.includes(allServices[serviceIndex])) {
            toast.warn("Denne tjenesten fins allerede i området")
        }

        else {
            putServiceToArea(tileId, serviceId).then((response: any) => {
                if (response.status >= 200 || response.status <= 210) {
                    currentTiles[tileIndex].services.push(allServices[serviceIndex])
                    setAdminTiles(currentTiles)
                    toast.success("Tjenesten har blitt lagt til i området")
                } else {
                    toast.warn("Tjenesten kunne ikke bli lagt til")
                }
            })
        }
        setIsLoading(false)
    }


    const handleDeleteServiceOnArea = async (areaId, serviceId) => {
        let currentTiles = [...adminTiles]
        const tileIndex = adminTiles.findIndex(tile => tile.area.id === areaId)
        const serviceIndex = allServices.findIndex(service => service.id === serviceId)
        // console.log(currentTiles[tileIndex].services.filter(service => !service.id === serviceId))
        deleteServiceFromArea(areaId, serviceId).then((response: any) => {
            // currentTiles[tileIndex].services.filter(service => !service.id === serviceId)
            if (response.status >= 200 || response.status <= 210) {
                currentTiles[tileIndex].services.splice(serviceIndex, 1)
                setAdminTiles(currentTiles)
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

    const changeSelectedService = (e) => {
        changeCurrentSelectedService(e.target.value)
    }

    const { id, name, beskrivelse, rangering} = newAdminArea

    return (
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th><span>ID</span></th>
                    <th><span>Navn</span></th>
                    <th><span>Beskrivelse</span></th>
                    <th aria-sort="descending" role="columnheader"><span>Rangering</span></th>
                    <th><span>Ikon</span></th>
                    <th><span>Slett</span></th>
                    <th></th>
                </tr>
            </thead>
                {adminTiles.map( (tile, index) => {
                    let area = tile.area
                    const servicesIds = tile.services.map(service => service.id)

                    return (

                        <CustomTBody key={area.id}>
                            <tr className="clickable" onClick={() => toggleAreaExpanded(index)}>
                                <td><span>{area.id}</span></td>
                                <td><span>{area.name}</span></td>
                                <td><span>{area.beskrivelse}</span></td>
                                <td><span>{area.rangering}</span></td>
                                <td><span><IconContainer>{getIconsFromGivenCode(area.ikon)}</IconContainer></span></td>
                                <td onClick={(event) => event.stopPropagation()}><span><CloseCustomized onClick={() => handleDeleteArea(area)} /></span></td>
                                <td><span>{expanded[index] ? <Collapse /> : <Expand />}</span></td>
                            </tr>


                            {expanded[index] && 
                                (tile.services.length === 0 ?
                                <TileDropdownRow onClick={() => toggleAreaExpanded(index)}>
                                    <td colSpan={7}>Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste</td>
                                </TileDropdownRow>

                                :
                                
                                <TileDropdownRow>
                                    <td colSpan={2}>
                                        <ServicesInAreaList>
                                                <Element>Tjenester i område: {tile.area.name}</Element>
                                                <Element>med id: {tile.area.id}</Element>
                                                {tile.services.map(service => {
                                                    return (
                                                        <li key={service.id}>{service.id} <CloseCustomized aria-label="Fjern tjenesten fra område"
                                                            onClick={() =>
                                                            handleDeleteServiceOnArea(tile.area.id, service.id)}/>
                                                        </li>
                                                    )
                                                })}
                                        </ServicesInAreaList>
                                    </td>
                                    <td colSpan={5} className="clickable" onClick={() => toggleAreaExpanded(index)}/>
                                </TileDropdownRow>)
                            }



                            {expanded[index] && 
                                <TileDropdownRow key="input">
                                    <td colSpan={2}>
                                        <Select value={selectedService} onChange={changeSelectedService}>
                                            {allServices.filter(service => !servicesIds.includes(service.id)).map(service => {
                                                return (
                                                    <option key={service.id} value={service.id}>{service.id}</option>
                                                )
                                            })}
                                        </Select>
                                    </td>

                                    <td colSpan={2}>
                                        <Hovedknapp disabled={!selectedService} onClick={() => handlePutServiceToArea(tile.area.id, selectedService)} >Legg til</Hovedknapp>                                            
                                    </td>
                                    <td colSpan={6} className="clickable" onClick={() => toggleAreaExpanded(index)}></td>
                                </TileDropdownRow>
                            }


                        </CustomTBody>
                    )
                })}
            <tbody>
                <AddNewAreaTr key="input">
                    <td>
                        <Input type="text" required value={id} onChange={handleAreaDataChange("id")} placeholder="ID*"/>
                    </td>
                    <td>
                        <Input type="text" required value={name} onChange={handleAreaDataChange("name")} placeholder="Navn*"/>
                    </td>
                    <td>
                        <Input type="text" required value={beskrivelse} onChange={handleAreaDataChange("beskrivelse")} placeholder="Beskrivelse*"/>
                    </td>
                    <td>
                        <Input type="number" required value={rangering} onChange={handleAreaDataChange("rangering")} placeholder="0*" />
                    </td>
                    <td>
                        <Select
                            label="Velg ikon til området*"
                            onChange={handleAreaIconChange}
                            defaultValue={options[0].value}
                        >
                            {options.map(option => {
                                return (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                )
                            })}
                        </Select>
                    </td>
                    <td colSpan={2}>
                        <Hovedknapp disabled={!id || !name || !beskrivelse || !rangering} onClick={() => handlePostAdminArea(newAdminArea)}>
                            Legg til
                        </Hovedknapp>
                    </td>
                </AddNewAreaTr>

            </tbody>
        </table>
    )
} 

export default AreaTable