import { Back, EditFilled } from "@navikt/ds-icons"
import { BodyShort, Button, Checkbox, Heading, Select, TextField } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import internal from "stream"
import styled from "styled-components"
import { backendPath } from ".."
import { CloseCustomized } from "../../components/Admin"
import { BackButton } from "../../components/BackButton"
import { TitleContext } from "../../components/ContextProviders/TitleContext"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../components/CustomNavSpinner"
import Layout from "../../components/Layout"
import { Service } from "../../types/navServices"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterError, RouterOpsMeldinger } from "../../types/routes"
import { EndPathServices, EndPathSpecificOps } from "../../utils/apiHelper"
import { fetchSpecificOpsMessage } from "../../utils/opsAPI"
import { HorizontalSeparator } from "../Admin"



const OpsMessageContainer = styled.div`
    display: flex;
`

const BackButtonWrapper = styled.div`
    align-self: flex-start;
`


export const getServerSideProps = async (context) => {
    const { avviksmeldingId } = await context.query

    const [resOpsMsg, resServices] = await Promise.all([
        
        fetch(backendPath + EndPathSpecificOps(avviksmeldingId)),
        fetch(backendPath + EndPathServices())
    ])
    
    
    const opsMessage: OpsMessageI = await resOpsMsg.json()
    const retrievedServices: Service[] = await resServices.json()

    return {    
        props: {
            retrievedServices,
            opsMessage
        }
    }
}


const opsMessageDetails = ({opsMessage, retrievedServices}) => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(false)
    },[])

    if(isLoading) {
        return <CustomNavSpinner />
    }



    return (
        <Layout>
            <BackButtonWrapper>
                <BackButton />
            </BackButtonWrapper>
            <OpsMessageContainer>
                <Head>
                    <title>Avviksmelding - {opsMessage.internalHeader} - status.nav.no</title>
                </Head>
                <OpsMessageComponent opsMessage={opsMessage} services={retrievedServices} />
            </OpsMessageContainer>
        </Layout>
    )
}







const OpsContent = styled.div`
    background: #fff;
    padding: 3rem 5rem;
    border-radius: 0.5rem;

    display: flex;
    flex-direction: column;

    h2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`


interface OpsMessageComponentI {
    opsMessage: OpsMessageI
    services: Service[]
}

const OpsMessageComponent = ({opsMessage, services}: OpsMessageComponentI) => {
    const [isEditting, toggleIsEditting] = useState(false)

    const { name, navIdent } = useContext(UserStateContext)

    
    const { internalHeader } = opsMessage

    return (
        <OpsContent>
            
            <Heading spacing size="medium" level="2">
                Avviksmelding - {internalHeader} 
                <Button className="edit-button" variant="tertiary" onClick={() => toggleIsEditting(!isEditting)}>
                    <EditFilled/>
                </Button>
            </Heading>

            {!isEditting
                ?
                    <DetailsOfOpsMessage opsMessage={opsMessage} navIdent={navIdent} />
                :
                    <EditOpsMessage opsMessage={opsMessage} navIdent={navIdent} services={services} />
            }

            

        </OpsContent>
    )
}




interface DetailsOpsMsgI {
    opsMessage: OpsMessageI
    navIdent: string
}

const DetailsOfOpsMessage = ({opsMessage, navIdent}: DetailsOpsMsgI) => {
    const { externalHeader, externalMessage, internalHeader, internalMessage, affectedServices, isActive, onlyShowForNavEmployees, startDate, startTime, endDate, endTime } = opsMessage
    
    return (
        <>
            {navIdent &&
                <div>
                    <BodyShort spacing>
                        {internalHeader}
                        {internalMessage}
                    </BodyShort>
                </div>
            }
 
            <div>
                {externalHeader}
                {externalMessage}
            </div>

            <HorizontalSeparator />

            <Heading size="small" level="3">Ytterligere detaljer</Heading>
            {navIdent &&
                <>  
                    <ul>
                        <li>
                            Er den aktiv: {isActive ? "Ja" : "Nei"}
                        </li>
                        <li>
                            Vises bare for ansatte: {onlyShowForNavEmployees ? "Ja" : "Nei"}
                        </li>
                    </ul>

                    {startDate &&
                        <ul>
                            
                            <li>
                                Startdato: {startDate}
                            </li>
                            <li>
                                Klokkeslett: {startTime}
                            </li>
                        </ul>
                    }

                    {endDate &&
                        <ul>
                            <li>
                                Sluttdato: {endDate}
                            </li>
                            <li>
                                Klokkeslett: {endTime}
                            </li>
                        </ul>
                    }

                </>
            }

            <b>Tilknyttede tjenester:</b>
            {affectedServices.length > 0 &&
                <ul>
                    {affectedServices.map((service) => {
                        return (
                            <li key={service.id}>{service.name}</li>
                        )
                    })}
                </ul>
            }
        </>
    )
}










const EditOpsMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .section {
        margin: 1rem 0;
    }
    .section:last-child{
        margin-bottom: 0;
    }
`




interface EditOpsMessageI {
    opsMessage: OpsMessageI
    navIdent: string
    services: Service[]
}


const EditOpsMessage = ({opsMessage, navIdent, services}: EditOpsMessageI) => {
    const [isLoading, setIsLoading] = useState(true)
    const [updatedOpsMessage, changeUpdatedOpsMessage] = useState<OpsMessageI>({
        ...opsMessage
    })

    const router = useRouter()

    useEffect(() => {
        setIsLoading
        if(navIdent) {
            setIsLoading(false)
            return
        }
        else {
            if(router.isReady) {
                router.push(RouterError.PATH)
            }
        }
    }, [])

    if(isLoading) {
        return <CustomNavSpinner />
    }
    
    const { externalHeader, externalMessage, internalHeader, internalMessage, affectedServices, isActive, onlyShowForNavEmployees, startDate, startTime, endDate, endTime } = updatedOpsMessage

    const updateOpsMessage = (field: keyof typeof updatedOpsMessage) => (evt: React.ChangeEvent<HTMLInputElement>) =>  {
        const newOpsMessage: OpsMessageI = {
            ...updatedOpsMessage,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        changeUpdatedOpsMessage(newOpsMessage)
    }

    const handleUpdateOpsMessageAffectedServices = (newOps: OpsMessageI) => {
        changeUpdatedOpsMessage(newOps)
    }


    return (
        <EditOpsMessageContainer>
            <div className="section">
                <Heading size="medium" level="3">Intern beskjed</Heading>
                <TextField label="Intern header" value={internalHeader} onChange={updateOpsMessage("internalHeader")} /> 
                <TextField label="Intern beskjed" value={internalMessage} onChange={updateOpsMessage("internalMessage")} />
            </div>

            <div className="section">
                <Heading size="medium" level="3">Ekstern beskjed</Heading>
                <TextField label="Ekstern header" value={externalHeader} onChange={updateOpsMessage("externalHeader")} />
                <TextField label="Ekstern beskjed" value={externalMessage} onChange={updateOpsMessage("externalMessage")} />
            </div>


            <ModifyAffectedServices opsMessageToUpdate={updatedOpsMessage} handleUpdateOpsMessageAffectedServices={(newOps) => handleUpdateOpsMessageAffectedServices(newOps)} services={services} />


            <div className="section">
                <Heading size="medium" level="3">Ytterligere detaljer</Heading>
                <Checkbox checked={isActive} onChange={() => changeUpdatedOpsMessage({...updatedOpsMessage, isActive: !updatedOpsMessage.isActive})} >
                    Er den aktiv?
                </Checkbox>
                <Checkbox checked={onlyShowForNavEmployees} onChange={() => changeUpdatedOpsMessage({...updatedOpsMessage, onlyShowForNavEmployees: !updatedOpsMessage.onlyShowForNavEmployees})} >
                    Vises bare for ansatte?
                </Checkbox>
            </div>

            {/* <div className="section">
                <Heading size="medium" level="3">Startdato</Heading>
                <TextField label="Dato" type="date" value={} onChange={updateOpsMessage("startDate")} />
                <TextField label="Klokkeslett" type="time" value={} onChange={updateOpsMessage("startTime")} />
            </div> */}
            
        </EditOpsMessageContainer>
    )
}





const EditAffectedServicesContainer = styled.div`
    display: flex;
    flex-direction: column;

    button {
        background: none;
        border: none;
    }
