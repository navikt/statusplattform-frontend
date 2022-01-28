import styled from 'styled-components'
import Head from 'next/head'
import router from 'next/router';
import { useContext, useEffect, useState } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoader } from '../../utils/useLoader';

import { Input } from 'nav-frontend-skjema';
import { Hovedknapp, Knapp  } from 'nav-frontend-knapper';
import { Expand, Notes } from '@navikt/ds-icons'
import { Button, Select } from '@navikt/ds-react';
import ModalWrapper from 'nav-frontend-modal';

import CustomNavSpinner from '../../components/CustomNavSpinner';
import { Service } from '../../types/navServices';
import { deleteService } from '../../utils/deleteService';
import { postService } from '../../utils/postService'
import { fetchServices } from '../../utils/fetchServices';
import { fetchTypes } from '../../utils/fetchTypes';
import { CloseCustomized, ModalInner } from '.';
import { updateService } from '../../utils/updateService';
import { TitleContext } from '../ContextProviders/TitleContext';

const TjenesteTableContainer = styled.div`
    .services-overflow-container {
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

const TjenesteHeader = styled.div`
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

    .tjeneste-header-content {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        gap: 5ch;
        span {
            width: 100%;
        }
    }
`

const TjenesteContent = styled.div`
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



const TjenesteTable = () => {
    const [expanded, toggleExpanded] = useState<string[]>([])
    const [addNewService, changeAddNewService] = useState(false)
    const [servicesToEdit, changeServicesToEdit] = useState<string[]>([])
    const [serviceToDelete, setServiceToDelete] = useState<Service>()
    const { data: services, isLoading: loadingServices, reload } = useLoader(fetchServices,[]);
    const { data: types, isLoading: loadingTypes, reload: reloadTypes } = useLoader(fetchTypes,[]);

    const { changeTitle } = useContext(TitleContext)
    
    useEffect(() => {
        changeTitle("Admin - Tjenester")
    })

    if(loadingServices || loadingTypes) {
        return (
            <CustomNavSpinner />
        )
    }
    
    const toggleExpandedFor = (serviceId) => {
        if(expanded.includes(serviceId)) {
            toggleExpanded([...expanded.filter(i => i !== serviceId)])
        } else {
            toggleExpanded([...expanded, serviceId])
        }
    }

    const toggleEditService = (service: Service) => {
        let edittingServices: string[] = [...servicesToEdit]
        if(edittingServices.includes(service.id)) {
            changeServicesToEdit(edittingServices.filter(d => d != service.id))
            return
        }
        edittingServices.push(service.id)
        changeServicesToEdit(edittingServices)
    }


    const confirmDeleteServiceHandler = () => {
        deleteService(serviceToDelete).then(() => {
            toast.info("Tjenesten ble slettet")
            setServiceToDelete(null);
            reload()
        }).catch(() => {
            toast.error("Kunne ikke slette tjenesten")
        })
    }



    return (
        <TjenesteTableContainer>
            <Head>
                <title>Admin - Tjenester</title>
            </Head>

            <ModalWrapper
                isOpen={!!serviceToDelete}
                onRequestClose={() => setServiceToDelete(null)}
                closeButton={true}
                contentLabel="Slettemodal"
            >
                <ModalInner>Ønsker du å slette tjenesten?
                    <Knapp mini onClick={confirmDeleteServiceHandler}>Slett tjeneste</Knapp>
                    <Knapp mini onClick={() => setServiceToDelete(null)}>Avbryt</Knapp>
                </ModalInner>
            </ModalWrapper>

            <div className="centered">
                <Button variant="secondary" 
                        onClick={() => router.push("/Admin/NewTjeneste")}>
                    <b>Legg til ny tjeneste</b>
                </Button>
            </div>

            {addNewService &&
                <AddNewService services={services} reload={reload}/>
            }

            <div className="services-overflow-container">
                <div>
                    <TjenesteHeader>
                        <div className="tjeneste-header-content">
                            <span>Navn</span>
                            <span>Type</span>
                            <span>Team</span>
                        </div>
                        <div className="empty-space"></div>
                    </TjenesteHeader>
                    {services.map( service => {
                        return (
                            <TjenesteContent key={service.id} className={servicesToEdit.includes(service.id) ? "editting" : ""}>
                                {!servicesToEdit.includes(service.id) 
                                    ?
                                        <ServiceRow 
                                            service={service}
                                            toggleEditService={() => toggleEditService(service)}
                                            toggleExpanded={() => toggleExpandedFor(service.id)}
                                            isExpanded={expanded.includes(service.id)}
                                            setServiceToDelete={() => setServiceToDelete(service)}
                                        />
                                    :
                                        <ServiceRowEditting 
                                            service={service}
                                            toggleEditService={() => toggleEditService(service)}
                                            toggleExpanded={() => toggleExpandedFor(service.id)}
                                            isExpanded={expanded.includes(service.id)}
                                            setServiceToDelete={() => setServiceToDelete(service)}
                                            allServices={services}
                                            reload={reload}
                                            types={types}
                                        />
                                }
                            </TjenesteContent>
                        )
                    })}
                </div>
            </div>
        </TjenesteTableContainer>
    )
}





