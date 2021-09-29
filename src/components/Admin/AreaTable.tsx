import styled from 'styled-components'
import { useRef, useState } from "react";
import Dropdown from 'react-dropdown';

import { Bag, Calculator, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Saving, SocialAid } from '@navikt/ds-icons'
import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";

import { postAdminAreas } from 'utils/postAreas'
import { Area, Dashboard, Service, Tile } from 'types/navServices';

import { toast } from 'react-toastify';
import AreaTableRow from './AreaTableRow';


const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
`

const AddNewAreaTr = styled.tr`
    td {
        vertical-align: bottom;
        select {
            min-width: 150px;
        }
    }
`


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
                    return (
                        <AreaTableRow key={index} tileIndexProp={index} adminTiles={adminTiles} setAdminTiles={setAdminTiles} tile={tile}
                            isLoading={isLoading} setIsLoading={setIsLoading} allServices={allServices} reFetchAdminTiles={reFetchAdminTiles}
                            selectedDashboard={selectedDashboard}
                        />
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