`

interface ModifyAffectedServicesI {
    opsMessageToUpdate: OpsMessageI
    handleUpdateOpsMessageAffectedServices: (updatedOpsMsg: OpsMessageI) => void
    services: Service[]
}





const ModifyAffectedServices = ({opsMessageToUpdate, handleUpdateOpsMessageAffectedServices, services}: ModifyAffectedServicesI) => {

    const addNewAffectedServices = (service: Service) => {
        if(opsMessageToUpdate.affectedServices.map(s => s.id).includes(service.id)) {
            toast.error("Tjeneste fins allerede på avviksmeldingen. Noe har gått galt.")
            return
        }
        const adjustedServices: Service[] = [...opsMessageToUpdate.affectedServices, service]
        const updatedOpsMessage: OpsMessageI = {...opsMessageToUpdate, affectedServices: adjustedServices}
        handleUpdateOpsMessageAffectedServices(updatedOpsMessage)
    }

    const deleteFromAffectedServices = (service: Service) => {
        if(!opsMessageToUpdate.affectedServices.map(s =>  s.id).includes(service.id)) {
            toast.error("Ser ut som tjenesten du prøver å fjerne ikke fins på avviksmeldingen. Noe har gått galt.")
            return
        }
        const adjustedServices: Service[] = [...opsMessageToUpdate.affectedServices.filter(s => s.id != service.id)]
        const updatedOpsMessage: OpsMessageI = {...opsMessageToUpdate, affectedServices: adjustedServices}
        handleUpdateOpsMessageAffectedServices(updatedOpsMessage)
    }

    const handleNewServiceToDelete = (selectedService: Service) => {
        if(!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        deleteFromAffectedServices(selectedService)
    }


    return (
        <EditAffectedServicesContainer className="section">
            {opsMessageToUpdate.affectedServices.length == 0
            ?
                <BodyShort>
                    Ingen tjenester er knyttet til avviksmeldingen
                </BodyShort>
            :
                <BodyShort>
                    <b>Tilknyttede tjenester mot avviksmeldingen:</b>
                    <ul>
                        {opsMessageToUpdate.affectedServices.map((service) => {
                            return (
                                <li key={service.id}>
                                    {service.name}
                                    <button onClick={() => handleNewServiceToDelete(service)}>
                                        <CloseCustomized />
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </BodyShort>
            }

            <SelectAffectedServicesComponent
                opsMessageToUpdate={opsMessageToUpdate}
                allServices={services}
                addNewAffectedServices={(serviceToAdd: Service) => addNewAffectedServices(serviceToAdd)}
            />

            
        </EditAffectedServicesContainer>
    )
}





const SelectAndAddServiceComponent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    select:hover {
        cursor: pointer;
    }
`

interface SelectAffectedServicesI {
    opsMessageToUpdate: OpsMessageI
    allServices: Service[]
    addNewAffectedServices: (serviceToAdd) => void
}

const SelectAffectedServicesComponent = ({opsMessageToUpdate, allServices, addNewAffectedServices}: SelectAffectedServicesI) => {
    const availableServices: Service[] = allServices.filter((service) => !opsMessageToUpdate.affectedServices.map(s => s.id).includes(service.id))
    const [selectedService, updateSelectedService] = useState<Service | null>(() => availableServices.length > 0 ? availableServices[0] : null)


    useEffect(() => {
        if(availableServices.length > 0){
            updateSelectedService(availableServices[0])
        }
        else {
            updateSelectedService(null)
        }
    }, [allServices, availableServices])

    const handleNewSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = availableServices.find(service => idOfSelectedService === service.id)
        updateSelectedService(newSelectedService)
    }


    const handleNewServiceToAdd = (selectedService: Service) => {
        if(!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        addNewAffectedServices(selectedService)
    }


    return (
        <SelectAndAddServiceComponent>
            <Select
                hideLabel
                label="Liste av tjenester"
                value={selectedService !== null ? selectedService.id : ""}
                onChange={handleNewSelectedService}
            >
                {availableServices.length > 0
                ?
                    availableServices.map(service => {
                        return (
                            <option key={service.id} value={service.id}>{service.name}</option>
                        )
                    })
                :
                    <option key={undefined} value={""}>Ingen tjeneste å legge til</option>
                }
            </Select>

            <div>
                <Button variant="secondary" type="button" onClick={() => handleNewServiceToAdd(selectedService)}> Legg til</Button>
            </div>
        </SelectAndAddServiceComponent>
    )
}



export default opsMessageDetails