/* ----------------- --------------------------------------------------- -----------------*/







const ServiceRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    
    div {
        display: flex;
        justify-content: space-between;
    }
`

const ServiceRowContent = styled.div`
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

        .service-row-element {
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

        .service-row-element {
            margin-right: 5ch;
            display: flex;
            flex-direction: column;
        }

        span:first-child {
            margin: 0 2rem;
        }
    }
`



interface ServiceRowProps {
    service: Service,
    allServices?: Service[],
    toggleEditService: (service) => void,
    toggleExpanded: (service) => void,
    isExpanded: boolean,
    setServiceToDelete: (service) => void,
    reload?: () => void
    types?: string[]
}

const ServiceRow = ({service, toggleEditService, toggleExpanded, isExpanded, setServiceToDelete }: ServiceRowProps) => {
    return (
        <ServiceRowContainer>
            <ServiceRowContent>
                <div className="top-row" onClick={() => toggleExpanded(service)}>
                    <div>
                        <span className="service-row-element">{service.name}</span>
                        <span className="service-row-element">{service.type}</span>
                        <span className="service-row-element">{service.team}</span>
                    </div>
                </div>
                {isExpanded &&
                    <div className="bottom-row" onClick={() => toggleExpanded(service)}>
                        <div className="dependencies"><p><b>Avhengigheter</b></p>
                            <ul>
                                {service.dependencies.map((dependency, index) => {
                                    return (
                                        <li key={index}>{dependency.name}</li>
                                        )
                                    })}
                            </ul>
                        </div>
                        <span className="service-row-element">
                            <p><b>Monitorlink</b></p>
                            <p>{service.monitorlink}</p>
                        </span>
                        <span className="service-row-element">
                            <p><b>PollingUrl</b></p>
                            <p>{service.pollingUrl}</p>
                        </span>
                    </div>
                }

            </ServiceRowContent>
            <div className="button-container">
                <CustomButton className="option" onClick={() => toggleEditService(service)}>
                    <Notes />
                </CustomButton>
                <button className="option" onClick={setServiceToDelete} aria-label="Slett tjeneste"><CloseCustomized /></button>
                <button className="option" onClick={() => toggleExpanded(service)}><Expand className={isExpanded ? "expanded" : "not-expanded"} aria-expanded={isExpanded} /></button>
            </div>
            
        </ServiceRowContainer>
    )
}







/* ----------------- --------------------------------------------------- -----------------*/







const ServiceRowEditting = ({ service, allServices, toggleEditService, toggleExpanded, isExpanded, setServiceToDelete, reload, types } : ServiceRowProps) => {
    const [updatedService, changeUpdatedService] = useState<Service>({
        id: service.id,
        name: service.name,
        type: service.type,
        team: service.team,
        dependencies: service.dependencies,
        monitorlink: service.monitorlink,
        pollingUrl: service.pollingUrl
    })

    const [selectedType, updateSelectedType] = useState<string>(service.type)




    const handleUpdatedService = (field: keyof typeof updatedService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const changedService = {
            ...updatedService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value        }
            
        changeUpdatedService(changedService)
    }

    const handleServiceTypeChange = (event) => {
        let currentService = {...updatedService}
        const typeChange: string = event.target.value
        updateSelectedType(typeChange)
        currentService.type = typeChange
        changeUpdatedService(currentService)
    }

    const handleSubmit = () => {
        updateService(updatedService).then(() => {
            reload()
            toast.success("Oppdatering gjennomført")
            toggleEditService(service)
        }).catch(() => {
            toast.error("Noe gikk galt i oppdatering av område")
        })
    }

    


    const { name, type, team, dependencies, monitorlink, pollingUrl } = updatedService

    return (
        <ServiceRowContainer>
            <ServiceRowContent>

                <div className="top-row" onClick={() => toggleExpanded(service)}>
                    <Input className="service-row-element editting" value={name} onChange={handleUpdatedService("name")} onClick={(event) => event.stopPropagation()} />
                    <Select label="Velg type" className="service-row-element editting" 
                        value={selectedType !== null ? selectedType : ""}
                        onChange={(event) => handleServiceTypeChange(event)}
                        onClick={(event) => event.stopPropagation()}
                    >
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


                    <Input className="service-row-element editting" value={team} onChange={handleUpdatedService("team")} onClick={(event) => event.stopPropagation()} />
                </div>


            {isExpanded &&
                        
                <div className="bottom-row">
                    <div className="dependencies"><p><b>Avhengigheter</b></p>

                        <EditTjenesteDependencies
                            allServices={allServices} service={service} updatedService={updatedService}
                        />
                    </div>
                    <span className="service-row-element editting">
                        <p><b>Monitorlink</b></p>
                        <Input value={monitorlink} onChange={handleUpdatedService("monitorlink")}/>
                    </span>
                    <span className="service-row-element editting">
                        <p><b>PollingUrl</b></p>
                        <Input value={pollingUrl} onChange={handleUpdatedService("pollingUrl")}/>
                    </span>
                </div>
            }
            </ServiceRowContent>

            
            <div className="button-container">
                <button type="button" className="option" onClick={handleSubmit}>
                    Lagre endringer
                </button>
                <CustomButton className="option" onClick={() => toggleEditService(service)}>
                    Avbryt endringer
                </CustomButton>
                <button className="option" onClick={setServiceToDelete} aria-label="Slett tjeneste"><CloseCustomized /></button>
                <button className="option" onClick={() => toggleExpanded(service)}><Expand className={isExpanded ? "expanded" : "not-expanded"} aria-expanded={isExpanded} /></button>
            </div>

        </ServiceRowContainer>
    )
}











/*----------------------------------------- HELPER FOR CODE ABOVE -----------------------------------------*/











const DependenciesColumn = styled.div`
    margin-right: 5ch;
    max-width: 242px;
    
    display: flex;
    flex-direction: column;

    .add-service {
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

const EditTjenesteDependencies: React.FC<
                {allServices, service, updatedService}> = (
                {allServices, service, updatedService}
        ) => {

    const [edittedDependencies, updateDependencies] = useState<Service[]>([...service.dependencies])
    const availableServiceDependencies: Service[] = [...allServices].filter(s => 
        s.id != service.id && !edittedDependencies.map(service => service.id).includes(s.id)
    )
    
    const [selectedService, updateSelectedService] = useState<Service | null>(allServices[0])


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
        const newSelectedService: Service = allServices.find(service => idOfSelectedService === service.id)
        updateSelectedService(newSelectedService)
    }



    const handlePutEdittedServiceDependency = () => {
        if(selectedService !== null) {    
            const updatedEdittedDependencies: Service[] = [...edittedDependencies, selectedService]
            updateDependencies(updatedEdittedDependencies)
            toast.success("Tjenesteavhengighet lagt til")
            return
        }
        toast.info("Ingen tjenester å legge til")
    }



    const handleRemoveEdittedServiceDependency = (service: Service) => {
        if(!edittedDependencies.includes(service)) {
            toast.error("Tjeneste eksisterer ikke i avhengighetene. Noe har gått galt med innlesingen")
            return
        }
        const updatedEdittedDependencies = edittedDependencies.filter(s => s.id != service.id)
        updateDependencies(updatedEdittedDependencies)
        toast.info("Avhengighet fjernet")
        
    }


    return (
        <DependenciesColumn>
            {allServices.length !== 0
                ?
                    <Select label="Legg til tjenester i område" onChange={handleUpdateSelectedService}>
                        {availableServiceDependencies.length > 0 ?
                        availableServiceDependencies.map(service => {
                            return (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            )
                        })
                        :
                            <option key={undefined} value={""}>Ingen tjeneste å legge til</option>
                        }
                    </Select>
                :
                    <>
                        Ingen tjeneste å legge til
                    </>
            }
            <Knapp className="add-service" mini onClick={handlePutEdittedServiceDependency}>Legg til avhengighet</Knapp>
            <DependencyList>
                {edittedDependencies.map((service) => {
                    return (
                        <li key={service.id}>{service.name} 
                            <CustomButton aria-label={"Fjern tjenesteavhengighet med navn " + service.name}
                                    onClick={() => handleRemoveEdittedServiceDependency(service)}>
                                <CloseCustomized/>
                            </CustomButton>
                        </li>
                    )
                })}
            </DependencyList>
        </DependenciesColumn>
    )
}








