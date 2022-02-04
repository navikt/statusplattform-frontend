import styled from "styled-components"
import router from "next/router";
import { useContext, useEffect, useState } from "react";

import { Delete } from "@navikt/ds-icons";
import { BodyShort, Button, Detail, Select } from "@navikt/ds-react";
import { Input } from "nav-frontend-skjema";
import { toast, ToastContainer } from "react-toastify"

import { options } from "../../..//components/Admin/AreaTable";
import { Area, Service } from "../../../types/navServices";
import { useLoader } from "../../../utils/useLoader";
import Layout from '../../../components/Layout';
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import { HorizontalSeparator } from "..";
import { TitleContext } from "../../../components/ContextProviders/TitleContext";
import { fetchServices } from "../../../utils/servicesAPI";
import { postAdminArea } from "../../../utils/areasAPI";
import { RouterAdminOmråder } from "../../../types/routes";



const NewAreaContainer = styled.div`
    display: flex;
    flex-direction: column;

    input, select {
        margin: 1rem 0;
    }

    .button-container {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
`


const NewArea = () => {

    const [newArea, updateNewArea] = useState<Area>({
        name: "",
        description: "",
        icon: "0001",
        services: [],
        components: []
    })

    const { data, isLoading, reload } = useLoader(fetchServices,[]);

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    const { name, description, icon, services, components } = newArea

    const handleAreaDataChange = (field: keyof typeof newArea) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedNewArea = {
            ...newArea,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
            updateNewArea(updatedNewArea)
    }

    const handleAddServiceToArea = (serviceToAdd: Service) => {
        if(newArea.services.includes(serviceToAdd)) {
            toast.warn("Område " + serviceToAdd.name + " er allerede i område")
            return
        }
        const updatedList = [...newArea.services, serviceToAdd]
        const updatedArea: Area = {
            name: name, services: updatedList, components: components, description: description, icon: icon
        }
        updateNewArea(updatedArea)
        toast.success("Lagt område til område")
    }

    const handleDeleteServiceOnArea = (serviceToDelete: Service) => {
        const newServicesList: Service[] = [...newArea.services.filter(service => service != serviceToDelete)]
        const updatedArea: Area = {
            name: name, description: description, components: components, icon: icon, services: newServicesList
        }
        updateNewArea(updatedArea)
        toast.success("Fjernet område fra område")
    }


    const handlePostNewArea = (event) => {
        event.preventDefault()
        postAdminArea(newArea).then(() => {
            toast.success("Område lastet opp")
            router.push(RouterAdminOmråder.PATH)
        }).catch(() => {
            toast.error("Klarte ikke å laste opp område")
        })
    }


    const handleAreaIconChange = (event) => {
        const updatedNewArea = {
            ...newArea,
        }
        updatedNewArea.icon = event.target.value
        updateNewArea(updatedNewArea)
    }


    return (
        <Layout>

            <NewAreaContainer>

                <form onSubmit={event => handlePostNewArea(event)}>

                    <Detail size="small" spacing>Felter markert med * er obligatoriske</Detail>
                    
                    <Input type="text" required label="Navn på område" value={name} onChange={handleAreaDataChange("name")} placeholder="Navn*" />
                    <Input type="text" required label="Beskrivelse" value={description} onChange={handleAreaDataChange("description")} placeholder="Beskrivelse" />
                    <Select
                        size="small"
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

                    <AreaServices 
                        newArea={newArea}
                        allServices={data}
                        handleDeleteServiceOnArea={(areaToDelete) => handleDeleteServiceOnArea(areaToDelete)}
                        handleAddServiceToArea={(serviceToAdd) => handleAddServiceToArea(serviceToAdd)}
                    />

                    <HorizontalSeparator />


                    <div className="button-container">
                        <Button variant="secondary" type="button" value="Avbryt" onClick={() => router.push(RouterAdminOmråder.PATH)}>Avbryt</Button>
                        <Button type="submit" value="Legg til">Lagre</Button>
                    </div>
                </form>

                <ToastContainer />
            </NewAreaContainer>
        </Layout>
    )
}





/*-----------_Helpers_-------------*/


interface AreaProps {
    newArea: Area
    allServices: Service[]
    handleDeleteServiceOnArea: (areaToDelete) => void
    handleAddServiceToArea: (serviceToAdd) => void
}


const ServicesContainer = styled.div`
    display: flex;
    flex-direction: column;

    gap: 16px;

    .new-list {
        list-style: none;
        padding: 0;
        
        section {
            display: inline-block;
        }

        .colored {
            color: var(--navBla);
            text-decoration: underline;
            background-color: none;
            border: none;

            label {
                position: absolute;
                z-index: -1000;
            }

            :hover {
                text-decoration: none;
                cursor: pointer;
            }
        }

        li {
            p {
                margin: 8px 0;

                display: flex;
                justify-content: space-between;
            }
        }
    }
`



const AreaServices = ({newArea, allServices, handleDeleteServiceOnArea: handleDeleteServiceOnArea, handleAddServiceToArea: handleAddServiceToArea}: AreaProps) => {
    const availableServices: Service[] = allServices.filter(area => !newArea.services.map(a => a.id).includes(area.id))
    const { changeTitle } = useContext(TitleContext)
    const [selectedService, changeSelectedService] = useState<Service | null>(() => availableServices.length > 0 ? availableServices[0] : null)
    
    useEffect(() => {
        changeTitle("Opprett nytt område")
        if(availableServices.length > 0){
            changeSelectedService(availableServices[0])
        }
        else {
            changeSelectedService(null)
        }
    }, [allServices, newArea.services])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedService: Service = availableServices.find(area => idOfSelectedArea === area.id)
        changeSelectedService(newSelectedService)
    }
    

    return (
        <ServicesContainer>
            
            <Select label="Legg til i område" value={selectedService !== null ? selectedService.id : ""} onChange={handleUpdateSelectedArea}>
                {availableServices.length > 0 ?
                    availableServices.map(area => {
                        return (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        )
                    })
                :
                    <option key={undefined} value="">Ingen områder å legge til</option>
                }
            </Select>

            <Button variant="secondary" type="button" onClick={() => handleAddServiceToArea(selectedService)}>Legg til</Button>
            

            {newArea.services.length > 0
            ?
                <ul className="new-list">
                    {newArea.services.map(service => {
                        return (
                            <li key={service.id}>
                                <BodyShort>
                                    {service.name}
                                    <button className="colored" type="button" onClick={() => handleDeleteServiceOnArea(service)}>
                                        <label>{service.name}</label>
                                        <Delete/> Slett
                                    </button>
                                </BodyShort>
                            </li>
                        )
                    })}
                </ul>
            :
                <BodyShort spacing><b>Ingen områder lagt til</b></BodyShort>
            }

        </ServicesContainer>
    )
}

export default NewArea