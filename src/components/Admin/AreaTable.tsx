import styled from 'styled-components'
import { useRef, useState } from "react";
import Dropdown from 'react-dropdown';
import { toast } from 'react-toastify';

import { Bag, Calculator, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Saving, SocialAid } from '@navikt/ds-icons'
import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';
import NavFrontendSpinner from "nav-frontend-spinner";

import { Area, Dashboard, Service, Tile } from 'types/navServices';

import { postAdminAreas } from 'utils/postAreas'
import AreaTableRow from './AreaTableRow';
import { useLoader } from 'utils/useLoader';
import { fetchDashboards } from 'utils/fetchDashboards';
import { fetchTiles } from 'utils/fetchTiles';
import { fetchServices } from 'utils/fetchServices';
import CustomNavSpinner from 'components/CustomNavSpinner';


const AddNewAreaTr = styled.tr`
    td {
        vertical-align: bottom;
        select {
            min-width: 150px;
        }
    }
    .input-error {
        input {
            border: 1px solid red;
        }
    }
`


export interface Props {
    adminTiles: Tile[]
    setAdminTiles: Function
    allServices: Service[]
    reFetchAdminTiles: Function
    selectedDashboard: Dashboard
}

const AreaTable = ({adminTiles: adminTiles, setAdminTiles, allServices, reFetchAdminTiles, selectedDashboard}: Props) => { 
    const [newAdminArea, updateNewAdminArea] = useState<Area>({
        id: "",
        name: "",
        beskrivelse: "",
        rangering: 0,
        ikon: ""
    })

    const { data: dashboards, isLoading: loadingDashboards, reload: reloadDashboards } = useLoader(fetchDashboards,[]);
    const { data: tiles, isLoading: loadingTiles, reload: reloadTiles } = useLoader(() => fetchTiles(selectedDashboard),[]);
    const { data: services, isLoading: loadingServices, reload: reloadServices } = useLoader(fetchServices,[]);


    if (loadingDashboards || loadingTiles || loadingServices) {
        return (
            <CustomNavSpinner />
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


    const handlePostAdminArea = (areaToAdd: Area, event) => {
        event.preventDefault()
        const newlist = adminTiles.filter(tile => tile.area.id === areaToAdd.id)
        if(newlist.length > 0) {
            toast.error("Denne IDen er allerede i bruk")
            return
        }
        if(postAdminAreas(areaToAdd, selectedDashboard)) {
            const newTiles = [...adminTiles]
            const newTile:Tile = {services:[], status:'', area:areaToAdd}
            newTiles.push(newTile)
            setAdminTiles(newTiles)
            toast.success("Området ble lagt til")
            reloadTiles()
            updateNewAdminArea({
                id: "",
                name: "",
                beskrivelse: "",
                rangering: 0,
                ikon: ""
            })
            return
        }
        toast.warn("Område ble ikke lagt til")
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
            {/* isLoading={isLoading} setIsLoading={setIsLoading} */}
                {adminTiles.map( (tile, index) => {
                    return (
                        <AreaTableRow key={index} tileIndexProp={index} adminTiles={adminTiles} setAdminTiles={setAdminTiles} tile={tile}
                            allServices={allServices} reFetchAdminTiles={reFetchAdminTiles} selectedDashboard={selectedDashboard}
                        />
                    )
                })}


            <tbody>
                <AddNewAreaTr key="input">
                    <td>
                        <form id="form" action="" onSubmit={(event) => handlePostAdminArea(newAdminArea, event)}></form>
                        <Input form="form" className={id.length == 0 ? "input-error" : ""} type="text" label="ID*" required value={id} onChange={handleAreaDataChange("id")} placeholder="ID*"/>
                    </td>
                    <td>
                        <Input form="form" type="text" className={name.length == 0 ? "input-error" : ""} label="Navn*" required value={name} onChange={handleAreaDataChange("name")} placeholder="Navn*"/>
                    </td>
                    <td>
                        <Input form="form" type="text" label="Beskrivelse*" className={beskrivelse.length == 0 ? "input-error" : ""} required value={beskrivelse} onChange={handleAreaDataChange("beskrivelse")} placeholder="Beskrivelse*"/>
                    </td>
                    <td>
                        <Input form="form" type="number" label="Rangering*" required className={(rangering == 0 || rangering == undefined) ? "input-error" : ""} value={rangering} onChange={handleAreaDataChange("rangering")} placeholder="0*" />
                    </td>
                    <td>
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
                    </td>
                    <td colSpan={2}>
                        <Hovedknapp form="form" htmlType="submit" disabled={!id || !name || !beskrivelse || !rangering}>
                            Legg til
                        </Hovedknapp>
                    </td>
                </AddNewAreaTr>

            </tbody>
        </table>
    )
} 

export default AreaTable