/* ----------------- --------------------------------------------------- -----------------*/





const AddNewServiceContainer = styled.div`
    .input-error {
        input {
            border: 1px solid red;
        }
    }
    .knapp {
        margin-top: 1rem;
        text-transform: none;
    }
`

const NewServiceRow = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`

const NewServiceColumn = styled.div`
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
`

interface AddServiceProps {
    services: Service[]
    reload: () => void
}

const AddNewService = ({services, reload}: AddServiceProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [editDependencies, changeEditDepencendyState] = useState<boolean>(false)
    const [selectedType, updateSelectedType] = useState<string>("KOMPONENT")
    const [types, updateTypes] = useState<string[]>()
    const [newService, updateNewService] = useState<Service>({
        id: "",
        name: "",
        type: "KOMPONENT",
        team: "",
        dependencies: [],
        monitorlink: "",
        pollingUrl: undefined
    })
    
    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const retrievedTypes: string[] = await fetchTypes()
            updateTypes(retrievedTypes)
            setIsLoading(false)
        })()
    }, [])


    if (isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    const handleDependencyChange = (newDependencies: Service[]) => {
        let currentService = {...newService}
        currentService.dependencies = newDependencies
        updateNewService(currentService)
    }
    
    const handleServiceDataChange = (field: keyof typeof newService) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        const currentService = {
            ...newService,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        updateNewService(currentService)
    }

    const handleServiceTypeChange = (event) => {
        let currentService = {...newService}
        const typeChange: string = event.target.value
        updateSelectedType(typeChange)
        currentService.type = typeChange
        updateNewService(currentService)
    }
    
    
    const handlePostService = (serviceToAdd: Service, event) => {
        event.preventDefault()
        const newlist = services.filter(service => service.id === serviceToAdd.name)
        if(newlist.length > 0) {
            toast.info("Denne IDen er allerede brukt. Velg en annen")
            return
        }
        postService(serviceToAdd).then(() => {
            reload()
            toast.success("Tjeneste ble lagt til")
        }).catch(() => {
            toast.warn("Tjeneste ble ikke lagt til")
        })
    }

    const toggleDependencyEditor = () => {
        changeEditDepencendyState(!editDependencies)
    }
    
    const { name, team, monitorlink, pollingUrl } = newService
    
    
    

    return (
        <AddNewServiceContainer key="input">

            <p>Felter markert med * er obligatoriske</p>


            <form id="form" onSubmit={(event) => handlePostService(newService, event)}>
                <NewServiceRow>



                    <NewServiceColumn>
                        <Input form="form" type="text" value={name} label="Navn" onChange={handleServiceDataChange("name")} placeholder="Navn"/>

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



                        <Input type="text" value={team} label="Team*" className={name.length == 0 ? "input-error" : ""} required onChange={handleServiceDataChange("team")} placeholder="Team*"/>

                    </NewServiceColumn>

                    <NewServiceColumn>
                        <Input type="text" value={monitorlink} label="Monitorlenke" onChange={handleServiceDataChange("monitorlink")} placeholder="Monitorlink"/>
                        <Input type="text" value={pollingUrl} label="PollingUrl" onChange={handleServiceDataChange("pollingUrl")} placeholder="PollingUrl" />
                    </NewServiceColumn>




                    <NewServiceColumn>
                        <div>
                            <Knapp htmlType="button" onClick={toggleDependencyEditor} >Endre avhengigheter</Knapp>
                            <ul>
                                {newService.dependencies.map(service => {
                                    <li>
                                        {service.name}
                                    </li>
                                })}
                            </ul>
                            {editDependencies && 
                                <NewTjenesteDependencyDropdown services={services} 
                                    handleDependencyChange={(dependencies) => handleDependencyChange(dependencies)} 
                                />
                            }
                        </div>
                    </NewServiceColumn>
                        


                </NewServiceRow>
                <Hovedknapp htmlType="submit">
                    Lagre ny tjeneste
                </Hovedknapp>

            </form>

        </AddNewServiceContainer>
    )
}





/* ----------------- --------------------------------------------------- -----------------*/





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

const EditDependeciesContainer = styled.div`
    min-width: 100px;
    max-width: fit-content;
    select {
        transform: translateY(-2px);
    }
