import styled from 'styled-components'
import { useEffect, useState } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoader } from 'utils/useLoader';

import { Input, Select } from 'nav-frontend-skjema';
import { Hovedknapp, Knapp  } from 'nav-frontend-knapper';
import { Close } from '@navikt/ds-icons'
import CustomNavSpinner from 'components/CustomNavSpinner';

import { Service } from 'types/navServices';
import { deleteService } from 'utils/deleteService';
import { postService } from 'utils/postService'
import { fetchServices } from 'utils/fetchServices';
import { fetchTypes } from 'utils/fetchTypes';

const TjenesteTableContainer = styled.div`
    overflow-x: auto;
`

const TjenesteHeader = styled.div`
    padding: 1rem 0 1rem;
    padding-left: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: row;
    & > * {
        flex-basis: 10%;
        min-width: 120px;
        font-weight: bold;
    }
`

const TjenesteContent = styled.div`
    min-height: 5rem;
    padding-left: 1rem;
    background-color: var(--navGraBakgrunn);
    display: flex;
    * {
        min-width: 120px;
        flex-basis: 10%;
        padding-right: 0.5rem;
        word-break: break-all;
        display: flex;
        align-items: center;
    }
    &:last-child {
        flex-grow: 1;
    }
    button {
        background-color: transparent;
        border: none;
        :hover {
            cursor: pointer;
            color: grey;
        }
        flex-grow: 1;
        justify-content: flex-end;
    }
    border-top: 1px solid rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid rgba(0, 0, 0, 0.55);
    :last-child {
        padding-bottom: 0;
        padding-left: 1rem;
        border-bottom: 2px solid rgba(0, 0, 0, 0.55);
    }
`

const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`




const TjenesteTable = () => {
    const [addNewService, changeAddNewService] = useState(false)
    const { data: services, isLoading: loadingServices, reload } = useLoader(fetchServices,[]);

    if(loadingServices) {
        return (
            <CustomNavSpinner />
        )
    }

    const handleServiceDeletion = (serviceToDelete) => {

        deleteService(serviceToDelete).then(() => {
            toast.success('Tjeneste slettet');
            const newServices = services.filter(currentService => 
                currentService != serviceToDelete
            )
            reload()
            return
        }) .catch(() => {
            toast.error('Tjeneste kunne ikke slettes');
        })
    }
    

    

    return (
        <TjenesteTableContainer>

            <Knapp mini onClick={() => changeAddNewService(!addNewService)}>{addNewService == false ? "Legg til ny tjeneste" : "Avbryt ny tjeneste"}</Knapp>
            {addNewService &&
                <AddNewService services={services} reload={reload}/>
            }

            <div>
                <div>
                    <TjenesteHeader>
                        <span>Navn</span>
                        <span>Type</span>
                        <span>Team</span>
                        <span>Avhengigheter</span>
                        <span>Monitorlink</span>
                        <span>Beskrivelse</span>
                        <span>Logglink</span>
                    </TjenesteHeader>
                    {services.map( service => {
                        return (
                            <TjenesteContent key={service.id}>
                                <span>{service.name}</span>
                                <span>{service.type}</span>
                                <span>{service.team}</span>
                                <ul>
                                    {service.dependencies.map((dependency, index) => {
                                        return (
                                            <li key={index}>{dependency.name}</li>
                                        )
                                    })}
                                </ul>
                                <span>{service.monitorlink}</span>
                                <span>{service.description}</span>
                                <span>{service.logglink}</span>
                                <button><Close onClick={() => handleServiceDeletion(service)} /></button>
                            </TjenesteContent>
                        )
                    })}
                </div>
            </div>
        </TjenesteTableContainer>
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
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const NewServiceColumn = styled.div``

interface AddServiceProps {
    services: Service[]
    reload: () => void
}

const AddNewService = ({services, reload}: AddServiceProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [editDependencies, changeEditDepencendyState] = useState<boolean>(false)
    const [selectedType, updateSelectedType] = useState<string>("APPLIKASJON")
    const [types, updateTypes] = useState<string[]>()
    const [newService, updateNewService] = useState<Service>({
        id: "",
        name: "",
        type: "APPLIKASJON",
        team: "",
        dependencies: [],
        monitorlink: "",
        description: "",
        logglink: ""
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
    
    const { name, type, team, dependencies, monitorlink, description, logglink, status } = newService
    
    
    

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
                        {/* <Input form="form" type="text" value={dependencies} label="Avhengigheter" onChange={handleDependencyChange("dependencies")} placeholder="ID1, ID2, ID3..."/> */}
                    </NewServiceColumn>

                    <NewServiceColumn>
                        <Input type="text" value={monitorlink} label="Monitorlenke" onChange={handleServiceDataChange("monitorlink")} placeholder="Monitorlink"/>
                        <Input type="text" value={description} label="Beskrivelse" onChange={handleServiceDataChange("description")} placeholder="Beskrivelse"/>
                        <Input type="text" value={logglink} label="Logglenke" onChange={handleServiceDataChange("logglink")} placeholder="Logglink" />
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







const EditDependeciesContainer = styled.div`
    select {
        transform: translateY(-2px);
        min-width: 100px;
    }
    ul {
        list-style: none;
        padding: 0;
        width: 100%;
        li {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
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
                <Select onChange={handleUpdateSelectedService}>
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
        
            <Knapp htmlType="button" onClick={handlePutDependencyOnNewService}>Legg til avhengighet</Knapp>
            <ul>
                {newServiceDependencies.map(service => {
                    return (
                        <li key={service.id}>{service.name} <CloseCustomized onClick={() => handleRemoveServiceDependency(service)}/></li>
                    )
                })}
            </ul>
        </EditDependeciesContainer>
    )
}





export default TjenesteTable
