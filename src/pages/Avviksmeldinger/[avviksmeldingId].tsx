import { Back, EditFilled } from "@navikt/ds-icons"
import { BodyShort, Button, Checkbox, Heading, TextField } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import internal from "stream"
import styled from "styled-components"
import { TitleContext } from "../../components/ContextProviders/TitleContext"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../components/CustomNavSpinner"
import Layout from "../../components/Layout"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterOpsMeldinger } from "../../types/routes"
import { EndPathSpecificOps } from "../../utils/apiHelper"
import { fetchSpecificOpsMessage } from "../../utils/opsAPI"
import { HorizontalSeparator } from "../Admin"



const OpsMessageContainer = styled.div`
    display: flex;
`

const BackButtonWrapper = styled.div`
    align-self: flex-start;
`

const opsMessageDetails = () => {
    const router = useRouter()
    const [opsMessage, setOpsMessage] = useState<OpsMessageI>()
    const [isLoading, setIsLoading] = useState(true)
    const { changeTitle } = useContext(TitleContext)

    if(!router.isReady) {
        return <CustomNavSpinner />
    }

    useEffect(() => {
        setIsLoading(true)
        async function fetchOpsMessage (id: string) {
            await fetchSpecificOpsMessage(id).then((response) => {
                setOpsMessage(response)
                changeTitle("Avviksmelding " + response.id)
            }).catch((e) => {
                toast.error("Noe gikk galt ved henting av avviksmelding.")
            })
        }
        if(router.isReady) {
            const opsId = router.query.avviksmeldingId
            fetchOpsMessage(String(opsId)).then(() => setIsLoading(false))
        }
    },[])

    if(isLoading) {
        return <CustomNavSpinner />
    }

    return (
        <Layout>
            <BackButtonWrapper>
                <Button variant="secondary" onClick={() => router.push(RouterOpsMeldinger.PATH)}><Back/>Tilbake til menyen</Button>
            </BackButtonWrapper>
            <OpsMessageContainer>
                <Head>
                    <title>Avviksmelding - {opsMessage.internalHeader} - status.nav.no</title>
                </Head>
                <OpsMessageComponent opsMessage={opsMessage} />
            </OpsMessageContainer>
        </Layout>
    )
}







const OpsContent = styled.div`
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;

    display: flex;
    flex-direction: column;

    .edit-button {
        align-self: flex-end;
    }
`

const OpsMessageComponent: React.FC<{opsMessage: OpsMessageI}> = ({opsMessage}) => {
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
                    <EditOpsMessage opsMessage={opsMessage} navIdent={navIdent} />
            }

            

        </OpsContent>
    )
}

const DetailsOfOpsMessage: React.FC<{opsMessage: OpsMessageI, navIdent: string}> = ({opsMessage, navIdent}) => {
    const { externalHeader, externalMessage, internalHeader, internalMessage, affectedServices, isActive, onlyShowForNavEmployees, startDate, startTime, endDate, endTime } = opsMessage
    
    return (
        <>
            {
                <div>
                    <BodyShort spacing>
                        {internalHeader}
                        {internalMessage}
                    </BodyShort>
                </div>
            }

            {(externalHeader.length > 0 && externalMessage.length > 0) && 
                <div>
                    {externalHeader}
                    {externalMessage}
                </div>
            }

            <HorizontalSeparator />

            <Heading size="small" level="3">Ytterligere detaljer</Heading>
            <ul>
                <li>
                    Er den aktiv: {isActive ? "Ja" : "Nei"}
                </li>
                <li>
                    Vises bare for ansatte: {onlyShowForNavEmployees ? "Ja" : "Nei"}
                </li>
            </ul>

            <ul>
                <li>
                    Startdato: {startDate}
                </li>
                <li>
                    Klokkeslett: {startTime}
                </li>
            </ul>

            <ul>
                <li>
                    Sluttdato: {endDate}
                </li>
                <li>
                    Klokkeslett: {endTime}
                </li>
            </ul>

            {affectedServices.length > 0 &&
                <ul>
                    Tilknyttede tjenester: {affectedServices.map((service) => {
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
    .section {
        margin: 1rem 0;
    }
    .section:last-child{
        margin-bottom: 0;
    }
`



const EditOpsMessage: React.FC<{opsMessage: OpsMessageI, navIdent: string}> = ({opsMessage, navIdent}) => {
    const [updatedOpsMessage, changeUpdatedOpsMessage] = useState<OpsMessageI>({
        ...opsMessage
    })
    
    const { externalHeader, externalMessage, internalHeader, internalMessage, affectedServices, isActive, onlyShowForNavEmployees, startDate, startTime, endDate, endTime } = updatedOpsMessage

    const updateOpsMessage = (field: keyof typeof updatedOpsMessage) => (evt: React.ChangeEvent<HTMLInputElement>) =>  {
        const newOpsMessage: OpsMessageI = {
            ...updatedOpsMessage,
            [field]: evt.target.getAttribute("type") === "number" ? parseInt(evt.target.value) : evt.target.value
        }
        changeUpdatedOpsMessage(newOpsMessage)
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


export default opsMessageDetails