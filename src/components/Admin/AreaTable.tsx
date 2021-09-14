import styled from 'styled-components'
import { useState } from "react";
import Dropdown from 'react-dropdown';

import { Bag } from '@navikt/ds-icons'
import { Input } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";
import { Close } from '@navikt/ds-icons'

import { postAdminAreas } from 'utils/postAreas'
import { deleteArea } from 'utils/deleteArea'
import { Area } from 'types/navServices';
import { getIconsFromGivenCode } from 'utils/servicesOperations';


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

const getBag = () => {
    return <IconContainer><Bag /></IconContainer>
}

export interface Props {
    adminAreas: Area[]
    setAdminAreas: Function
    isLoading: boolean
}

const AreaTable = ({adminAreas, setAdminAreas, isLoading}: Props) => { 
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
        const newlist = adminAreas.filter(area => area.id === areaToAdd.id)
        if(newlist.length > 0) {
            alert("Denne IDen er allerede brukt. Velg en annen")
            return
        }
        if(postAdminAreas(areaToAdd)) {
            const newAreas = [...adminAreas]
            newAreas.push(areaToAdd)
            setAdminAreas(newAreas)
            return
        }
        //TODO bedre error-visning trengs
        alert("Område ble ikke lagt til")
    }

    const handleDeleteArea = (areaToDelete) => {
        if(deleteArea(areaToDelete)) {
            const newAreas = adminAreas.filter(currentArea => 
                currentArea != areaToDelete
            )
            setAdminAreas(newAreas)
            return
        }
        //TODO bedre error-visning trengs
        alert("Område ble ikke slettet")
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
                </tr>
            </thead>
            <tbody>
                {adminAreas.map( area => {
                    return (
                        <tr key={area.id}>
                            <td><span>{area.id}</span></td>
                            <td><span>{area.name}</span></td>
                            <td><span>{area.beskrivelse}</span></td>
                            <td><span>{area.rangering}</span></td>
                            <td><span><IconContainer>{getIconsFromGivenCode(area.ikon)}</IconContainer></span></td>
                            <td><span><CloseCustomized onClick={() => handleDeleteArea(area)} /></span></td>
                        </tr>
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