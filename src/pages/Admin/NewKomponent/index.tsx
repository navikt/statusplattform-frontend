import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react";
import router from "next/router";

import Layout from '../../../components/Layout';
import { Area, Component } from "../../../types/navServices";
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import { fetchTypes } from "../../..//utils/fetchTypes";

import { BodyShort, Button, Detail, Select, TextField } from "@navikt/ds-react";
import { Delete } from "@navikt/ds-icons";
import { DynamicListContainer, HorizontalSeparator } from "..";
import { TitleContext } from "../../../components/ContextProviders/TitleContext";
import { fetchAreas } from "../../../utils/areasAPI";
import { fetchComponents, postComponent } from "../../../utils/componentsAPI";
import { RouterAdminKomponenter } from "../../../types/routes";


const NewComponentContainer = styled.div`
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


const NewComponent = () => {
    const [allAreas, setAllAreas] = useState<Area[]>()
    const [allComponents, setAllComponents] = useState<Component[]>()
    const [types, updateTypes] = useState<string[]>()
    const [selectedType, updateSelectedType] = useState<string>("KOMPONENT")
    const [isLoading, setIsLoading] = useState(true)

    const [newComponent, updateNewComponent] = useState<Component>({
        name: "",
        team: "",
        type: "KOMPONENT",
        componentDependencies: [],
        monitorlink: "",
        pollingUrl: "",
        areasContainingThisComponent: []
    })

    




    useEffect(() => {
        (async function () {
            const retrievedComponents: Component[] = await fetchComponents()
            const retrievedAreas: Area[] = await fetchAreas()
            const retrievedTypes: string[] = await fetchTypes()
            setAllComponents(retrievedComponents)
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

    const { name, team, type, componentDependencies: dependencies, monitorlink, pollingUrl, areasContainingThisComponent } = newComponent





    const handleComponentDataChange = (field: keyof typeof newComponent) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedNewArea = {
            ...newComponent,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
            updateNewComponent(updatedNewArea)
    }

    /*Handlers for adding componentDependencies START*/

    const handleAddComponentDependency = (componentToAdd: Component) => {
        if(dependencies.includes(componentToAdd)) {
            toast.warn("Tjenesteavhengighet " + componentToAdd.name + " er allerede lagt til")
            return
        }
        const newComponentsList = [...newComponent.componentDependencies, componentToAdd]
        const updatedComponent: Component = {
            name: name, team: team, type: type, componentDependencies: newComponentsList, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisComponent: areasContainingThisComponent
        }
        updateNewComponent(updatedComponent)
        toast.success("Lagt til tjenesteavhengighet")
    }

    const handleDeleteComponentDependency = (componentToDelete: Component) => {
        const newComponentsList: Component[] = [...newComponent.componentDependencies.filter(component => component != componentToDelete)]
        const updatedComponent: Component = {
            name: name, team: team, type: type, componentDependencies: newComponentsList, monitorlink: monitorlink, pollingUrl: pollingUrl, areasContainingThisComponent: areasContainingThisComponent
        }
        updateNewComponent(updatedComponent)
        toast.success("Fjernet område fra område")
    }
    /*Handlers for adding componentDependencies END*/





    /*Handlers for adding componentDependencies START*/
    const handleAddAreaComponentConnectsTo = (areaToConsistIn: Area) => {
        if(newComponent.areasContainingThisComponent.includes(areaToConsistIn)) {
            toast.warn("Component " + areaToConsistIn.name + " er allerede i område")
            return
        }
        const updatedList = [...newComponent.areasContainingThisComponent, areaToConsistIn]
        const updatedComponent: Component = {...newComponent,  areasContainingThisComponent: updatedList}
        updateNewComponent(updatedComponent)
        toast.success("Lagt component i område")
    }
    
    const handleDeleteAreaComponentConnectsTo =  (areaToDeleteFrom: Area) => {
        const newAreaList: Area[] = [...newComponent.areasContainingThisComponent.filter(area => area != areaToDeleteFrom)]
        const updatedComponent: Component = {...newComponent, areasContainingThisComponent: newAreaList}
        updateNewComponent(updatedComponent)
        toast.success("Fjernet component fra område")
    }
    /*Handlers for adding areaComponent END*/


    const handlePostNewComponent = (event) => {
        event.preventDefault()
        postComponent(newComponent).then(() => {
            toast.success("Område lastet opp")
            router.push(RouterAdminKomponenter.PATH)
        }).catch(() => {
            toast.error("Klarte ikke å laste opp område")
        })
    }



    return (
        <Layout>
            <NewComponentContainer>
                <form onSubmit={event => handlePostNewComponent(event)}>

                    <Detail size="small" spacing>Felter markert med * er obligatoriske</Detail>

                    <TextField type="text" required label="Navn på tjeneste" value={name} onChange={handleComponentDataChange("name")} placeholder="Navn*" />
                    <TextField type="text" required label="Team*" value={team} onChange={handleComponentDataChange("team")} placeholder="Team" />

                    <TextField type="text" label="Monitorlink" value={monitorlink} onChange={handleComponentDataChange("monitorlink")} placeholder="Monitorlink" />
                    <TextField type="text" label="PollingUrl" value={pollingUrl} onChange={handleComponentDataChange("pollingUrl")} placeholder="PollingUrl" />

                    <ComponentDependencies 
                        newComponent={newComponent}
                        allComponents={allComponents}
                        handleAddComponentDependency={(componentToAdd) => handleAddComponentDependency(componentToAdd)}
                        handleDeleteComponentDependency={(componentToAdd) => handleDeleteComponentDependency(componentToAdd)}
                    />

                    <HorizontalSeparator />

                    <ConnectComponentToArea 
                        newComponent={newComponent}
                        allAreas={allAreas}
                        handleAddAreaComponentConnectsTo={(areaToConsistIn) => handleAddAreaComponentConnectsTo(areaToConsistIn)}
                        handleDeleteAreaComponentConnectsTo={(areaToDeleteFrom) => handleDeleteAreaComponentConnectsTo(areaToDeleteFrom)}
                    />

                    <HorizontalSeparator />


                    <div className="button-container">
                        <Button variant="secondary" type="button" value="Avbryt" onClick={() => router.push(RouterAdminKomponenter.PATH)}>Avbryt</Button>
                        <Button type="submit" value="Legg til i område">Lagre</Button>
                    </div>
                </form>
            </NewComponentContainer>
            <ToastContainer />
        </Layout>
    )
}





/*-----------_Helpers_-------------*/


interface ComponentProps {
    newComponent: Component
    allComponents: Component[]
    handleAddComponentDependency: (componentToAdd) => void
    handleDeleteComponentDependency: (componentToAdd) => void
}



const ComponentDependencies = ({newComponent, allComponents, handleDeleteComponentDependency, handleAddComponentDependency}: ComponentProps) => {
    const availableComponents: Component[] = allComponents.filter(area => !newComponent.componentDependencies.map(a => a.id).includes(area.id))
    const { changeTitle } = useContext(TitleContext)

    const [selectedComponent, changeSelectedComponent] = useState<Component | null>(() => availableComponents.length > 0 ? availableComponents[0] : null)

    useEffect(() => {
        changeTitle("Opprett ny komponent")
        if(availableComponents.length > 0){
            changeSelectedComponent(availableComponents[0])
        }
        else {
            changeSelectedComponent(null)
        }
    }, [allComponents, newComponent.componentDependencies])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedComponent: Component = availableComponents.find(area => idOfSelectedArea === area.id)
        changeSelectedComponent(newSelectedComponent)
    }
    

    return (
        <DynamicListContainer>
            
            <Select label="Legg til tjenesteavhengighet" value={selectedComponent !== null ? selectedComponent.id : ""} onChange={handleUpdateSelectedArea}>
                {availableComponents.length > 0 ?
                    availableComponents.map(component => {
                        return (
                            <option key={component.id} value={component.id}>{component.name}</option>
                        )
                    })
                :
                    <option key={undefined} value="">Ingen tilgjengelige områder</option>
                }
            </Select>

            <Button variant="secondary" type="button" onClick={() => handleAddComponentDependency(selectedComponent)}>Legg til</Button>
            

            {newComponent.componentDependencies.length > 0
            ?
                <ul className="new-list">
                    {newComponent.componentDependencies.map(component => {
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
                <BodyShort spacing><b>Ingen tjenester igjen i listen</b></BodyShort>
            }

        </DynamicListContainer>
    )
}










const ComponentToAreaContainer = styled(DynamicListContainer)``


interface ComponentConnectionProps {
    newComponent: Component
    allAreas: Area[]
    handleDeleteAreaComponentConnectsTo: (selectedArea) => void
    handleAddAreaComponentConnectsTo: (selectedArea) => void
}


const ConnectComponentToArea = ({newComponent, allAreas, handleDeleteAreaComponentConnectsTo, handleAddAreaComponentConnectsTo}: ComponentConnectionProps) => {
    const availableAreas: Area[] = allAreas.filter(area => !newComponent.areasContainingThisComponent.map(a => a.id).includes(area.id))

    const [selectedArea, changeSelectedArea] = useState<Area | null>(() => availableAreas.length > 0 ? availableAreas[0] : null)

    useEffect(() => {
        if(availableAreas.length > 0){
            changeSelectedArea(availableAreas[0])
        }
        else {
            changeSelectedArea(null)
        }
    }, [allAreas, newComponent.areasContainingThisComponent])
    


    const handleUpdateSelectedArea = (event) => {
        const idOfSelectedArea: string = event.target.value
        const newSelectedArea: Area = availableAreas.find(area => idOfSelectedArea === area.id)
        changeSelectedArea(newSelectedArea)
    }


    return (
        <ComponentToAreaContainer>
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

            <Button variant="secondary" type="button" onClick={() => handleAddAreaComponentConnectsTo(selectedArea)}>Legg til</Button>
            

            {newComponent.areasContainingThisComponent.length > 0
            ?
                <ul className="new-list">
                    {newComponent.areasContainingThisComponent.map(area => {
                        return (
                            <li key={area.id}>
                                <BodyShort>
                                    {area.name}
                                    <button className="colored" type="button" onClick={() => handleDeleteAreaComponentConnectsTo(area)}>
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
        </ComponentToAreaContainer>
    )
}

export default NewComponent