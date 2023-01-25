import {
    Alert,
    Button,
    Tooltip,
    Heading,
    Radio,
    RadioGroup,
    Select,
    Textarea,
    TextField,
} from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState, useRef } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { TitleContext } from "../../../components/ContextProviders/TitleContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"
import TextEditor from "../../../components/TextEditor"
import Layout from "../../../components/Layout"
import { OpsMessageI, SeverityEnum } from "../../../types/opsMessage"
import { RouterOpsMeldinger } from "../../../types/routes"
import { postOpsMessage } from "../../../utils/opsAPI"
import { OpsScheme, Spacer } from "../../../styles/styles"
import "react-datepicker/dist/react-datepicker.css"
import { Service } from "../../../types/types"
import { backendPath } from "../.."
import { EndPathServices } from "../../../utils/apiHelper"
import { Copy } from "@navikt/ds-icons"
import { CloseCustomized, HorizontalSeparator } from "../../Admin"
import DateSetterOps from "../../../components/DateSetterOps"
import { cursorTo } from "readline"

export const getServerSideProps = async () => {
    const res = await fetch(backendPath + EndPathServices())
    const services = await res.json()

    return {
        props: {
            services,
        },
    }
}

const CreateOpsMessage = ({ services }) => {
    const [opsMessage, setOpsMessage] = useState<OpsMessageI>({
        internalHeader: "",
        internalMessage: "",
        externalHeader: "",
        externalMessage: "",
        onlyShowForNavEmployees: true,
        isActive: true,
        affectedServices: [],
        startTime: new Date(),
        endTime: new Date(),
        severity: SeverityEnum.NEUTRAL,
        state: "",
    })
    // EKSEMPEL: "2017-07-21T17:30:00Z"

    const [isLoading, setIsLoading] = useState(true)

    const { changeTitle } = useContext(TitleContext)
    const router = useRouter()

    useEffect(() => {
        setIsLoading(true)
        if (router.isReady) {
            changeTitle("Opprett driftsmelding - status.nav.no")
            setIsLoading(false)
        }
    }, [router])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const handleSubmitOpsMessage = () => {
        // console.log(opsMessage)
        postOpsMessage(opsMessage)
            .then(() => {
                toast.success("Driftsmelding opprettet")
            })
            .catch(() => {
                toast.error("Det oppstod en feil")
            })
            .finally(() => {
                router.push(RouterOpsMeldinger.PATH)
            })
    }

    return (
        <Layout>
            <Head>
                <title>Opprett driftsmelding - status.nav.no</title>
            </Head>
            <OpsComponent
                handleSubmitOpsMessage={handleSubmitOpsMessage}
                opsMessage={opsMessage}
                setOpsMessage={(opsMessage) => setOpsMessage(opsMessage)}
                services={services}
            />
        </Layout>
    )
}

const CopyOpsMsg = styled.div`
    display: inline-block;
    position: absolute;
    margin: -3.5px 0 0 8.5rem;
`

const AutomaticTimeAlert = styled.div`
    width: 35rem;
    margin: 0 0 2rem 0;
`

interface OpsProps {
    handleSubmitOpsMessage: () => void
    opsMessage: OpsMessageI
    setOpsMessage: (opsMessage: OpsMessageI) => void
    services: Service[]
}

const options = ["00", "15", "30", "45"]

var currentTime = new Date()
var endTime = new Date()
currentTime.setDate(currentTime.getDate())
endTime.setDate(endTime.getDate() + 14)

