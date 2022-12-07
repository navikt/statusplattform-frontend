import {
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
    Select,
    Textarea,
    TextField,
} from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import { TitleContext } from "../../../components/ContextProviders/TitleContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"

import Layout from "../../../components/Layout"
import { OpsMessageI, SeverityEnum } from "../../../types/opsMessage"
import { RouterOpsMeldinger } from "../../../types/routes"
import { postOpsMessage } from "../../../utils/opsAPI"

import "react-datepicker/dist/react-datepicker.css"
import { Service } from "../../../types/types"
import { backendPath } from "../.."
import { EndPathServices } from "../../../utils/apiHelper"
import { Delete } from "@navikt/ds-icons"
import { CloseCustomized, HorizontalSeparator } from "../../Admin"
import DateSetterOps from "../../../components/DateSetterOps"

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
                toast.success(" opprettet er sendt inn")
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

const OpsContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding: 1rem;
    border-left: 7.5px solid transparent;

    &.neutral {
        border-color: var(--navds-global-color-blue-500);
    }

    &.down {
        border-color: var(--navds-semantic-color-feedback-danger-border);
    }

    &.issue {
        border-color: var(--navds-semantic-color-feedback-warning-border);
    }

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
    services: Service[]
}

const options = ["00", "15", "30", "45"]

const OpsComponent = ({
    handleSubmitOpsMessage,
    opsMessage,
    setOpsMessage,
    services,
}: OpsProps) => {
    const [startDateForActiveOpsMessage, setStartDateForActiveOpsMessage] =
        useState<Date>(new Date())

    const [endDateForActiveOpsMessage, setEndDateForActiveOpsMessage] =
        useState<Date>(new Date())

    const [isLoading, setIsLoading] = useState(true)
    const [selectedSeverity, setSelectedSeverity] = useState<string>("NEUTRAL")
    const router = useRouter()

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

    const handleIsInternal = () => {
        if (!opsMessage.onlyShowForNavEmployees) {
            setOpsMessage({
                ...opsMessage,
                externalHeader: internalHeader,
                externalMessage: internalMessage,
            })
        }
        setOpsMessage({
            ...opsMessage,
            onlyShowForNavEmployees: !onlyShowForNavEmployees,
        })
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

    const handleIsActive = (newValue) => {
        if (newValue == "1") {
            setOpsMessage({ ...opsMessage, isActive: true })
        } else {
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
        <OpsContainer className={selectedSeverity.toLowerCase()}>
            <Heading size="xlarge" level="2">
                Opprett driftsmelding
            </Heading>

            <div className="input-area">
                <Select
                    label="Velg alvorlighetsgrad"
                    value={selectedSeverity !== null ? selectedSeverity : ""}
                    onChange={handleUpdateSelectedSeverity}
                >
                    <option value="NEUTRAL">Nøytral</option>
                    <option value="ISSUE">Gul</option>
                    <option value="DOWN">Rød</option>
                </Select>
            </div>

            <CheckboxGroup
                legend="Bare til interne?"
                hideLegend
                onChange={() => handleIsInternal()}
            >
                <Checkbox
                    value={onlyShowForNavEmployees ? "true" : "false"}
                    defaultChecked={onlyShowForNavEmployees}
                >
                    <b>- Bare til interne?</b>
                </Checkbox>
            </CheckboxGroup>

            <div className="input-area">
                <TextField
                    label="Tittel for meldingen"
                    value={internalHeader}
                    onChange={(e) =>
                        setOpsMessage({
                            ...opsMessage,
                            internalHeader: e.target.value,
                        })
                    }
                    maxLength={100}
                />

                <Textarea
                    label="Intern melding"
                    value={internalMessage}
                    onChange={(e) =>
                        handleUpdateMessageInternal(e.target.value)
                    }
                    maxLength={500}
                />
            </div>

            {!onlyShowForNavEmployees && (
                <div className="input-area">
                    <TextField
                        label="Tittel for ekstern melding"
                        value={externalHeader}
                        onChange={(e) =>
                            setOpsMessage({
                                ...opsMessage,
                                externalHeader: e.target.value,
                            })
                        }
                    />
                    <Textarea
                        label="Ekstern melding"
                        value={externalMessage}
                        onChange={(e) =>
                            handleUpdateMessageExternal(e.target.value)
                        }
                        maxLength={500}
                    />
                </div>
            )}

            <AffectedServicesComponent
                handleUpdateAffectedServices={handleUpdateAffectedServices}
                opsMessage={opsMessage}
                services={services}
            />

            <RadioGroup
                legend="Skal driftsmeldingen gjelde umiddelbart?"
                onChange={(e) => handleIsActive(e)}
                defaultValue={isActive ? "1" : "0"}
                
            >
                <Radio value="1">Nå</Radio>
                <Radio value="0">Senere</Radio>
            </RadioGroup>

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
                    Send inn ny driftsmelding
                </Button>
            </div>
        </OpsContainer>
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
                label="Koble tjenester mot meldingen"
                value={selectedService !== null ? selectedService.id : ""}
                onChange={handleNewSelectedService}
            >
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
