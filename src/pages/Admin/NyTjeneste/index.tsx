import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react";
import router from "next/router";

import Layout from '../../../components/Layout';
import { Area, Component, Service } from "../../../types/types";
import CustomNavSpinner from "../../../components/CustomNavSpinner";

import { BodyShort, Button, Detail, Heading, Modal, Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { Copy, Delete } from "@navikt/ds-icons";
import { DynamicListContainer, HorizontalSeparator } from "..";
import { TitleContext } from "../../../components/ContextProviders/TitleContext";
import { fetchServices, postService } from "../../../utils/servicesAPI";
import { fetchAreas } from "../../../utils/areasAPI";
import { RouterAdminTjenester } from "../../../types/routes";
import { fetchComponents } from "../../../utils/componentsAPI";


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

    .input-field {
        div {
            margin-bottom: 1rem;
        }
    }

`

const ModalContent = styled(Modal.Content)`
    width: 100vw;

    display: flex;
    align-items: center;
    flex-direction: column;
    
    .bottom {
        display: flex;
        flex-wrap: wrap;

        p {
            margin-right: 1rem;
        }
    }
`


const NewService = () => {
    const [allAreas, setAllAreas] = useState<Area[]>()
    const [allServices, setAllServices] = useState<Service[]>()
    const [allComponents, setAllComponents] = useState<Component[]>()
    const [isLoading, setIsLoading] = useState(true)
    
    const [newService, updateNewService] = useState<Service>({
        name: "",
        team: "",
        type: "TJENESTE",
        serviceDependencies: [],
        componentDependencies: [],
        monitorlink: "",
        pollingUrl: "",
        areasContainingThisService: [],
        statusNotFromTeam: false
    })

    




    useEffect(() => {
        // Eksempelbruk i en standard nextjs app
        Modal.setAppElement("#__next");
        (async function () {
            const retrievedServices: Service[] = await fetchServices()
            const retrievedComponents: Component[] = await fetchComponents()
            const retrievedAreas: Area[] = await fetchAreas()
            setAllServices(retrievedServices)
            setAllComponents(retrievedComponents)
            setAllAreas(retrievedAreas)
            setIsLoading(false)
        })()
    }, [])



    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    const { name, team, type, serviceDependencies, componentDependencies: componentdependencies, monitorlink, pollingUrl, areasContainingThisService, statusNotFromTeam } = newService





    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedNewArea = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        updateNewService(updatedNewArea)
    }

    const validatePollingUrl = (urlInput) => {
        if(urlInput == "STATUSHOLDER") {
            return true
        }
        if(urlInput.length == 0) {
            return true
        }

        let url;
        
        try {
            url = new URL(urlInput);
        } catch (_) {
            return false;  
        }

        const com = urlInput.substring(urlInput.length - 4)
        const no = urlInput.substring(urlInput.length - 3)

        if(com != ".com" && no != ".no") {
            return false
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    const validateMonitorLink = (urlInput) => {
        if(urlInput.length == 0) {
            return true
        }
        let url;
        
        try {
            url = new URL(urlInput);
        } catch (_) {
            return false;  
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    /*Handlers for adding serviceDependencies START*/

    const handleAddServiceDependency = (serviceToAdd: Service) => {
        if(serviceDependencies.includes(serviceToAdd)) {
            toast.warn("Tjenesteavhengighet " + serviceToAdd.name + " er allerede lagt til")
            return
        }
        const newServicesList = [...newService.serviceDependencies, serviceToAdd]
        const updatedService: Service = {
            name: name, team: team, type: type, serviceDependencies: newServicesList, componentDependencies: componentdependencies, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisService: areasContainingThisService, statusNotFromTeam: statusNotFromTeam
        }
        updateNewService(updatedService)
        toast.success("Lagt til tjenesteavhengighet")
    }

    const handleDeleteServiceDependency = (serviceToDelete: Service) => {
        const newServicesList: Service[] = [...newService.serviceDependencies.filter(service => service != serviceToDelete)]
        const updatedService: Service = {
            name: name, team: team, type: type, serviceDependencies: newServicesList, componentDependencies: componentdependencies, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisService: areasContainingThisService, statusNotFromTeam: statusNotFromTeam
        }
        updateNewService(updatedService)
        toast.success("Fjernet område fra område")
    }
    /*Handlers for adding serviceDependencies END*/




    /*Handlers for adding componentDependencies START*/

    const handleAddComponentDependency = (componentToAdd: Component) => {
        if(componentdependencies.includes(componentToAdd)) {
            toast.warn("Komponent " + componentToAdd.name + " er allerede lagt til")
            return
        }
        const newComponentsList = [...newService.componentDependencies, componentToAdd]
        const updatedService: Service = {
            name: name, team: team, type: type, serviceDependencies: serviceDependencies, componentDependencies: newComponentsList, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisService: areasContainingThisService, statusNotFromTeam: statusNotFromTeam
        }
        updateNewService(updatedService)
        toast.success("Lagt til komponentavhengighet")
    }

    const handleDeleteComponentDependency = (componentToAdd: Component) => {
        const newComponentsList: Component[] = [...newService.serviceDependencies.filter(component => component != componentToAdd)]
        const updatedService: Service = {
            name: name, team: team, type: type, serviceDependencies: serviceDependencies, componentDependencies: newComponentsList, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisService: areasContainingThisService, statusNotFromTeam: statusNotFromTeam
        }
        updateNewService(updatedService)
        toast.success("Fjernet område fra område")
    }
    /*Handlers for adding componentDependencies END*/




    /*Handlers for adding serviceDependencies START*/
    const handleAddAreaServiceConnectsTo = (areaToConsistIn: Area) => {
        if(newService.areasContainingThisService.includes(areaToConsistIn)) {
            toast.warn("Tjenesten ligger allerede i område: " + areaToConsistIn.name)
            return
        }
        const updatedList = [...newService.areasContainingThisService, areaToConsistIn]
        const updatedService: Service = {...newService,  areasContainingThisService: updatedList}
        updateNewService(updatedService)
        toast.success("Lagt tjeneste i område")
    }
    
    const handleDeleteAreaServiceConnectsTo =  (areaToDeleteFrom: Area) => {
        const newAreaList: Area[] = [...newService.areasContainingThisService.filter(area => area != areaToDeleteFrom)]
        const updatedService: Service = {...newService, areasContainingThisService: newAreaList}
        updateNewService(updatedService)
        toast.success("Fjernet tjeneste fra område")
    }
    /*Handlers for adding areaService END*/


    const handlePostNewService = (event) => {
        event.preventDefault()
        if(!validatedForm()) {
            toast.error("Det er mangler i skjemaet. Vennligst gå over og prøv igjen.")
            return
        }
        postService(newService).then((response: Service) => {
            toast.success("Tjeneste lastet opp")
            redirectToAdminTjenester()
        }).catch(() => {
            toast.error("Klarte ikke å laste opp tjeneste")
        })
    }

    const redirectToAdminTjenester = () => {
        router.push(RouterAdminTjenester.PATH)
    }

    const validatedForm = () => {
        if(!validatePollingUrl(pollingUrl)) {
            return false
        }
        if(!validateMonitorLink(monitorlink)) {
            return false
        }
        return true
    }






    return (
        <Layout>
            <NewServiceContainer>
                <form onSubmit={event => handlePostNewService(event)}>

                    <Detail size="small" spacing>Felter markert med * er obligatoriske</Detail>

                    <TextField type="text" required label="Navn på tjeneste*" value={name} onChange={handleServiceDataChange("name")} placeholder="Navn" />
                    <TextField type="text" required label="Team*" value={team} onChange={handleServiceDataChange("team")} placeholder="Team" />

                    <TextField
                        className="input-field"
                        type="text"
                        label="PollingUrl"
                        value={pollingUrl}
                        error={!validatePollingUrl(pollingUrl) ? "Feil i formatet på urlen" : undefined}
                        onChange={handleServiceDataChange("pollingUrl")}
                        placeholder="PollingUrl"
                        required
                    />
                    <TextField
                        type="text"
                        label="Monitorlink"
                        value={monitorlink}
                        error={!validateMonitorLink(monitorlink) ? "Feil i formatet på urlen" : undefined}
                        onChange={handleServiceDataChange("monitorlink")}
                        placeholder="Monitorlink"
                    />

                    <HorizontalSeparator />

                    <ServiceDependencies 
                        newService={newService}
                        allServices={allServices}
                        handleAddServiceDependency={(serviceToAdd) => handleAddServiceDependency(serviceToAdd)}
                        handleDeleteServiceDependency={(serviceToAdd) => handleDeleteServiceDependency(serviceToAdd)}
                    />

                    <HorizontalSeparator />

                    {/* ComoponentDependencies må kanskje fjernes permanent fra denne sida. */}
                    {/* <ComponentDependencies 
                        newService={newService}
                        allComponents={allComponents}
                        handleAddComponentDependency={(componentToAdd) => handleAddComponentDependency(componentToAdd)}
                        handleDeleteComponentDependency={(componentToAdd) => handleDeleteComponentDependency(componentToAdd)}
                    />
                    <HorizontalSeparator /> */}


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



const ServiceDependencies = ({newService, allServices, handleDeleteServiceDependency, handleAddServiceDependency}: ServiceProps) => {
    const availableServices: Service[] = allServices.filter(area => !newService.serviceDependencies.map(a => a.id).includes(area.id))
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
    }, [allServices, newService.serviceDependencies])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedService: Service = availableServices.find(area => idOfSelectedArea === area.id)
        changeSelectedService(newSelectedService)
    }


    const dependencyHandler = () => {
        if(!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        handleAddServiceDependency(selectedService)
    }
    

    return (
        <DynamicListContainer>
            
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

            <Button variant="secondary" type="button" onClick={dependencyHandler}>Legg til</Button>
            

            {newService.serviceDependencies.length > 0
            ?
                <ul className="new-list">
                    {newService.serviceDependencies.map(service => {
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

        </DynamicListContainer>
    )
}
// ---





interface ComponentProps {
    newService: Service
    allComponents: Component[]
    handleAddComponentDependency: (componentToAdd) => void
    handleDeleteComponentDependency: (serviceToAdd) => void
}



const ComponentDependencies = ({newService, allComponents, handleAddComponentDependency, handleDeleteComponentDependency}: ComponentProps) => {
    const availableComponents: Component[] | null = allComponents.filter(area => !newService.componentDependencies.map(a => a.id).includes(area.id))
    const { changeTitle } = useContext(TitleContext)

    const [selectedComponent, changeSelectedComponent] = useState<Component | null>(() => availableComponents.length > 0 ? availableComponents[0] : null)

    useEffect(() => {
        changeTitle("Opprett ny tjeneste")
        if(availableComponents.length > 0){
            changeSelectedComponent(availableComponents[0])
        }
        else {
            changeSelectedComponent(null)
        }
    }, [allComponents, newService.componentDependencies])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedComponent: Component = availableComponents.find(area => idOfSelectedArea === area.id)
        changeSelectedComponent(newSelectedComponent)
    }


    const dependencyHandler = () => {
        if(!selectedComponent) {
            toast.info("Ingen komponent valgt")
            return
        }
        handleAddComponentDependency(selectedComponent)
    }
    

    return (
        <DynamicListContainer>
            
            <Select label="Legg til komponentavhengighet" value={selectedComponent !== null ? selectedComponent.id : ""} onChange={handleUpdateSelectedArea}>
                {availableComponents.length > 0 ?
                    availableComponents.map(service => {
                        return (
                            <option key={service.id} value={service.id}>{service.name}</option>
                        )
                    })
                :
                    <option key={undefined} value="">Ingen tilgjengelige komponenter</option>
                }
            </Select>

            <Button variant="secondary" type="button" onClick={dependencyHandler}>Legg til</Button>
            

            {newService.componentDependencies.length > 0
            ?
                <ul className="new-list">
                    {newService.componentDependencies.map(component => {
                        return (
                            <li key={component.id}>
                                <BodyShort>
                                    {component.name}
                                    <button className="colored" type="button" onClick={() => handleDeleteComponentDependency(component)}>
                                        <label>{component.name}</label>
                                        <Delete/> Slett
                                    </button>
                                </BodyShort>
                            </li>
                        )
                    })}
                </ul>
            :
                <BodyShort spacing><b>Ingen komponenter lagt til</b></BodyShort>
            }

        </DynamicListContainer>
    )
}






// ---



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

    const dependencyHandler = () => {
        if(!selectedArea) {
            toast.info("Ingen områder valgt")
            return
        }
        handleAddAreaServiceConnectsTo(selectedArea)
    }


    return (
        <DynamicListContainer>
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

            <Button variant="secondary" type="button" onClick={dependencyHandler}>Legg til</Button>
            

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
        </DynamicListContainer>
    )
}

export default NewService