`

interface DropdownProps {
    services: Service[]
    handleDependencyChange: (dependencies) => void
}

const NewTjenesteDependencyDropdown = ({services, handleDependencyChange}: DropdownProps) => {
    const [newServiceDependencies, setNewServiceDependencies] = useState<Service[]>([])
    
    const availableServiceDependencies: Service[] = [...services].filter(s => !newServiceDependencies.map(service => service.id).includes(s.id))
    const [selectedService, updateSelectedService] = useState<Service>(availableServiceDependencies[0])
    
    useEffect(() => {
        if(availableServiceDependencies.length > 0){
            updateSelectedService(availableServiceDependencies[0])
        }
        else {
            updateSelectedService(null)
        }
    }, [newServiceDependencies])

    const handlePutDependencyOnNewService = () => {
        if(selectedService !== null) {    
            const currentList: Service[] = [...newServiceDependencies, selectedService]
            setNewServiceDependencies(currentList)
            handleDependencyChange(newServiceDependencies)
            toast.success("Tjenesteavhengighet lagt til")
            return
        }
        toast.info("Ingen tjenester å legge til")
    }

    const handleRemoveServiceDependency = (serviceToRemove) => {
        const filteredDependencyList: Service[] = [...newServiceDependencies].filter(s => s.id !== serviceToRemove.id)
        setNewServiceDependencies(filteredDependencyList)
        handleDependencyChange(newServiceDependencies)
        toast.success("Tjenesteavhengighet fjernet")
    }


    const handleUpdateSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = services.find(service => idOfSelectedService === service.id)
        updateSelectedService(newSelectedService)
    }

    return (
        <EditDependeciesContainer>



            {services.length !== 0 ?
                <Select label="Legg til tjenesteavhengigheter" onChange={handleUpdateSelectedService}>
                    {availableServiceDependencies.length > 0
                    ?
                        availableServiceDependencies.map(service => {
                            return (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            )
                        })
                    :
                        <option key={undefined} value={""}>Ingen tjeneste å legge til</option>
                    }
                </Select>
                :
                    <>
                        Ingen tjeneste å legge til
                    </>
            }
        


            <Knapp htmlType="button" onClick={handlePutDependencyOnNewService}>Legg til avhengighet</Knapp>



            <DependencyList>
                {newServiceDependencies.map(service => {
                    return (
                        <li key={service.id}>{service.name} 
                            <CustomButton aria-label={"Fjern tjenesteavhengighet med navn " + service.name}>
                                <CloseCustomized onClick={() => handleRemoveServiceDependency(service)}/>
                            </CustomButton>
                        </li>
                    )
                })}
            </DependencyList>



        </EditDependeciesContainer>
    )
}





export default TjenesteTable
