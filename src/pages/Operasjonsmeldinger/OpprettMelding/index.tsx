import { Button, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup, Textarea, TextField } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import styled from 'styled-components'
import { TitleContext } from "../../../components/ContextProviders/TitleContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"

import Layout from '../../../components/Layout'
import { OpsMessageI } from "../../../types/opsMessage"
import { RouterOpsMeldinger } from "../../../types/routes"
import { postOpsMessage } from "../../../utils/opsAPI"


const CreateOpsMessage = () => {
    const [opsMessage, setOpsMessage] = useState<OpsMessageI>({
        internalHeader: "",
        internalMessage: "",
        externalHeader: "",
        externalMessage: "",
        onlyShowForNavEmployees: false,
        isActive: false,
        affectedServices: [],
    })

    const [isLoading, setIsLoading] = useState(true)
    
    const { changeTitle } = useContext(TitleContext)
    const router = useRouter()

    useEffect(() => {
        setIsLoading(true)
        if(router.isReady) {
            changeTitle("Opprett avviksmelding - status.nav.no")
            setIsLoading(false)
        }
    }, [router])


    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }
    

    const handleSubmitOpsMessage = () => {
        postOpsMessage(opsMessage).then(() => {
            toast.success("Avviksmelding opprettet er sendt inn")
        }).catch(() => {
            toast.error("Det oppstod en feil")
        })
        .finally(() => {
            router.push(RouterOpsMeldinger.PATH)
        })
    }


    return (
        <Layout>
            <Head>
                <title>Opprett avviksmelding - status.nav.no</title>
            </Head>
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

    .button-container {
        display: flex;
        justify-content: space-between;
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
    const router = useRouter()

    if(!router.isReady) {
        return <CustomNavSpinner />
    }

    const handleIsInternal = () => {
        setOpsMessage({...opsMessage, onlyShowForNavEmployees: !opsMessage.onlyShowForNavEmployees})
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
            <Heading size="xlarge" level="2">Opprett avviksmeldingen</Heading>

            <CheckboxGroup legend="Bare til interne?" onChange={() => handleIsInternal()}>
                <Checkbox value={opsMessage.onlyShowForNavEmployees ? "true" : "false"}>
                </Checkbox>
            </CheckboxGroup>

            <RadioGroup legend="Skal avviksmeldingen gjelde umiddelbart?" onChange = {(e) => handleIsActive(e)}>
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

            {!opsMessage.onlyShowForNavEmployees &&
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
            
            <div className="button-container">
                <Button variant="secondary" onClick={() => router.push(RouterOpsMeldinger.PATH)}>Avbryt</Button>
                <Button variant="primary" onClick={handleSubmitOpsMessage}>Send inn ny avviksmelding</Button>
            </div>
        </OpsContainer>
    )
}


export default CreateOpsMessage