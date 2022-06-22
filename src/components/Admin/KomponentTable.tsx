import styled from 'styled-components'
import Head from 'next/head'
import router from 'next/router';
import { useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoader } from '../../utils/useLoader';

import { Close, Delete, Expand, Notes, SaveFile } from '@navikt/ds-icons'
import { BodyShort, Button, Heading, Modal, Select, TextField } from '@navikt/ds-react';

import CustomNavSpinner from '../../components/CustomNavSpinner';
import { Component } from '../../types/navServices';
import { deleteComponent, fetchComponents, updateComponent } from '../../utils/componentsAPI';
import { AdminCategoryContainer, CloseCustomized, DependenciesColumn, DependencyList, ModalInner, NoContentContainer } from '.';
import { TitleContext } from '../ContextProviders/TitleContext';
import { RouterAdminAddKomponent } from '../../types/routes';


const ComponentHeader = styled.div`
    padding: 1rem 0 1rem;
    padding-left: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: row;
    gap: 5ch;

    & > * {
        width: 150px;
        word-break: break-word;
        font-weight: bold;
    }

    .empty-space {
        padding: 0 calc(3rem + 20px);
        display: flex;
        flex-direction: row;
    }

    .komponent-header-content {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        gap: 5ch;

        span {
            width: 100%;
        }
    }
`

const ComponentContent = styled.div`
    min-height: 5rem;

    padding-left: 1rem;
    padding-top: 1px;
    padding-bottom: 1px;

    background-color: var(--navds-semantic-color-canvas-background);

    border-top: 1px solid rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);

    :hover {
        padding-top: 0;
        padding-bottom: 0;

        border-top: 2px solid rgba(0, 0, 0, 0.55);
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);
    }

    display: flex;
    align-items: center;

    :last-child {
        padding-bottom: 0;
        padding-left: 1rem;
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);

        :hover {
            padding-bottom: 0;
            border-bottom: 3px solid rgba(0, 0, 0, 0.55);
        }
    }

    &.editting {
        border-color: var(--navds-global-color-blue-500);
    }
`


const CustomButton = styled.button`
    background-color: transparent;
    border: none;
    :hover {
        cursor: pointer;
    }
`



const KomponentTable = () => {
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [componentsToEdit, changeComponentsToEdit] = useState<string[]>([])
    const [componentToDelete, setComponentToDelete] = useState<Component>()
    const { data: components, isLoading: loadingComponents, reload } = useLoader(fetchComponents,[]);

    const { changeTitle } = useContext(TitleContext)
    
    useEffect(() => {
        changeTitle("Admin - Komponenter")
    })

    if(loadingComponents) {
        return (
            <CustomNavSpinner />
        )
    }
    
    const toggleExpandedFor = (componentId) => {
        if(expanded.includes(componentId)) {
            toggleExpanded([...expanded.filter(i => i !== componentId)])
        } else {
            toggleExpanded([...expanded, componentId])
        }
    }

    const toggleEditComponent = (component: Component) => {
        let edittingComponents: string[] = [...componentsToEdit]
        if(edittingComponents.includes(component.id)) {
            changeComponentsToEdit(edittingComponents.filter(d => d != component.id))
            return
        }
        edittingComponents.push(component.id)
        changeComponentsToEdit(edittingComponents)
    }


    const confirmDeleteComponentHandler = () => {
        deleteComponent(componentToDelete).then(() => {
            toast.info("Komponenten ble slettet")
            setComponentToDelete(null);
            reload()
        }).catch(() => {
            toast.error("Kunne ikke slette komponenten")
        })
    }



    return (
        <AdminCategoryContainer>
            <Head>
                <title>Admin - Tjenester - status.nav.no</title>
            </Head>

            <Modal
                open={!!componentToDelete}
                onClose={() => setComponentToDelete(null)}
            >
                <ModalInner>Ønsker du å slette komponenten?
                    <Button variant="secondary" onClick={confirmDeleteComponentHandler}>Slett komponent</Button>
                    <Button variant="secondary" onClick={() => setComponentToDelete(null)}>Avbryt</Button>
                </ModalInner>
            </Modal>






            <div className="centered">
                <Button variant="secondary" 
                        onClick={() => router.push(RouterAdminAddKomponent.PATH)}>
                    <b>Legg til ny komponent</b>
                </Button>
            </div>




            <div className="category-overflow-container">
                <div>
                    {components
                    ?
                        <div>
                            <ComponentHeader>
                                <div className="komponent-header-content">
                                    <span>Navn</span>
                                    <span>Team</span>
                                </div>
                                <div className="empty-space"></div>
                            </ComponentHeader>




                            {components.map( component => {
                                return (
                                    <ComponentContent key={component.id} className={componentsToEdit.includes(component.id) ? "editting" : ""}>
                                        {!componentsToEdit.includes(component.id) 
                                            ?
                                                <ComponentRow 
                                                    component={component}
                                                    toggleEditComponent={() => toggleEditComponent(component)}
                                                    toggleExpanded={() => toggleExpandedFor(component.id)}
                                                    isExpanded={expanded.includes(component.id)}
                                                    setComponentToDelete={() => setComponentToDelete(component)}
                                                />
                                            :
                                                <ComponentRowEditting 
                                                    component={component}
                                                    toggleEditComponent={() => toggleEditComponent(component)}
                                                    toggleExpanded={() => toggleExpandedFor(component.id)}
                                                    isExpanded={expanded.includes(component.id)}
                                                    setComponentToDelete={() => setComponentToDelete(component)}
                                                    allComponents={components}
                                                    reload={reload}
                                                />
                                        }
                                    </ComponentContent>
                                )
                            })}
                        </div>
                    : 
                        <NoContentContainer>
                            <Heading size="medium" level="3">
                                Ingen komponenter eksisterer
                            </Heading>
                        </NoContentContainer>
                    }
                </div>
            </div>
        </AdminCategoryContainer>
    )
}





