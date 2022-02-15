import styled from 'styled-components'
import Head from 'next/head'
import router from 'next/router';
import { useContext, useEffect, useState } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoader } from '../../utils/useLoader';

import { Input } from 'nav-frontend-skjema';
import { Expand, Notes } from '@navikt/ds-icons'
import { BodyShort, Button, Heading, Select } from '@navikt/ds-react';
import ModalWrapper from 'nav-frontend-modal';

import CustomNavSpinner from '../../components/CustomNavSpinner';
import { Component } from '../../types/navServices';
import { deleteComponent, fetchComponents, postComponent, updateComponent } from '../../utils/componentsAPI';
import { CloseCustomized, ModalInner, NoContentContainer } from '.';
import { TitleContext } from '../ContextProviders/TitleContext';
import { RouterAdminAddKomponent } from '../../types/routes';

const KomponentTableContainer = styled.div`
    .components-overflow-container {
        overflow-x: auto;
        div {
            min-width: fit-content;
        }
    }
    
    .centered {
        display: flex;
        justify-content: center;

        margin: 60px 0;
    }
`

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

    background-color: var(--navGraBakgrunn);

    border-top: 1px solid rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);

    :hover {
        padding-top: 0;
        padding-bottom: 0;

        cursor: pointer;

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
        border-color: var(--navBla);
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
    const [addNewComponent, changeAddNewComponent] = useState(false)
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
        <KomponentTableContainer>
            <Head>
                <title>Admin - Tjenester</title>
            </Head>

            <ModalWrapper
                isOpen={!!componentToDelete}
                onRequestClose={() => setComponentToDelete(null)}
                closeButton={true}
                contentLabel="Slettemodal"
            >
                <ModalInner>Ønsker du å slette komponenten?
                    <Button variant="secondary" onClick={confirmDeleteComponentHandler}>Slett komponent</Button>
                    <Button variant="secondary" onClick={() => setComponentToDelete(null)}>Avbryt</Button>
                </ModalInner>
            </ModalWrapper>






            <div className="centered">
                <Button variant="secondary" 
                        onClick={() => router.push(RouterAdminAddKomponent.PATH)}>
                    <b>Legg til ny komponent</b>
                </Button>
            </div>




            <div className="components-overflow-container">
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
        </KomponentTableContainer>
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
            display: flex;
            flex-direction: column;
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

const ComponentRow = ({component, toggleEditComponent: toggleEditComponent, toggleExpanded, isExpanded, setComponentToDelete: setComponentToDelete }: ComponentRowProps) => {
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
                    <div className="bottom-row" onClick={() => toggleExpanded(component)}>
                        <div className="dependencies"><p><b>Avhengigheter</b></p>
                            <ul>
                                {component.dependencies.map((dependency, index) => {
                                    return (
                                        <li key={index}>{dependency.name}</li>
                                        )
                                    })}
                            </ul>
                        </div>
                        <span className="component-row-element">
                            <p><b>Monitorlink</b></p>
                            <p>{component.monitorlink}</p>
                        </span>
                        <span className="component-row-element">
                            <p><b>PollingUrl</b></p>
                            <p>{component.pollingUrl}</p>
                        </span>
                    </div>
                }

            </ComponentRowContent>
            <div className="button-container">
                <CustomButton className="option" onClick={() => toggleEditComponent(component)}>
                    <Notes />
                </CustomButton>
                <button className="option" onClick={setComponentToDelete} aria-label="Slett komponent"><CloseCustomized /></button>
                <button className="option" onClick={() => toggleExpanded(component)}><Expand className={isExpanded ? "expanded" : "not-expanded"} aria-expanded={isExpanded} /></button>
            </div>
            
        </ComponentRowContainer>
    )
}







/* ----------------- --------------------------------------------------- -----------------*/







