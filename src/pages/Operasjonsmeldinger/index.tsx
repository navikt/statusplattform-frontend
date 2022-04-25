import { Button, Checkbox, CheckboxGroup, Heading, Textarea } from "@navikt/ds-react"
import { useState } from "react"
import { toast } from "react-toastify"
import styled from 'styled-components'

import Layout from '../../components/Layout'
import { OpsMessageI } from "../../types/opsMessage"
import { postOpsMessage } from "../../utils/opsAPI"


const OpsMessage = () => {

    const [opsMessage, setOpsMessage] = useState<OpsMessageI>({
        internalHeader: "",
        internalMessage: "",
        externalHeader: "",
        externalMessage: "",
        onlyShowForInternal: false,
        isActive: false,
        createdAt: "",
        closedAt: "",
        affectedServices: [],
    })

    const handleSubmitOpsMessage = () => {
        postOpsMessage(opsMessage).then(() => {
            toast.info("Meldingen er sendt inn")
        }).catch(() => {
            toast.error("Det oppstod en feil")
        })
        console.log("messageToStaff", opsMessage.internalMessage)
        console.log("messageToPublic", opsMessage.externalMessage)
    }


    return (
        <Layout>
            <OpsComponent 
                handleSubmitOpsMessage= {handleSubmitOpsMessage}
                opsMessage={opsMessage}
                setOpsMessage={(opsMessage) => setOpsMessage(opsMessage)}
            />
        </Layout>
    )
}




const OpsContainer = styled.div`
    display: flex;
    flex-direction: column;
    
    & > * {
        margin: 1rem;
    }
`



interface OpsProps {
    handleSubmitOpsMessage: () => void
    opsMessage: OpsMessageI
    setOpsMessage: (opsMessage: OpsMessageI) => void
}


const OpsComponent = ({handleSubmitOpsMessage, opsMessage, setOpsMessage}: OpsProps) => {

    const handleIsInternal = () => {
        setOpsMessage({...opsMessage, onlyShowForInternal: !opsMessage.onlyShowForInternal})
    }

    const handleUpdateMessageToStaff = (message: string) => {
        setOpsMessage({...opsMessage, internalMessage: message})
    }

    const handleUpdateMessageToPublic = (message: string) => {
        setOpsMessage({...opsMessage, externalMessage: message})
    }




    return (
        <OpsContainer>
            <Heading size="xlarge" level="2">Opprett driftsmelding</Heading>

            <CheckboxGroup legend="Bare til interne?" onChange={() => handleIsInternal()}>
                <Checkbox value={opsMessage.onlyShowForInternal ? "true" : "false"}>
                </Checkbox>
            </CheckboxGroup>

            <Textarea
                label="Intern melding"
                description="Informasjon til interne brukere"
                value={opsMessage.internalMessage}
                onChange={(e) => handleUpdateMessageToStaff(e.target.value)}
            />

            {!opsMessage.onlyShowForInternal &&
                <Textarea
                    label="Ekstern melding"
                    description="Informasjon til eksterne brukere"
                    value={opsMessage.externalMessage}
                    onChange={(e) => handleUpdateMessageToPublic(e.target.value)}
                />
            }

            <Button variant="primary" onClick={handleSubmitOpsMessage}>Send inn ny driftsmelding</Button>
        </OpsContainer>
    )
}

export default OpsMessage