const OpsComponent = ({
    handleSubmitOpsMessage,
    opsMessage,
    setOpsMessage,
    services,
}: OpsProps) => {
    const [startDateForActiveOpsMessage, setStartDateForActiveOpsMessage] =
        useState<Date>(currentTime)

    const [endDateForActiveOpsMessage, setEndDateForActiveOpsMessage] =
        useState<Date>(endTime)

    const [isLoading, setIsLoading] = useState(true)
    const [selectedSeverity, setSelectedSeverity] = useState<string>("NEUTRAL")
    const [showAutomaticTimeMsg, setShowAutomaticTimeMsg] = useState(true)
    const router = useRouter()
    const createMsgRef = useRef(null)
    const hours = []
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            hours.push(`0${i}:00`)
        } else {
            hours.push(`${i}:00`)
        }
    }

    useEffect(() => {
        setOpsMessage({
            ...opsMessage,
            startTime: startDateForActiveOpsMessage,
            endTime: endDateForActiveOpsMessage,
        })
    }, [startDateForActiveOpsMessage, endDateForActiveOpsMessage])

    useEffect(() => {
        setIsLoading(true)
        setIsLoading(false)
    }, [opsMessage])

    const {
        affectedServices,
        externalHeader,
        externalMessage,
        internalHeader,
        internalMessage,
        isActive,
        onlyShowForNavEmployees,
    } = opsMessage

    if (!router.isReady || isLoading) {
        return <CustomNavSpinner />
    }

    const handleUpdateAffectedServices = (newServices: Service[]) => {
        setOpsMessage({ ...opsMessage, affectedServices: newServices })
    }

    const handleIsInternal = (newValue) => {
        console.log(onlyShowForNavEmployees)
        if (newValue == "Internal") {
            setOpsMessage({
                ...opsMessage,
                onlyShowForNavEmployees: true,
                externalHeader: internalHeader,
                externalMessage: internalMessage,
            })
        } else {
            setOpsMessage({
                ...opsMessage,
                onlyShowForNavEmployees: false,
            })
        }
    }

    const handleUpdateMessageInternal = (message: string) => {
        if (message.length < 501) {
            setOpsMessage({ ...opsMessage, internalMessage: message })
        }
    }

    const handleUpdateMessageExternal = (message: string) => {
        if (message.length < 501) {
            setOpsMessage({ ...opsMessage, externalMessage: message })
        }
    }

    const handleCopyInternal = (title: string, message: string) => {
        if (message.length < 501) {
            setOpsMessage({
                ...opsMessage,
                externalHeader: title,
                externalMessage: message,
            })
        }
    }

    const handleIsActive = (newValue) => {
        if (newValue == "1") {
            var currentTime = new Date()
            var endTime = new Date()
            currentTime.setDate(currentTime.getDate())
            endTime.setDate(endTime.getDate() + 14)
            console.log("starttime " + currentTime + " endtime " + endTime)
            setStartDateForActiveOpsMessage(currentTime)
            setEndDateForActiveOpsMessage(endTime)
            setShowAutomaticTimeMsg(true)
            setOpsMessage({
                ...opsMessage,
                startTime: currentTime,
                endTime: endTime,
                isActive: true,
            })
        } else {
            setShowAutomaticTimeMsg(false)
            setOpsMessage({ ...opsMessage, isActive: false })
        }
    }

    const handleUpdateSelectedSeverity = (event) => {
        const newSelectedSeverity: SeverityEnum = event.target.value
        setSelectedSeverity(newSelectedSeverity)
        setOpsMessage({ ...opsMessage, severity: newSelectedSeverity })
    }

    const handleUpdateStartDate = (event) => {
        const dateInput: Date = new Date(event)
        setStartDateForActiveOpsMessage(dateInput)
    }

    const handleUpdateStartMinutes = (event) => {
        const newDate: Date = new Date(startDateForActiveOpsMessage)
        newDate.setMinutes(parseInt(event.target.value))
        setStartDateForActiveOpsMessage(newDate)
    }

    const handleUpdateStartHours = (event) => {
        const newDate: Date = new Date(startDateForActiveOpsMessage)
        newDate.setHours(parseInt(event.target.value))
        setStartDateForActiveOpsMessage(newDate)
    }

    const handleUpdateEndDate = (event) => {
        const dateInput: Date = new Date(event)
        setEndDateForActiveOpsMessage(dateInput)
    }

    const handleUpdateEndMinutes = (event) => {
        const newDate: Date = new Date(endDateForActiveOpsMessage)
        newDate.setMinutes(parseInt(event.target.value))
        setEndDateForActiveOpsMessage(newDate)
    }

    const handleUpdateEndHours = (event) => {
        const newDate: Date = new Date(endDateForActiveOpsMessage)
        newDate.setHours(parseInt(event.target.value))
        setEndDateForActiveOpsMessage(newDate)
    }

    return (
        <OpsScheme className={selectedSeverity.toLowerCase()}>
            <Heading size="large" level="3">
                Opprett driftsmelding
            </Heading>

            <Spacer height="0.5rem" />

            <div className="input-area">
                <Select
                    label="Velg alvorlighetsgrad:"
                    value={selectedSeverity !== null ? selectedSeverity : ""}
                    onChange={handleUpdateSelectedSeverity}
                >
                    <option value="NEUTRAL">Nøytral - Blå</option>
                    <option value="ISSUE">Middels - Gul</option>
                    <option value="DOWN">Høy - Rød</option>
                </Select>
            </div>

            <Spacer height="0.5rem" />

            <RadioGroup
                legend="Velg synlighet:"
                onChange={(e) => handleIsInternal(e)}
                defaultValue={"Internal"}
            >
                <Radio value="Internal">Kun interne brukere</Radio>
                <Radio value="Public">Interne og eksterne brukere</Radio>
            </RadioGroup>

            <div className="input-area">
                <Heading level="5" size="xsmall">
                    Intern melding:
                </Heading>
                <TextField
                    label="Tittel:"
                    value={internalHeader}
                    onChange={(e) =>
                        setOpsMessage({
                            ...opsMessage,
                            internalHeader: e.target.value,
                        })
                    }
                    maxLength={100}
                />

                <TextEditor
                    ref={createMsgRef}
                    isInternal={true}
                    initialValue={internalMessage}
                    title="Innhold:"
                    handleUpdateInternalMsg={handleUpdateMessageInternal}
                />

                {/*
                <Textarea
                    label="Innhold:"
                    value={internalMessage}
                    onChange={(e) =>
                        handleUpdateMessageInternal(e.target.value)
                    }
                    maxLength={500}
                />*/}
            </div>

            {!onlyShowForNavEmployees && (
                <div className="input-area">
                    <div>
                        {/* --gjør denne synlig igjen når tekst kan kopieres
                        
                        <CopyOpsMsg>
                            <Tooltip
                                content="Kopier intern melding"
                                placement="right"
                            >
                                <Button
                                    size="small"
                                    variant="tertiary"
                                    title="Kopier interntekst"
                                    onClick={() => {
                                        handleCopyInternal(
                                            internalHeader,
                                            internalMessage
                                        )
                                    }}
                                >
                                    <Copy />
                                </Button>
                            </Tooltip>
                        </CopyOpsMsg>*/}

                        <Heading level="5" size="xsmall">
                            Ekstern melding:
                        </Heading>
                    </div>
                    <TextField
                        label="Tittel:"
                        value={externalHeader}
                        onChange={(e) =>
                            setOpsMessage({
                                ...opsMessage,
                                externalHeader: e.target.value,
                            })
                        }
                    />
                    <TextEditor
                        ref={createMsgRef}
                        isInternal={true}
                        initialValue={externalMessage}
                        title="Innhold:"
                        handleUpdateInternalMsg={handleUpdateMessageExternal}
                    />
                </div>
            )}

            <AffectedServicesComponent
                handleUpdateAffectedServices={handleUpdateAffectedServices}
                opsMessage={opsMessage}
                services={services}
            />
            <Spacer height="1rem" />

            <RadioGroup
                legend="Sett varighet: "
                onChange={(e) => handleIsActive(e)}
                defaultValue={"1"}
            >
                <Radio value="1">
                    <div>Automatisk</div>
                </Radio>
                <Radio value="0">Tilpasset ...</Radio>
            </RadioGroup>
            <Spacer height="1rem" />

            {showAutomaticTimeMsg && (
                <AutomaticTimeAlert>
                    <Alert
                        variant="info"
                        size="small"
                    >{`Driftsmeldingen gjøres aktiv umiddelbart, og forblir aktiv i 14 dager. Driftsmeldingen blir inaktiv ${endDateForActiveOpsMessage.toLocaleDateString(
                        "nb",
                        {
                            month: "long",
                            weekday: "long",
                            day: "numeric",
                            year: "numeric",
                        }
                    )}.`}</Alert>
                </AutomaticTimeAlert>
            )}

            {!isActive && (
                <DateSetterOps
                    startDateForActiveOpsMessage={startDateForActiveOpsMessage}
                    endDateForActiveOpsMessage={endDateForActiveOpsMessage}
                    handleUpdateStartDate={handleUpdateStartDate}
                    handleUpdateStartHours={handleUpdateStartHours}
                    handleUpdateStartMinutes={handleUpdateStartMinutes}
                    handleUpdateEndDate={handleUpdateEndDate}
                    handleUpdateEndHours={handleUpdateEndHours}
                    handleUpdateEndMinutes={handleUpdateEndMinutes}
                />

                //
                //-------- CODE USING COMPONENTS FROM AKSEL 2.0---------
                //
                // <div className="input-area">
                //     <label htmlFor="#startDate">
                //         <b>Startdato</b>
                //     </label>
                //     <DatePicker
                //         id="startDate"
                //         selected={startDateForActiveOpsMessage}
                //         onChange={handleUpdateStartDate}
                //     />

                //     <div className="input-area">
                //         <BodyShort>
                //             <b>Startklokkeslett</b>
                //         </BodyShort>
                //         <Select label="Timer" onChange={handleUpdateStartHours}>
                //             {hours.map((hour, i) => {
                //                 return <option key={i}>{hour}</option>
                //             })}
                //         </Select>
                //         <Select
                //             label="Minutter"
                //             onChange={handleUpdateStartMinutes}
                //         >
                //             {options.map((minutes, i) => (
                //                 <option key={i} value={minutes}>
                //                     {minutes}
                //                 </option>
                //             ))}
                //         </Select>
                //     </div>

                //     <HorizontalSeparator />

                //     <label htmlFor="#endDate">
                //         <b>Sluttdato</b>
                //     </label>
                //     <DatePicker
                //         id="endDate"
                //         selected={endDateForActiveOpsMessage}
                //         onChange={handleUpdateEndDate}
                //     />

                //     <div className="input-area">
                //         <BodyShort>
                //             <b>Sluttklokkeslett</b>
                //         </BodyShort>
                //         <Select label="Timer" onChange={handleUpdateEndHours}>
                //             {hours.map((hour, i) => {
                //                 return <option key={i}>{hour}</option>
                //             })}
                //         </Select>
                //         <Select
                //             label="Minutter"
                //             onChange={handleUpdateEndMinutes}
                //         >
                //             {options.map((minutes, i) => (
                //                 <option key={i} value={minutes}>
                //                     {minutes}
                //                 </option>
                //             ))}
                //         </Select>
                //     </div>
                // </div>
            )}

            <div className="button-container">
                <Button
                    variant="secondary"
                    onClick={() => router.push(RouterOpsMeldinger.PATH)}
                >
                    Avbryt
                </Button>
                <Button variant="primary" onClick={handleSubmitOpsMessage}>
                    Send inn
                </Button>
            </div>
        </OpsScheme>
    )
}

