import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react";
import router from "next/router";

import Layout from '../../../components/Layout';
import { Area, Service } from "../../../types/navServices";
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import { fetchTypes } from "../../..//utils/fetchTypes";

import { BodyShort, Button, Detail, Select } from "@navikt/ds-react";
import { Input } from "nav-frontend-skjema";
import { Delete } from "@navikt/ds-icons";
import { HorizontalSeparator } from "..";
import { TitleContext } from "../../../components/ContextProviders/TitleContext";
import { fetchServices, postService } from "../../../utils/servicesAPI";
import { fetchAreas } from "../../../utils/areasAPI";
import { RouterAdminTjenester } from "../../../types/routes";


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
    const [allAreas, setAllAreas] = useState<Area[]>()
    const [allServices, setAllServices] = useState<Service[]>()
    const [types, updateTypes] = useState<string[]>()
    const [selectedType, updateSelectedType] = useState<string>("KOMPONENT")
    const [isLoading, setIsLoading] = useState(true)

    const [newService, updateNewService] = useState<Service>({
        name: "",
        team: "",
        type: "KOMPONENT",
        dependencies: [],
        monitorlink: "",
        pollingUrl: "",
        areasContainingThisService: []
    })

    




    useEffect(() => {
        (async function () {
            const retrievedServices: Service[] = await fetchServices()
            const retrievedAreas: Area[] = await fetchAreas()
            const retrievedTypes: string[] = await fetchTypes()
            setAllServices(retrievedServices)
            setAllAreas(retrievedAreas)
            updateTypes(retrievedTypes)
            setIsLoading(false)
        })()
    }, [])



    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    const { name, team, type, dependencies, monitorlink, pollingUrl, areasContainingThisService } = newService





    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedNewArea = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
            updateNewService(updatedNewArea)
    }

    const handleServiceTypeChange = (event) => {
        let currentService = {...newService}
        const typeChange: string = event.target.value
        updateSelectedType(typeChange)
        currentService.type = typeChange
        updateNewService(currentService)
    }

    /*Handlers for adding serviceDependencies START*/

    const handleAddServiceDependency = (serviceToAdd: Service) => {
        if(dependencies.includes(serviceToAdd)) {
            toast.warn("Tjenesteavhengighet " + serviceToAdd.name + " er allerede lagt til")
            return
        }
        const newServicesList = [...newService.dependencies, serviceToAdd]
        const updatedService: Service = {
            name: name, team: team, type: type, dependencies: newServicesList, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisService: areasContainingThisService
        }
        updateNewService(updatedService)
        toast.success("Lagt til tjenesteavhengighet")
    }

    const handleDeleteServiceDependency = (serviceToDelete: Service) => {
        const newServicesList: Service[] = [...newService.dependencies.filter(service => service != serviceToDelete)]
        const updatedService: Service = {
            name: name, team: team, type: type, dependencies: newServicesList, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisService: areasContainingThisService
        }
        updateNewService(updatedService)
        toast.success("Fjernet område fra område")
    }
    /*Handlers for adding serviceDependencies END*/





    /*Handlers for adding serviceDependencies START*/
    const handleAddAreaServiceConnectsTo = (areaToConsistIn: Area) => {
        if(newService.areasContainingThisService.includes(areaToConsistIn)) {
            toast.warn("Service " + areaToConsistIn.name + " er allerede i område")
            return
        }
        const updatedList = [...newService.areasContainingThisService, areaToConsistIn]
        const updatedService: Service = {...newService,  areasContainingThisService: updatedList}
        updateNewService(updatedService)
        toast.success("Lagt service i område")
    }
    
    const handleDeleteAreaServiceConnectsTo =  (areaToDeleteFrom: Area) => {
        const newAreaList: Area[] = [...newService.areasContainingThisService.filter(area => area != areaToDeleteFrom)]
        const updatedService: Service = {...newService, areasContainingThisService: newAreaList}
        updateNewService(updatedService)
        toast.success("Fjernet service fra område")
    }
    /*Handlers for adding areaService END*/


    const handlePostNewService = (event) => {
        event.preventDefault()
        postService(newService).then(() => {
            toast.success("Område lastet opp")
            router.push(RouterAdminTjenester.PATH)
        }).catch(() => {
            toast.error("Klarte ikke å laste opp område")
        })
    }



    return (
        <Layout>
            <NewServiceContainer>
                <form onSubmit={event => handlePostNewService(event)}>

                    <Detail size="small" spacing>Felter markert med * er obligatoriske</Detail>

                    <Input type="text" required label="Navn på tjeneste" value={name} onChange={handleServiceDataChange("name")} placeholder="Navn*" />
                    <Input type="text" required label="Team*" value={team} onChange={handleServiceDataChange("team")} placeholder="Team" />

                    <Select value={selectedType !== null ? selectedType : ""} label="Type"
                        onChange={(event) => handleServiceTypeChange(event)}>
                        {types.length > 0 ?
                            types.map((type, index) => {
                                return (
                                    <option key={index} value={type}>{type}</option>
                                )
                            })
                        :
                            <option key={undefined} value={""}>Ingen type å legge til</option>
                        }
                    </Select>

                    <Input type="text" label="Monitorlink" value={monitorlink} onChange={handleServiceDataChange("monitorlink")} placeholder="Monitorlink" />
                    <Input type="text" label="PollingUrl" value={pollingUrl} onChange={handleServiceDataChange("pollingUrl")} placeholder="PollingUrl" />

                    <ServiceDependencies 
                        newService={newService}
                        allServices={allServices}
                        handleAddServiceDependency={(serviceToAdd) => handleAddServiceDependency(serviceToAdd)}
                        handleDeleteServiceDependency={(serviceToAdd) => handleDeleteServiceDependency(serviceToAdd)}
                    />

                    <HorizontalSeparator />

                    <ConnectServiceToArea 
                        newService={newService}
                        allAreas={allAreas}
                        handleAddAreaServiceConnectsTo={(areaToConsistIn) => handleAddAreaServiceConnectsTo(areaToConsistIn)}
                        handleDeleteAreaServiceConnectsTo={(areaToDeleteFrom) => handleDeleteAreaServiceConnectsTo(areaToDeleteFrom)}
                    />

                    <HorizontalSeparator />


                    <div className="button-container">
                        <Button variant="secondary" type="button" value="Avbryt" onClick={() => router.push(RouterAdminTjenester.PATH)}>Avbryt</Button>
                        <Button type="submit" value="Legg til i område">Lagre</Button>
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
    handleAddServiceDependency: (serviceToAdd) => void
    handleDeleteServiceDependency: (serviceToAdd) => void
}


