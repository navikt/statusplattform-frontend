import { BodyShort, Button, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup, Select, Textarea, TextField } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import styled from 'styled-components'
import DatePicker from "react-datepicker";
import { TitleContext } from "../../../components/ContextProviders/TitleContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"

import Layout from '../../../components/Layout'
import { OpsMessageI } from "../../../types/opsMessage"
import { RouterOpsMeldinger } from "../../../types/routes"
import { postOpsMessage } from "../../../utils/opsAPI"

import "react-datepicker/dist/react-datepicker.css";


const CreateOpsMessage = () => {
    const [opsMessage, setOpsMessage] = useState<OpsMessageI>({
        internalHeader: "",
        internalMessage: "",
        externalHeader: "",
        externalMessage: "",
        onlyShowForNavEmployees: true,
        isActive: true,
        affectedServices: [],
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        severity: "",
        state: ""
    })
    // EKSEMPEL: "2017-07-21T17:30:00Z"
    
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
    const [startDateForActiveOpsMessage, setStartDateForActiveOpsMessage] = useState(new Date())
    const router = useRouter()
    
    const hours=[]
    for(let i=0; i<24; i++) {
        if(i < 10){
            hours.push(`0${i}:00`)
        }
        else {
            hours.push(`${i}:00`)
        }
    }

    const {
        affectedServices,
        externalHeader,
        externalMessage,
        internalHeader,
        internalMessage,
        isActive,
        onlyShowForNavEmployees
    } = opsMessage

    if(!router.isReady) {
        return <CustomNavSpinner />
    }

    const handleIsInternal = () => {
        if(!opsMessage.onlyShowForNavEmployees) {
            setOpsMessage({...opsMessage,
                externalHeader: opsMessage.internalHeader,
                externalMessage: opsMessage.internalMessage
            })
        }
        setOpsMessage({...opsMessage, onlyShowForNavEmployees: !onlyShowForNavEmployees})
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
        }else {
            setOpsMessage({...opsMessage, isActive: false})
        }
    }

    

    return (
        <OpsContainer>
            <Heading size="xlarge" level="2">Opprett avviksmeldingen</Heading>

            <CheckboxGroup legend="Bare til interne?" onChange={() => handleIsInternal()}>
                <Checkbox 
                    value={onlyShowForNavEmployees ? "true" : "false"}
                    defaultChecked={onlyShowForNavEmployees}
                >
                </Checkbox>
            </CheckboxGroup>

            

            <div className="input-area">
                <TextField
                    label="Tittel for meldingen"
                    value={internalHeader}
                    onChange={(e) => setOpsMessage({...opsMessage, internalHeader: e.target.value})}
                />

                <Textarea
                    label="Intern melding"
                    value={internalMessage}
                    onChange={(e) => handleUpdateMessageToStaff(e.target.value)}
                />
            </div>

            {!onlyShowForNavEmployees &&
                <div className="input-area">
                    <TextField
                        label="Tittel for ekstern melding"
                        value={externalHeader}
                        onChange={(e) => setOpsMessage({...opsMessage, externalHeader: e.target.value})}
                    />
                    <Textarea
                        label="Ekstern melding"
                        value={externalMessage}
                        onChange={(e) => handleUpdateMessageToPublic(e.target.value)}
                    />
                </div>
            }

            <RadioGroup
                legend="Skal avviksmeldingen gjelde umiddelbart?"
                onChange = {(e) => handleIsActive(e)}
                defaultValue={isActive ? "1" : "0"}
            >
                <Radio value="1">
                    Nå
                </Radio>
                <Radio value="0">
                    Senere
                </Radio>
            </RadioGroup>

            {!isActive &&
                <div className="input-area">
                    <label htmlFor="#startDate"><b>Startdato</b></label>
                    <DatePicker
                        id="startDate"
                        selected={startDateForActiveOpsMessage}
                        onChange={(date:Date) => setStartDateForActiveOpsMessage(date)}
                    />

                    <div className="input-area">
                        <BodyShort><b>Startklokkeslett</b></BodyShort>
                        <Select
                            label="Timer"
                        >
                            {hours.map((i) => {
                                return <option key={i}>{i}</option>
                            })}
                        </Select>
                        <Select
                            label="Minutter"
                        >
                            <option value="00">00</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                        </Select>
                    </div>
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