const ComponentRowEditting = ({ component, allComponents: allServices, toggleEditComponent: toggleEditService, toggleExpanded, isExpanded, setComponentToDelete: setServiceToDelete, reload } : ComponentRowProps) => {
    const [updatedService, changeUpdatedService] = useState<Component>({
        id: component.id,
        name: component.name,
        type: component.type,
        team: component.team,
        dependencies: component.dependencies,
        monitorlink: component.monitorlink,
        pollingUrl: component.pollingUrl
    })



    const handleUpdatedService = (field: keyof typeof updatedService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const changedService = {
            ...updatedService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
        changeUpdatedService(changedService)
    }

    const handleSubmit = () => {
        updateComponent(updatedService).then(() => {
            reload()
            toast.success("Oppdatering gjennomført")
            toggleEditService(component)
        }).catch(() => {
            toast.error("Noe gikk galt i oppdatering av område")
        })
    }

    


    const { name, type, team, dependencies, monitorlink, pollingUrl } = updatedService

    return (
        <ComponentRowContainer>
            <ComponentRowContent>

                <div className="top-row" onClick={() => toggleExpanded(component)}>
                    <Input className="component-row-element editting" value={name} onChange={handleUpdatedService("name")} onClick={(event) => event.stopPropagation()} />

                    <Input className="component-row-element editting" value={team} onChange={handleUpdatedService("team")} onClick={(event) => event.stopPropagation()} />
                </div>


            {isExpanded &&
                        
                <div className="bottom-row">
                    <div className="dependencies"><p><b>Avhengigheter</b></p>

                        <EditDependenciesTowardServices
                            allServices={allServices} component={component} updatedService={updatedService}
                        />
                    </div>
                    <span className="component-row-element editting">
                        <p><b>Monitorlink</b></p>
                        <Input value={monitorlink} onChange={handleUpdatedService("monitorlink")}/>
                    </span>
                    <span className="component-row-element editting">
                        <p><b>PollingUrl</b></p>
                        <Input value={pollingUrl} onChange={handleUpdatedService("pollingUrl")}/>
                    </span>
                </div>
            }
            </ComponentRowContent>

            
            <div className="button-container">
                <button type="button" className="option" onClick={handleSubmit}>
                    Lagre endringer
                </button>
                <CustomButton className="option" onClick={() => toggleEditService(component)}>
                    Avbryt endringer
                </CustomButton>
                <button className="option" onClick={setServiceToDelete} aria-label="Slett komponent"><CloseCustomized /></button>
                <button className="option" onClick={() => toggleExpanded(component)}><Expand className={isExpanded ? "expanded" : "not-expanded"} aria-expanded={isExpanded} /></button>
            </div>

        </ComponentRowContainer>
    )
}











/*----------------------------------------- HELPER FOR CODE ABOVE -----------------------------------------*/











const DependenciesColumn = styled.div`
    margin-right: 5ch;
    max-width: 242px;
    
    display: flex;
    flex-direction: column;

    .add-component {
        margin: 1rem 0;
    }

    ul {
        max-width: 100%;
        word-break: break-word;

        li {
            border: 1px solid transparent;
            border-radius: 5px;
        }

        li:hover {
            border: 1px solid black;
        }
    }

    label {
        position: absolute;
        z-index: -1000;
    }
`

const DependencyList = styled.ul`
    list-style: none;
    padding: 0;
    width: 100%;
    li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: fit-content;
    }
`



const EditDependenciesTowardServices: React.FC<
                {allServices, component, updatedService}> = (
                {allServices, component, updatedService}
        ) => {

    const [edittedDependencies, updateDependencies] = useState<Component[]>([...component.dependencies])
    const availableServiceDependencies: Component[] = [...allServices].filter(s => 
        s.id != component.id && !edittedDependencies.map(component => component.id).includes(s.id)
    )
    
    const [selectedService, updateSelectedService] = useState<Component | null>(allServices[0])


    useEffect(() => {
        updatedService.dependencies = edittedDependencies
        if(availableServiceDependencies.length > 0){
            updateSelectedService(availableServiceDependencies[0])
        }
        else {
            updateSelectedService(null)
        }
    }, [edittedDependencies])


    const handleUpdateSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Component = allServices.find(component => idOfSelectedService === component.id)
        updateSelectedService(newSelectedService)
    }



    const handlePutEdittedServiceDependency = () => {
        if(selectedService !== null) {    
            const updatedEdittedDependencies: Component[] = [...edittedDependencies, selectedService]
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
            {allServices.length !== 0
                ?
                    <Select label="Legg til komponenter i område" onChange={handleUpdateSelectedService}>
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
                <Button variant="secondary" className="add-component" onClick={handlePutEdittedServiceDependency}>Legg til</Button>
            </div>

            <DependencyList>
                {edittedDependencies.length === 0
                ?
                    <>
                        Komponenten er ikke koblet mot noen tjenester
                    </>
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
        </DependenciesColumn>
    )
}





export default KomponentTable
