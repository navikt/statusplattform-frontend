import styled from 'styled-components'
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

import { Bag, Calculator, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Saving, SocialAid } from '@navikt/ds-icons'
import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp  } from 'nav-frontend-knapper';

import { Area, Dashboard, Service, Tile } from 'types/navServices';

import { postAdminArea } from 'utils/postArea'
import AreaTableRow from './AreaTableRow';
import { fetchServices } from 'utils/fetchServices';
import CustomNavSpinner from 'components/CustomNavSpinner';
import { fetchAreas } from 'utils/fetchAreas';


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




const AreaTable = () => { 
    const [dashboardAreas, setDashboardAreas] = useState<Area[]>([])
    const [allServices, setAllServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [newAdminArea, updateNewAdminArea] = useState<Area>({
        id: "",
        name: "",
        description: "",
        icon: "0001",
        services: []
    })
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [anchorId, setAnchorId] = useState<string>("")
    

    const fetchData = async () => {
        setIsLoading(true)
        const areas: Area[] = await fetchAreas()
        setDashboardAreas(areas)
        const services: Service[] = await fetchServices()
        setAllServices(services)
        setIsLoading(false)
    };

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            const element = document.getElementById(anchorId);
            if (element) {
              element.scrollIntoView();
            }
          }, 300);
    }, [anchorId])

    if (isLoading) {
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
        newArea.icon = event.target.value
        updateNewAdminArea(newArea)
    }

    const handlePostAdminArea = (areaToAdd: Area, event) => {
        event.preventDefault()
        const newlist = dashboardAreas.filter(area =>area.id === areaToAdd.id)
        if(newlist.length > 0) {
            toast.error("Denne IDen er allerede i bruk")
            return
        }
        if(postAdminArea(areaToAdd).then(() => {
            setAnchorId(areaToAdd.id);
            toast.success("Området ble lagt til")
            fetchData()
            updateNewAdminArea({
                id: "",
                name: "",
                description: "",
                icon: "",
                services: []
            })
        }).catch(() => {
            toast.warn("Område ble ikke lagt til")
        })) {
            // const newTiles = [...adminTiles]
            // const newTile:Tile = {services:[], status:'', area:areaToAdd}
            // newTiles.push(newTile)
            // return
        }
    }

    const { id, name, description: description} = newAdminArea
    
    const toggleExpandedFor = (tileAreaId) => {
        if(expanded.includes(tileAreaId)) {
            toggleExpanded([...expanded.filter(i => i !== tileAreaId)])
        } else {
            toggleExpanded([...expanded, tileAreaId])
        }
    }

    return (
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th><span>Navn</span></th>
                    <th><span>Beskrivelse</span></th>
                    <th><span>Ikon</span></th>
                    <th><span>Slett</span></th>
                    <th></th>
                </tr>
            </thead>
                {dashboardAreas.map( (area, index) => {
                    return (
                        <AreaTableRow key={index} area={area}
                            allServices={allServices}
                            reload={fetchData} isExpanded={expanded.includes(area.id)}
                            toggleExpanded={() => toggleExpandedFor(area.id)}
                        />
                    )
                })}


            <tbody>
                <AddNewAreaTr key="input">
                    <td>
                        <form id="form" action="" onSubmit={(event) => handlePostAdminArea(newAdminArea, event)}></form>
                        <Input form="form" type="text" className={name.length == 0 ? "input-error" : ""} label="Navn*" required value={name} onChange={handleAreaDataChange("name")} placeholder="Navn*"/>
                    </td>
                    <td>
                        <Input form="form" type="text" label="Beskrivelse*" className={description.length == 0 ? "input-error" : ""} required value={description} onChange={handleAreaDataChange("description")} placeholder="Beskrivelse*"/>
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
                        <Hovedknapp form="form" htmlType="submit" disabled={!name || !description}>
                            Legg til
                        </Hovedknapp>
                    </td>
                </AddNewAreaTr>

            </tbody>
        </table>
    )
} 

export default AreaTable