/* ----------------- --------------------------------------------------- -----------------*/







const ComponentRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    
    div {
        display: flex;
        justify-content: space-between;
    }
`

const ComponentRowContent = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .top-row {
        min-height: 5rem;
        display: flex;
        align-items: center;
        flex-grow: 1;

        & > * {
            display: flex;
            flex-basis: 100%;
        }

        .component-row-element {
            flex-basis: 100%;
            margin-right: 5ch;
            word-break: break-word;
            width: 150px;

            input {
                width: 142px;
                min-height: 48px;
                padding: 8px;
                margin-top: var(--navds-spacing-2);
            }

            label {
                display: hidden;
                z-index: -1000;
            }
        }

        :hover {
            cursor: pointer;
        }
    }
    
    .bottom-row {
        border-top: 2px solid rgba(0, 0, 0, 0.1);
        min-height: 5rem;
        padding: 1rem 0;

        & > * {
            display: flex;
            flex-basis: 100%;
        }

        .dependencies {
            margin-right: 5ch;
            max-width: 275px;
            margin-top: 0;

            display: flex;
            flex-direction: column;
            
            ul {
                margin-top: 0;
            }
        }

        input {
            min-height: 48px;
            margin-top: var(--navds-spacing-2);
        }

        .component-row-element {
            margin-right: 5ch;
            display: flex;
            flex-direction: column;
        }

        span:first-child {
            margin: 0 2rem;
        }
    }

    .clickable {
        :hover {
            cursor: pointer;
        }
    }
`



interface ComponentRowProps {
    component: Component,
    allComponents?: Component[],
    toggleEditComponent: (component) => void,
    toggleExpanded: (component) => void,
    isExpanded: boolean,
    setComponentToDelete: (component) => void,
    reload?: () => void
}

