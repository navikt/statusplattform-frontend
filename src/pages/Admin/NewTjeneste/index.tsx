import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"

import Layout from '../../../components/Layout';
import { Area, Service } from "../../../types/navServices";
import { fetchServices } from "../../..//utils/fetchServices";
import { fetchAreas } from "../../../utils/fetchAreas";
import { postService } from "../../..//utils/postService";
import { useLoader } from "../../../utils/useLoader";
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import { useEffect, useState } from "react";
import router from "next/router";
import { BodyShort, Button, Detail, Select } from "@navikt/ds-react";
import { Input } from "nav-frontend-skjema";
import { Delete } from "@navikt/ds-icons";


const NewServiceContainer = styled.div`
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

const NewService = () => {
    const [newService, updateNewService] = useState<Service>({
        name: "",
        team: "",
        type: "",
        dependencies: [],
        monitorlink: "",
        pollingUrl: ""
    })

    const { data, isLoading, reload } = useLoader(fetchServices,[]);

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    const { name, team, type, dependencies, monitorlink, pollingUrl } = newService





    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedNewArea = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
            updateNewService(updatedNewArea)
    }

    const handleAddServiceDependency = (serviceToAdd: Service) => {
        if(newService.dependencies.includes(serviceToAdd)) {
            toast.warn("Område " + serviceToAdd.name + " er allerede i område")
            return
        }
        const newServicesList = [...newService.dependencies, serviceToAdd]
        const updatedService: Service = {
            name: name, team: team, type: type, dependencies: newServicesList, monitorlink: monitorlink, pollingUrl: pollingUrl
        }
        updateNewService(updatedService)
        toast.success("Lagt område til område")
    }

    const handleDeleteServiceDependency = (serviceToDelete: Service) => {
        const newServicesList: Service[] = [...newService.dependencies.filter(service => service != serviceToDelete)]
        const updatedService: Service = {
            name: name, team: team, type: type, dependencies: newServicesList, monitorlink: monitorlink, pollingUrl: pollingUrl
        }
        updateNewService(updatedService)
        toast.success("Fjernet område fra område")
    }


    const handlePostNewService = (event) => {
        event.preventDefault()
        postService(newService).then(() => {
            toast.success("Område lastet opp")
            router.push("/Admin?tab=Område")
        }).catch(() => {
            toast.error("Klarte ikke å laste opp område")
        })
    }





    return (
        <Layout>
            <NewServiceContainer>
                <form onSubmit={event => handlePostNewService(event)}>

                    <Detail size="small" spacing>Felter markert med * er obligatoriske</Detail>

                    <Input type="text" required label="Navn på område" value={name} onChange={handleServiceDataChange("name")} placeholder="Navn*" />
                    <Input type="text" required label="Team*" value={team} onChange={handleServiceDataChange("team")} placeholder="Team" />
                    <Input type="text" required label="Type*" value={type} onChange={handleServiceDataChange("type")} placeholder="Type" />
                    <Input type="text" required label="Monitorlink*" value={monitorlink} onChange={handleServiceDataChange("monitorlink")} placeholder="Monitorlink" />
                    <Input type="text" required label="PollingUrl*" value={pollingUrl} onChange={handleServiceDataChange("pollingUrl")} placeholder="PollingUrl" />

                    <ServiceDependencies 
                        newService={newService}
                        allServices={data}
                        handleDeleteServiceDependency={(areaToDelete) => handleDeleteServiceDependency(areaToDelete)}
                        handleAddServiceDependency={(serviceToAdd) => handleAddServiceDependency(serviceToAdd)}
                    />
                    <div className="button-container">
                        <Button variant="secondary" type="button" value="Avbryt" onClick={() => router.push("/Admin?tab=Område")}>Avbryt</Button>
                        <Button type="submit" value="Legg til område">Lagre</Button>
                    </div>
                </form>
            </NewServiceContainer>
            <ToastContainer />
        </Layout>
    )
}





/*-----------_Helpers_-------------*/


interface ServiceProps {
    newService: Service
    allServices: Service[]
    handleDeleteServiceDependency: (areaToDelete) => void
    handleAddServiceDependency: (serviceToAdd) => void
}


const DependenciesContainer = styled.div`
    display: flex;
    flex-direction: column;

    gap: 16px;

    .current-services {
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
            width: 100%;
            margin: 8px 0;

            display: flex;
        }
    }
`



const ServiceDependencies = ({newService, allServices, handleDeleteServiceDependency: handleDeleteServiceDependency, handleAddServiceDependency: handleAddServiceDependency}: ServiceProps) => {
    const availableServices: Service[] = allServices.filter(area => !newService.dependencies.map(a => a.id).includes(area.id))

    const [selectedService, changeSelectedService] = useState<Service | null>(() => availableServices.length > 0 ? availableServices[0] : null)

    useEffect(() => {
        if(availableServices.length > 0){
            changeSelectedService(availableServices[0])
        }
        else {
            changeSelectedService(null)
        }
    }, [allServices, newService.dependencies])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedService: Service = availableServices.find(area => idOfSelectedArea === area.id)
        changeSelectedService(newSelectedService)
    }
    

    return (
        <DependenciesContainer>
            
            <Select label="Legg til område" value={selectedService !== null ? selectedService.id : ""} onChange={handleUpdateSelectedArea}>
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

            <Button variant="secondary" type="button" onClick={() => handleAddServiceDependency(selectedService)}>Legg til</Button>
            

            {newService.dependencies.length > 0
            ?
                <ul className="current-services">
                    {newService.dependencies.map(service => {
                        return (
                            <li key={service.id}>
                                <BodyShort>
                                    {service.name}
                                    <button className="colored" type="button" onClick={() => handleDeleteServiceDependency(service)}>
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

        </DependenciesContainer>
    )
}

export default NewService