const AffectedServicesContainer = styled.div`
    display: flex;
    flex-direction: column;

    ul {
        button {
            background: none;
            border: none;
        }
    }
`

interface ServicesComponentInterface {
    handleUpdateAffectedServices: (newOpsServiceConnections: Service[]) => void
    opsMessage: OpsMessageI
    services: Service[]
}

const AffectedServicesComponent = ({
    handleUpdateAffectedServices,
    opsMessage,
    services,
}: ServicesComponentInterface) => {
    const [newAffectedServices, changeNewAffectedServices] = useState<
        Service[]
    >(opsMessage.affectedServices)

    const handleUpdateListOfAffectedServices = (service: Service) => {
        if (newAffectedServices.map((s) => s.id).includes(service.id)) {
            toast.warn("Denne tjenesten fins allerede i området")
            return
        }
        const changedAffectedServices = [...newAffectedServices, service]
        changeNewAffectedServices(changedAffectedServices)
        handleUpdateAffectedServices(changedAffectedServices)
    }

    const handleDeleteListOfAffectedServices = (service: Service) => {
        if (!newAffectedServices.map((s) => s.id).includes(service.id)) {
            toast.warn("Tjenesten fins ikke i kobling. Noe gikk galt")
            return
        }

        const changedAffectedServices = newAffectedServices.filter(
            (s) => s.id != service.id
        )
        changeNewAffectedServices(changedAffectedServices)
        handleUpdateAffectedServices(changedAffectedServices)
    }

    return (
        <AffectedServicesContainer>
            <ul>
                {newAffectedServices.map((service) => {
                    return (
                        <li key={service.id} value={service.name}>
                            {service.name}
                            <button
                                type="button"
                                aria-label="Fjern kobling til tjeneste"
                                onClick={() =>
                                    handleDeleteListOfAffectedServices(service)
                                }
                            >
                                <CloseCustomized />
                            </button>
                        </li>
                    )
                })}
            </ul>

            <AffectedServicesSelect
                services={services}
                affectedServicesAttachedToOpsMessage={newAffectedServices}
                handleUpdateListOfAffectedServices={
                    handleUpdateListOfAffectedServices
                }
            />
        </AffectedServicesContainer>
    )
}