const ComponentRow = ({component, toggleEditComponent, toggleExpanded, isExpanded, setComponentToDelete }: ComponentRowProps) => {

    const handleEditComponent = (component) => {
        if(!isExpanded) {
            toggleExpanded(component)
        }
        toggleEditComponent(component)
    }

    return (
        <ComponentRowContainer>
            <ComponentRowContent>
                <div className="top-row" onClick={() => toggleExpanded(component)}>
                    <div>
                        <span className="component-row-element">{component.name}</span>
                        <span className="component-row-element">{component.team}</span>
                    </div>
                </div>

                {isExpanded &&
                    <div className="bottom-row clickable" onClick={() => toggleExpanded(component)}>
                        <div className="dependencies">
                            {component.componentDependencies.length == 0
                                ?
                                    <>
                                        <BodyShort spacing><b>Komponentavhengigheter</b></BodyShort>
                                        <BodyShort spacing>Ingen komponentavhengigheter eksisterer</BodyShort>
                                    </>
                                :
                                    <>
                                        <BodyShort spacing><b>Komponentavhengigheter</b></BodyShort>
                                        <ul>
                                            {component.componentDependencies.map((dependency, index) => {
                                                return (
                                                    <li key={index}>{dependency.name}</li>
                                                    )
                                                })}
                                        </ul>
                                    </>
                            }
                        </div>
                        
                        <span className="component-row-element">
                            <BodyShort><b>Monitorlink</b></BodyShort>
                            <BodyShort>{component.monitorlink}</BodyShort>
                        </span>
                        <span className="component-row-element">
                            <BodyShort><b>PollingUrl</b></BodyShort>
                            <BodyShort>{component.pollingUrl}</BodyShort>
                        </span>
                        <span className="component-row-element">
                            <BodyShort spacing><b>ID</b></BodyShort>
                            <BodyShort>{component.id}</BodyShort>
                        </span>
                    </div>
                }

            </ComponentRowContent>
            <div className="button-container">
                <CustomButton className="option" onClick={() => handleEditComponent(component)}>
                    <a><Notes /> Rediger</a>
                </CustomButton>
                <button className="option" onClick={setComponentToDelete} aria-label="Slett komponent"><a><Delete />Slett</a></button>
                <button className="option" onClick={() => toggleExpanded(component)}><Expand className={isExpanded ? "expanded" : "not-expanded"} aria-expanded={isExpanded} /></button>
            </div>
            
        </ComponentRowContainer>
    )
}







/* ----------------- --------------------------------------------------- -----------------*/







const ComponentRowEditting = ({ component, allComponents, toggleEditComponent, toggleExpanded, isExpanded, setComponentToDelete, reload } : ComponentRowProps) => {
    const [updatedComponent, changeUpdatedComponent] = useState<Component>({
        id: component.id,
        name: component.name,
        type: component.type,
        team: component.team,
        componentDependencies: component.componentDependencies,
        monitorlink: component.monitorlink,
        pollingUrl: component.pollingUrl,
        servicesDependentOnThisComponent: component.servicesDependentOnThisComponent
    })



    const handleUpdatedComponent = (field: keyof typeof updatedComponent) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const changedService = {
            ...updatedComponent,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
        changeUpdatedComponent(changedService)
    }

    const handleSubmit = () => {
        updateComponent(updatedComponent).then(() => {
            reload()
            toggleExpanded(component)
            toggleEditComponent(component)
            toast.success("Oppdatering gjennomført")
        }).catch(() => {
            toast.error("Noe gikk galt i oppdatering av område")
        })
    }

    const handleCancelEditting = (component) => {
        if(isExpanded) {
            toggleExpanded(component)
        }
        toggleEditComponent(component)
    }

    


    const { name, type, team, componentDependencies, monitorlink, pollingUrl, servicesDependentOnThisComponent } = updatedComponent

    return (
        <ComponentRowContainer>
            <ComponentRowContent>

                <div className="top-row" onClick={() => toggleExpanded(component)}>
                    <TextField label="Navn" hideLabel className="component-row-element editting" value={name} onChange={handleUpdatedComponent("name")} onClick={(event) => event.stopPropagation()} />

                    <TextField label="Team" hideLabel className="component-row-element editting" value={team} onChange={handleUpdatedComponent("team")} onClick={(event) => event.stopPropagation()} />
                </div>


            {isExpanded &&
                        
                <div className="bottom-row">
                    <div className="dependencies">
                        <BodyShort spacing><b>Tjenester avhengig denne</b></BodyShort>

                        <EditDependenciesTowardServices
                            allComponents={allComponents} component={component} updatedComponent={updatedComponent}
                        />
                    </div>
                    <span className="component-row-element editting">
                        <BodyShort spacing><b>Monitorlink</b></BodyShort>
                        <TextField label="Monitorlink" hideLabel value={monitorlink} onChange={handleUpdatedComponent("monitorlink")}/>
                    </span>
                    <span className="component-row-element editting">
                        <BodyShort spacing><b>PollingUrl</b></BodyShort>
                        <TextField label="Pollingurl" hideLabel value={pollingUrl} onChange={handleUpdatedComponent("pollingUrl")}/>
                    </span>
                </div>
            }
            </ComponentRowContent>

            
            <div className="button-container">
                <button type="button" className="option" onClick={handleSubmit}>
                    <a><SaveFile/> Lagre</a>
                </button>
                <CustomButton className="option" onClick={() => handleCancelEditting(component)}>
                    <a><Close/> Avbryt</a>
                </CustomButton>
                <button className="option" onClick={setComponentToDelete} aria-label="Slett komponent"><a><Delete /> Slett</a></button>
                <button className="option" onClick={() => toggleExpanded(component)}><Expand className={isExpanded ? "expanded" : "not-expanded"} aria-expanded={isExpanded} /></button>
            </div>

        </ComponentRowContainer>
    )
}











