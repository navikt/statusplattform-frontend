import styled from 'styled-components'
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

import { Bag, Calculator, FillForms, FlowerBladeFall, Folder, GuideDog, HandBandage, HealthCase, Heart, Money, Saving, SocialAid } from '@navikt/ds-icons'
import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp, Knapp  } from 'nav-frontend-knapper';

import { Area, Service } from 'types/navServices';

import { postAdminArea } from 'utils/postArea'
import AreaTableRow from './AreaTableRow';
import { fetchServices } from 'utils/fetchServices';
import CustomNavSpinner from 'components/CustomNavSpinner';
import { fetchAreas } from 'utils/fetchAreas';

const AreaHeader = styled.div`
    width: 100%;
    padding: 1rem;
    font-weight: bold;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    display: flex;
    span {
        min-width: 100px;
    }
`

const AreaTable = () => { 
    const [dashboardAreas, setDashboardAreas] = useState<Area[]>([])
    const [allServices, setAllServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [anchorId, setAnchorId] = useState<string>("")
    const [editNewArea, toggleNewAreaEdit] = useState(false)
    

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
    
    const toggleExpandedFor = (tileAreaId) => {
        if(expanded.includes(tileAreaId)) {
            toggleExpanded([...expanded.filter(i => i !== tileAreaId)])
        } else {
            toggleExpanded([...expanded, tileAreaId])
        }
    }

    return (
        <div>
            <Knapp mini onClick={() => toggleNewAreaEdit(!editNewArea)}>{!editNewArea ? "Legg til nytt område" : "Avbryt nytt område"}</Knapp>
            {editNewArea &&
                <AddNewArea dashboardAreas={dashboardAreas} fetchData={fetchData} setAnchorId={setAnchorId} />
            }

            <AreaHeader>
                <span>Navn</span>
                <span>Beskrivelse</span>
                <span>Ikon</span>
            </AreaHeader>
            <div>
                {dashboardAreas.map( (area, index) => {
                    return (
                        <AreaTableRow key={index} area={area}
                        allServices={allServices}
                        reload={fetchData} isExpanded={expanded.includes(area.id)}
                        toggleExpanded={() => toggleExpandedFor(area.id)}
                        />
                    )
                })}
            </div>
        </div>
    )
} 





const AddNewAreaContainer = styled.div`
    max-width: 600px;
    input, .knapp {
        margin: 1rem 0;
    }
    label {
        margin: 0;
    }
    select {
        min-width: 150px;
    }
    .input-error {
        input {
            border: 1px solid red;
        }
    }
`


interface NewAreaProps {
    dashboardAreas: Area[]
    fetchData: () => void
    setAnchorId: Function
}


const AddNewArea = ({dashboardAreas, fetchData, setAnchorId}: NewAreaProps) => {
    const [newAdminArea, updateNewAdminArea] = useState<Area>({
        id: "",
        name: "",
        description: "",
        icon: "0001",
        services: []
    })
    
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
        }

    }

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

    const { id, name, description: description} = newAdminArea


    return (
        <AddNewAreaContainer>
            <p>Felter markert med * er obligatoriske</p>

            <form id="form" action="" onSubmit={(event) => handlePostAdminArea(newAdminArea, event)}>

                <Input form="form" type="text" className={name.length == 0 ? "input-error" : ""}
                    label="Navn*" required value={name} onChange={handleAreaDataChange("name")} placeholder="Navn*"
                />

                <Input form="form" type="text" label="Beskrivelse*" className={description.length == 0 ? "input-error" : ""}
                    required value={description} onChange={handleAreaDataChange("description")} placeholder="Beskrivelse*"
                />

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

                <Hovedknapp htmlType="submit">
                    Legg til
                </Hovedknapp>

            </form>
        </AddNewAreaContainer>
    )
}

export default AreaTable