import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react";
import router from "next/router";

import Layout from '../../../components/Layout';
import { Service, Component } from "../../../types/types";
import CustomNavSpinner from "../../../components/CustomNavSpinner";
import { fetchTypes } from "../../../utils/fetchTypes";

import { BodyShort, Button, Detail, Heading, Modal, Select, TextField } from "@navikt/ds-react";
import { Copy, Delete } from "@navikt/ds-icons";
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


const NewComponent = () => {
    const [allComponents, setAllComponents] = useState<Component[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [didComponentCreate, changeDidComponentCreate] = useState(false)
    const [newlyCreatedComponent, setNewlyCreatedComponent] = useState<Component>(
        {
            name: "",
            team: "",
            type: "KOMPONENT",
            componentDependencies: [],
            monitorlink: "",
            pollingUrl: "",
            servicesDependentOnThisComponent: []
        }
    )

    const [newComponent, updateNewComponent] = useState<Component>({
        name: "",
        team: "",
        type: "KOMPONENT",
        componentDependencies: [],
        monitorlink: "",
        pollingUrl: "",
        servicesDependentOnThisComponent: []
    })

    




    useEffect(() => {
        (async function () {
            const retrievedComponents: Component[] = await fetchComponents()
            const retrievedTypes: string[] = await fetchTypes()
            setAllComponents(retrievedComponents)
            setIsLoading(false)
        })()
    }, [])



    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    const { name, team, type, componentDependencies: dependencies, monitorlink, pollingUrl, servicesDependentOnThisComponent } = newComponent





    const handleComponentDataChange = (field: keyof typeof newComponent) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const updatedNewArea = {
            ...newComponent,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
            updateNewComponent(updatedNewArea)
    }

    /*Handlers for adding componentDependencies START*/

    const handleAddComponentDependency = (componentToAdd: Component) => {
        if(dependencies.includes(componentToAdd)) {
            toast.warn("Komponent " + componentToAdd.name + " er allerede lagt til")
            return
        }
        const newComponentsList = [...newComponent.componentDependencies, componentToAdd]
        const updatedComponent: Component = {
            name: name, team: team, type: type, componentDependencies: newComponentsList, monitorlink: monitorlink, pollingUrl: pollingUrl, servicesDependentOnThisComponent
        }
        updateNewComponent(updatedComponent)
        toast.success("Lagt til komponentavhengighet")
    }

    const handleDeleteComponentDependency = (componentToDelete: Component) => {
        const newComponentsList: Component[] = [...newComponent.componentDependencies.filter(component => component != componentToDelete)]
        const updatedComponent: Component = {
            name: name, team: team, type: type, componentDependencies: newComponentsList, monitorlink: monitorlink, pollingUrl: pollingUrl, servicesDependentOnThisComponent
        }
        updateNewComponent(updatedComponent)
        toast.success("Fjernet område fra område")
    }
    /*Handlers for adding componentDependencies END*/


    const handlePostNewComponent = (event) => {
        event.preventDefault()
        postComponent(newComponent).then((response: Component) => {
            toast.success("Komponent lastet opp")
            changeDidComponentCreate(true)
            setNewlyCreatedComponent(response)
        }).catch(() => {
            toast.error("Klarte ikke å laste opp komponenten")
        })
    }

    const redirectToAdminKomponenter = () => {
        if(didComponentCreate) {
            router.push(RouterAdminKomponenter.PATH)
        }
    }


    return (
        <Layout>

            <Modal open={didComponentCreate} onClose={() => redirectToAdminKomponenter()}>
                <ModalContent>
                    <Heading spacing level="1" size="large">
                        Komponent opprettet!
                    </Heading>
                    <Detail spacing>
                        {newlyCreatedComponent.id}
                    </Detail>

                    <span className="bottom">
                        <BodyShort>
                            Kopier denne id'en: 
                        </BodyShort>
                        <Button variant="secondary" size="small" onClick={() => navigator.clipboard.writeText(newlyCreatedComponent.id)}>
                            <Copy />
                        </Button>
                    </span>
                </ModalContent>
            </Modal>

            <NewComponentContainer>
                <form onSubmit={event => handlePostNewComponent(event)}>

                    <Detail size="small" spacing>Felter markert med * er obligatoriske</Detail>

                    <TextField type="text" required label="Navn på komponent*" value={name} onChange={handleComponentDataChange("name")} placeholder="Navn" />
                    <TextField type="text" required label="Team*" value={team} onChange={handleComponentDataChange("team")} placeholder="Team" />

                    <TextField type="text" label="PollingUrl" value={pollingUrl} onChange={handleComponentDataChange("pollingUrl")} placeholder="PollingUrl" />
                    <TextField type="text" label="Monitorlink" value={monitorlink} onChange={handleComponentDataChange("monitorlink")} placeholder="Monitorlink" />

                    <HorizontalSeparator />

                    <ComponentDependencies 
                        newComponent={newComponent}
                        allComponents={allComponents}
                        handleAddComponentDependency={(componentToAdd) => handleAddComponentDependency(componentToAdd)}
                        handleDeleteComponentDependency={(componentToAdd) => handleDeleteComponentDependency(componentToAdd)}
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

    const addHandler = () => {
        if(!selectedComponent) {
            toast.info("Ingen komponent valgt")
            return
        }
        handleAddComponentDependency(selectedComponent)
    }
    

    return (
        <DynamicListContainer>
            
            <Select label="Legg til komponentavhengigheter" value={selectedComponent !== null ? selectedComponent.id : ""} onChange={handleUpdateSelectedArea}>
                {availableComponents.length > 0 ?
                    availableComponents.map(component => {
                        return (
                            <option key={component.id} value={component.id}>{component.name}</option>
                        )
                    })
                :
                    <option key={undefined} value="">Ingen tilgjengelige komponenter</option>
                }
            </Select>

            <Button variant="secondary" type="button" onClick={addHandler}>Legg til</Button>
            

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
                <BodyShort spacing><b>Ingen komponenter lagt til</b></BodyShort>
            }

        </DynamicListContainer>
    )
}


export default NewComponent