const DependenciesContainer = styled.div`
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



const ServiceDependencies = ({newService, allServices, handleDeleteServiceDependency, handleAddServiceDependency}: ServiceProps) => {
    const availableServices: Service[] = allServices.filter(area => !newService.dependencies.map(a => a.id).includes(area.id))
    const { changeTitle } = useContext(TitleContext)

    const [selectedService, changeSelectedService] = useState<Service | null>(() => availableServices.length > 0 ? availableServices[0] : null)

    useEffect(() => {
        changeTitle("Opprett ny tjeneste")
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
            
            <Select label="Legg til tjenesteavhengighet" value={selectedService !== null ? selectedService.id : ""} onChange={handleUpdateSelectedArea}>
                {availableServices.length > 0 ?
                    availableServices.map(service => {
                        return (
                            <option key={service.id} value={service.id}>{service.name}</option>
                        )
                    })
                :
                    <option key={undefined} value="">Ingen tilgjengelige områder</option>
                }
            </Select>

            <Button variant="secondary" type="button" onClick={() => handleAddServiceDependency(selectedService)}>Legg til</Button>
            

            {newService.dependencies.length > 0
            ?
                <ul className="new-list">
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
                <BodyShort spacing><b>Ingen tjenester igjen i listen</b></BodyShort>
            }

        </DependenciesContainer>
    )
}










const ServiceToAreaContainer = styled(DependenciesContainer)``


interface ServiceConnectionProps {
    newService: Service
    allAreas: Area[]
    handleDeleteAreaServiceConnectsTo: (selectedArea) => void
    handleAddAreaServiceConnectsTo: (selectedArea) => void
}


const ConnectServiceToArea = ({newService, allAreas, handleDeleteAreaServiceConnectsTo, handleAddAreaServiceConnectsTo}: ServiceConnectionProps) => {
    const availableAreas: Area[] = allAreas.filter(area => !newService.areasContainingThisService.map(a => a.id).includes(area.id))

    const [selectedArea, changeSelectedArea] = useState<Area | null>(() => availableAreas.length > 0 ? availableAreas[0] : null)

    useEffect(() => {
        if(availableAreas.length > 0){
            changeSelectedArea(availableAreas[0])
        }
        else {
            changeSelectedArea(null)
        }
    }, [allAreas, newService.areasContainingThisService])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedArea: Area = availableAreas.find(area => idOfSelectedArea === area.id)
        changeSelectedArea(newSelectedArea)
    }


    return (
        <ServiceToAreaContainer>
            <Select label="Legg til i område" value={selectedArea !== null ? selectedArea.id : ""} onChange={handleUpdateSelectedArea}>
                {availableAreas.length > 0 ?
                    availableAreas.map(area => {
                        return (
                            <option key={area.id} value={area.id}>{area.name}</option>
                        )
                    })
                :
                    <option key={undefined} value="">Ingen områder å legge til</option>
                }
            </Select>

            <Button variant="secondary" type="button" onClick={() => handleAddAreaServiceConnectsTo(selectedArea)}>Legg til</Button>
            

            {newService.areasContainingThisService.length > 0
            ?
                <ul className="new-list">
                    {newService.areasContainingThisService.map(area => {
                        return (
                            <li key={area.id}>
                                <BodyShort>
                                    {area.name}
                                    <button className="colored" type="button" onClick={() => handleDeleteAreaServiceConnectsTo(area)}>
                                        <label>{area.name}</label>
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
        </ServiceToAreaContainer>
    )
}

export default NewService