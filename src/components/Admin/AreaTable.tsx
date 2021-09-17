import styled from 'styled-components'
import { useEffect, useState } from "react";
import Dropdown from 'react-dropdown';

import { Bag, Collapse, Expand } from '@navikt/ds-icons'
import { Input } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";
import { Close } from '@navikt/ds-icons'

import { postAdminAreas } from 'utils/postAreas'
import { deleteArea } from 'utils/deleteArea'
import { Area, Service, Tile } from 'types/navServices';
import { getIconsFromGivenCode } from 'utils/servicesOperations';
import { putServiceToArea } from 'utils/putServiceToArea'


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

const CenteredExpandRetractSpan = styled.span`
    margin-top: 20px;
    display: flex;
    justify-content: center;
`

const NoServicesInAreaNotifier = styled.td`
    /* width: 100%;
    display: flex;
    justify-content: center;
    align-items: center; */
`

const getBag = () => {
    return <IconContainer><Bag /></IconContainer>
}

export interface Props {
    adminTiles: Tile[]
    setAdminTiles: Function
    isLoading: boolean
    allServices: Service[]
}

const AreaTable = ({adminTiles: adminTiles, setAdminTiles, isLoading, allServices}: Props) => { 
    const [expanded, toggleExpanded] = useState<boolean[]>(Array(adminTiles.length).fill(false))
    const [selectedService, changeCurrentSelectedService] = useState()
    const [newAdminArea, updateNewAdminArea] = useState<Area>({
        id: "",
        name: "",
        beskrivelse: "",
        rangering: 0,
        ikon: ""
    })

    useEffect(() => {
        (async function () {
            // const test = Array.from(Array(adminTiles.length).fill(0))
            // toggleExpanded(Array(adminTiles.length).fill(false))
        })()
    }, [])


    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }


	const options = [
		// <Bag />, <Folder />, <BagFilled />
        'Bag', 'Folder', 'Pengebag'
	];
	
	const defaultOption = 'Ikon...'

    const handleAreaDataChange = (field: keyof typeof newAdminArea) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newArea = {
            ...newAdminArea,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
        updateNewAdminArea(newArea)
    }


    const handlePostAdminArea = (areaToAdd: Area) => {
        const newlist = adminTiles.filter(tile => tile.area.id === areaToAdd.id)
        if(newlist.length > 0) {
            alert("Denne IDen er allerede brukt. Velg en annen")
            return
        }
        if(postAdminAreas(areaToAdd)) {
            const newAreas = [...adminTiles]
            const  newTile:Tile = {services:[], status:'', area:areaToAdd}
            newAreas.push(newTile)
            setAdminTiles(newAreas)
            return
        }
        //TODO bedre error-visning trengs
        alert("Område ble ikke lagt til")
    }

    const handleDeleteArea = (areaToDelete) => {
        if(deleteArea(areaToDelete)) {
            const newTiles = adminTiles.filter(tile => 
                tile.area.id != areaToDelete.id
            )
            setAdminTiles(newTiles)
            return
        }
        //TODO bedre error-visning trengs
        alert("Område ble ikke slettet")
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
            <tbody>
                {adminTiles.map( (tile, index) => {
                    let area = tile.area
                    return (
                        <>
                            <tr key={area.id} onClick={() => toggleAreaExpanded(index)}>
                                <td><span>{area.id}</span></td>
                                <td><span>{area.name}</span></td>
                                <td><span>{area.beskrivelse}</span></td>
                                <td><span>{area.rangering}</span></td>
                                <td><span><IconContainer>{getIconsFromGivenCode(area.ikon)}</IconContainer></span></td>
                                <td><span><CloseCustomized onClick={() => handleDeleteArea(area)} /></span></td>
                                <td><span><CenteredExpandRetractSpan>{expanded[index] ? <Collapse /> : <Expand />}</CenteredExpandRetractSpan></span></td>
                            </tr>
                            {expanded[index] && 
                                tile.services.length === 0 ?
                                <NoServicesInAreaNotifier>
                                    Ingen tjenester er knyttet til området. Nedenfor kan du velge en ny tjeneste
                                </NoServicesInAreaNotifier>
                                :
                                (
                                    tile.services.map((service, x) => {
                                        // console.log(service.name)
                                        // <tr key={x}>{service.name}</tr>
                                    })
                                )
                            }
                            {expanded[index] && 
                                <tr key="input">
                                    <td>
                                        {/* <Input type="text" value={""} placeholder="Logglink" /> */}
                                        <select value={selectedService} onChange={changeSelectedService}>
                                            {allServices.map(service => {
                                                return (
                                                    <option value={service.id}>{service.name}</option>
                                                )
                                            })}
                                        </select>
                                    </td>

                                    <td>
                                        <Hovedknapp disabled={!selectedService} onClick={() => putServiceToArea(tile.area.id, selectedService)} >Legg til</Hovedknapp>                                            
                                    </td>
                                </tr>
                            }
                        </>
                    )
                })}

                <tr key="input">
                    <td>
                        <Input type="text" value={id} onChange={handleAreaDataChange("id")} placeholder="ID"/>
                    </td>
                    <td>
                        <Input type="text" value={name} onChange={handleAreaDataChange("name")} placeholder="Navn"/>
                    </td>
                    <td>
                        <Input type="text" value={beskrivelse} onChange={handleAreaDataChange("beskrivelse")} placeholder="Beskrivelse"/>
                    </td>
                    <td>
                        <Input type="number" value={rangering} onChange={handleAreaDataChange("rangering")} />
                    </td>
                    <td>
                        <Dropdown
                            options={options}
                            onChange={getBag}
                            value={defaultOption}
                            placeholder="Select an option"
                        />
                    </td>
                    {/* <td>
                        <SelectCustomized>
                            <option value="brukergruppe">Privatperson</option>
                            <option value="brukergruppe">Arbeidsgiver</option>
                            <option value="brukergruppe">Samarbeidspartner</option>
                        </SelectCustomized>
                    </td> */}
                    <td><Hovedknapp disabled={!id || !name || !beskrivelse || !rangering} onClick={() => handlePostAdminArea(newAdminArea)}>Legg til</Hovedknapp></td>
                </tr>

            </tbody>
        </table>
    )
} 

export default AreaTable