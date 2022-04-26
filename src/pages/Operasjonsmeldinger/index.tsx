import { Button, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup, Textarea, TextField } from "@navikt/ds-react"
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
        affectedServices: [],
    })

    const handleSubmitOpsMessage = () => {
        postOpsMessage(opsMessage).then(() => {
            toast.success("Driftsmelding opprettet er sendt inn")
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
    
    .input-area {
        width: 200px;
        
        & > * {
            margin: 1rem 0;
        }   
    }

    @media (min-width: 400px) {
        .input-area {
            width: 400px;
        }
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

    const handleIsActive = (newValue) => {
        if(newValue == "1") {
            setOpsMessage({...opsMessage, isActive: true})
        }
    }




    return (
        <OpsContainer>
            <Heading size="xlarge" level="2">Opprett driftsmelding</Heading>

            <CheckboxGroup legend="Bare til interne?" onChange={() => handleIsInternal()}>
                <Checkbox value={opsMessage.onlyShowForInternal ? "true" : "false"}>
                </Checkbox>
            </CheckboxGroup>

            <RadioGroup legend="Skal driftsmeldingen gjelde umiddelbart?" onChange = {(e) => handleIsActive(e)}>
                <Radio value="1">
                    Nå
                </Radio>
                <Radio value="0">
                    Senere
                </Radio>
            </RadioGroup>

            <div className="input-area">
                <TextField
                    label="Tittel for meldingen"
                    value={opsMessage.internalHeader}
                    onChange={(e) => setOpsMessage({...opsMessage, internalHeader: e.target.value})}
                />

                <Textarea
                    label="Intern melding"
                    value={opsMessage.internalMessage}
                    onChange={(e) => handleUpdateMessageToStaff(e.target.value)}
                />
            </div>

            {!opsMessage.onlyShowForInternal &&
                <div className="input-area">
                    <TextField
                        label="Tittel for ekstern melding"
                        value={opsMessage.externalHeader}
                        onChange={(e) => setOpsMessage({...opsMessage, externalHeader: e.target.value})}
                    />
                    <Textarea
                        label="Ekstern melding"
                        value={opsMessage.externalMessage}
                        onChange={(e) => handleUpdateMessageToPublic(e.target.value)}
                    />
                </div>
            }

            <Button variant="primary" onClick={handleSubmitOpsMessage}>Send inn ny driftsmelding</Button>
        </OpsContainer>
    )
}

export default OpsMessage