/*----------------------------------------- HELPER FOR CODE ABOVE -----------------------------------------*/












const EditDependenciesTowardServices: React.FC<
                {allComponents: Component[], component: Component, updatedComponent: Component}> = (
                {allComponents, component, updatedComponent}
        ) => {

    const [edittedDependencies, updateDependencies] = useState<Component[]>([...component.componentDependencies])
    const availableServiceDependencies: Component[] = [...allComponents].filter(s => 
        s.id != component.id && !edittedDependencies.map(component => component.id).includes(s.id)
    )
    
    const [selectedComponent, updateSelectedComponent] = useState<Component | null>(allComponents[0])


    useEffect(() => {
        updatedComponent.componentDependencies = edittedDependencies
        if(availableServiceDependencies.length > 0){
            updateSelectedComponent(availableServiceDependencies[0])
        }
        else {
            updateSelectedComponent(null)
        }
    }, [edittedDependencies])


    const handleUpdateSelectedComponent = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Component = allComponents.find(component => idOfSelectedService === component.id)
        updateSelectedComponent(newSelectedService)
    }



    const handlePutEdittedServiceDependency = () => {
        if(selectedComponent !== null) {    
            const updatedEdittedDependencies: Component[] = [...edittedDependencies, selectedComponent]
            updateDependencies(updatedEdittedDependencies)
            toast.success("Tjenesteavhengighet lagt til")
            return
        }
        toast.info("Ingen komponenter å legge til")
    }



    const handleRemoveEdittedServiceDependency = (component: Component) => {
        if(!edittedDependencies.includes(component)) {
            toast.error("Komponent eksisterer ikke i avhengighetene. Noe har gått galt med innlesingen")
            return
        }
        const updatedEdittedDependencies = edittedDependencies.filter(s => s.id != component.id)
        updateDependencies(updatedEdittedDependencies)
        toast.info("Avhengighet fjernet")
        
    }


    return (
        <DependenciesColumn>
            <DependencyList>
                {edittedDependencies.length === 0
                ?
                    <BodyShort spacing>
                        Komponenten er ikke koblet mot noen tjenester
                    </BodyShort>
                :
                    <>
                        {edittedDependencies.map((component) => {
                            return (
                                <li key={component.id}>{component.name} 
                                    <CustomButton aria-label={"Fjern tjenesteavhengighet med navn " + component.name}
                                            onClick={() => handleRemoveEdittedServiceDependency(component)}>
                                        <CloseCustomized/>
                                    </CustomButton>
                                </li>
                            )
                        })}
                    </>
                }
            </DependencyList>
            {allComponents.length !== 0
            ?
                <Select label="Legg til komponenter i område" onChange={handleUpdateSelectedComponent}>
                    {availableServiceDependencies.length > 0 ?
                    availableServiceDependencies.map(component => {
                        return (
                            <option key={component.id} value={component.id}>{component.name}</option>
                        )
                    })
                    :
                        <option key={undefined} value={""}>Ingen komponent å legge til</option>
                    }
                </Select>
            :
                <>
                    Ingen komponent å legge til
                </>
            }

            <div>
                <Button variant="secondary" className="add-element" onClick={handlePutEdittedServiceDependency}>Legg til</Button>
            </div>

            
        </DependenciesColumn>
    )
}





export default KomponentTable