const AffectedServicesSelectComponent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

interface newAffectedServices {
    services: Service[]
    affectedServicesAttachedToOpsMessage: Service[]
    handleUpdateListOfAffectedServices: (selectedServiceId: Service) => void
}

const AffectedServicesSelect = ({
    services,
    affectedServicesAttachedToOpsMessage,
    handleUpdateListOfAffectedServices,
}: newAffectedServices) => {
    const availableServices: Service[] = services.filter(
        (service) =>
            !affectedServicesAttachedToOpsMessage
                .map((s) => s.id)
                .includes(service.id)
    )
    const [selectedService, updateSelectedService] = useState<Service | null>(
        () => (availableServices.length > 0 ? availableServices[0] : null)
    )

    useEffect(() => {
        if (availableServices.length > 0) {
            updateSelectedService(availableServices[0])
        } else {
            updateSelectedService(null)
        }
    }, [services, affectedServicesAttachedToOpsMessage])

    const handleNewSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = availableServices.find(
            (service) => idOfSelectedService === service.id
        )
        updateSelectedService(newSelectedService)
    }

    const putHandler = () => {
        if (!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        handleUpdateListOfAffectedServices(selectedService)
    }

    return (
        <AffectedServicesSelectComponent>
            <Select
                label="Tilknyttede tjenester:"
                onChange={handleNewSelectedService}
            >
                <option key={undefined} value={""}>
                    -
                </option>
                {availableServices.length > 0 ? (
                    availableServices.map((service) => {
                        return (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        )
                    })
                ) : (
                    <option key={undefined} value={""}>
                        Ingen tjeneste å legge til
                    </option>
                )}
            </Select>

            <div>
                <Button variant="secondary" type="button" onClick={putHandler}>
                    {" "}
                    Legg til
                </Button>
            </div>
        </AffectedServicesSelectComponent>
    )
}

export default CreateOpsMessage
