import { Back } from "@navikt/ds-icons"
import {
    BodyShort,
    Button,
    Checkbox,
    Chips,
    Heading,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from "@navikt/ds-react"

import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { backendPath } from "../.."
import { UserStateContext } from "../../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"
import DateSetterOps from "../../../components/DateSetterOps"
import Layout from "../../../components/Layout"
import TextEditor from "../../../components/TextEditor"
import { OpsScheme, Spacer } from "../../../styles/styles"
import { OpsMessageI, SeverityEnum } from "../../../types/opsMessage"
import { RouterError, RouterOpsMeldinger } from "../../../types/routes"
import { Service } from "../../../types/types"
import { EndPathServices, EndPathSpecificOps } from "../../../utils/apiHelper"
import {
    fetchSpecificOpsMessage,
    updateSpecificOpsMessage,
} from "../../../utils/opsAPI"
import PublicOpsContent from "../PublicOpsContent"

const OpsMessageContainer = styled.div`
    display: flex;
    width: 100%;
`
const SubHeader = styled(Heading)`
    color: var(--a-gray-600);
`

export const getServerSideProps = async (context) => {
    const { driftmeldingsId } = await context.query

    const [resOpsMsg, resServices] = await Promise.all([
        fetch(backendPath + EndPathSpecificOps(driftmeldingsId)),
        fetch(backendPath + EndPathServices()),
    ])

    const opsMessage: OpsMessageI = await resOpsMsg.json()
    const retrievedServices: Service[] = await resServices.json()

    return {
        props: {
            retrievedServices,
            opsMessage,
        },
    }
}

const opsMessageDetails = ({ opsMessage, retrievedServices }) => {
    const [isLoading, setIsLoading] = useState(true)

    const user = useContext(UserStateContext)

    useEffect(() => {
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    return (
        <Layout>
            <OpsMessageContainer>
                <Head>
                    <title>
                        Driftsmelding - {opsMessage.internalHeader} -
                        status.nav.no
                    </title>
                </Head>
                {user.navIdent ? (
                    <OpsMessageComponent
                        opsMessage={opsMessage}
                        services={retrievedServices}
                    />
                ) : (
                    <PublicOpsContent
                        opsMessage={opsMessage}
                        services={retrievedServices}
                    />
                )}
            </OpsMessageContainer>
        </Layout>
    )
}

interface OpsMessageComponentI {
    opsMessage: OpsMessageI
    services: Service[]
}

const OpsMessageComponent = ({
    opsMessage: serverSideOpsMessage,
    services,
}: OpsMessageComponentI) => {
    const [isEditing, toggleisEditing] = useState(false)
    const [opsMessage, changeOpsMessage] =
        useState<OpsMessageI>(serverSideOpsMessage)
    const [updatedSeverity, changeUpdatedSeverity] = useState<SeverityEnum>(
        serverSideOpsMessage.severity
    )
    const [isLoading, setIsLoading] = useState(false)

    const { name, navIdent } = useContext(UserStateContext)

    const router = useRouter()

    useEffect(() => {
        let reFetching = true
        const reFetch = async () => {
            if (reFetching) {
                await fetchSpecificOpsMessage(opsMessage.id)
                    .then((response) => {
                        changeOpsMessage(response)
                    })
                    .catch(() => {
                        toast.error("Noe gikk galt")
                    })
            }
        }
        if (reFetching) {
            reFetch()
        }

        reFetching = false
    }, [isEditing])

    useEffect(() => {
        setIsLoading(true)
        setIsLoading(false)
    }, [updatedSeverity])

    const approvedUsers = [
        "L152423",
        "K132081",
        "H123099",
        "L110875",
        "K125327",
        "F110862",
        "A110886",
        "L120166",
        "M106261",
        "M137316",
        "G121973",
        "H166137",
    ]

    useEffect(() => {
        if (!approvedUsers.includes(navIdent)) {
            router.push(RouterError.PATH)
        }
    }, [router])

    const { internalHeader, externalHeader, startTime, endTime } = opsMessage

    const convertedStartTime = new Date(startTime)
    const convertedEndTime = new Date(endTime)

    const datePrettifyer = (date: Date) => {
        return `${
            date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        }/${
            date.getMonth() + 1 < 10
                ? `0${date.getMonth() + 1}`
                : date.getMonth() + 1
        }/${date.getFullYear().toString().substr(-2)} kl ${
            date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        }:${
            date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        }`
    }

    const prettifiedStartTime = datePrettifyer(convertedStartTime)
    const prettifiedEndTime = datePrettifyer(convertedEndTime)

    return (
        <OpsScheme
            className={updatedSeverity ? updatedSeverity.toLowerCase() : "none"}
        >
            <div className="returnBtn">
                <Button
                    variant="tertiary"
                    size="small"
                    onClick={() => router.push(RouterOpsMeldinger.PATH)}
                >
                    <Back />
                    Se alle driftsmeldinger
                </Button>
            </div>
            <div className="header-container">
                <SubHeader size="small" level="3">
                    Rediger driftsmelding:{" "}
                </SubHeader>
                <Spacer height="0.8rem" />
                <Heading size="large" level="1">
                    {navIdent ? internalHeader : externalHeader}
                </Heading>

                <Spacer height="1.2rem" />
            </div>

            <EditOpsMessage
                opsMessage={opsMessage}
                navIdent={navIdent}
                services={services}
                toggleisEditing={(newValue) => toggleisEditing(newValue)}
                changeUpdatedSeverity={changeUpdatedSeverity}
                convertedStartTime={convertedStartTime}
                convertedEndTime={convertedEndTime}
                prettifiedStartTime={prettifiedStartTime}
                prettifiedEndTime={prettifiedEndTime}
            />
        </OpsScheme>
    )
}

const OpsDetailsContainer = styled.div`
    .opsMessageContainer {
        border: 1px solid;
        border-color: var(--a-gray-200);
        border-radius: 0.5rem;
        padding: 1rem;
        width: 36rem;
        margin-bottom: 1.5rem;
    }

    .labelContainer {
        display: flex;
        margin: 1rem 0 1rem;
        gap: 0.5rem;
    }
    &.neutral {
        border: 3px solid #ccc;
    }

    &.down {
        border: 3px solid var(--a-border-danger);
    }

    &.issue {
        border: 3px solid var(--a-border-warning);
    }
`

const EditOpsMessageContainer = styled.div`
    width: 36.5rem;

    .section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0 0 1rem;
    }

    .buttonContainer {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        margin: 1rem 0 -0.5rem 20rem;
    }
    @media (min-width: 600px) {
        .text-area-wrapper  {
            min-width: 500px;
        }
    }

    @media (min-width: 1000px) {
        .text-area-wrapper  {
            min-width: 750px;
        }
    }
`

interface EditOpsMessageI {
    opsMessage: OpsMessageI
    navIdent: string
    services: Service[]
    toggleisEditing: (newValue) => void
    changeUpdatedSeverity: (newValue) => void
    prettifiedStartTime: string
    prettifiedEndTime: string
    convertedStartTime: Date
    convertedEndTime: Date
}

const EditOpsMessage = (props: EditOpsMessageI) => {
    const [isLoading, setIsLoading] = useState(true)
    const [updatedOpsMessage, changeUpdatedOpsMessage] = useState<OpsMessageI>({
        ...props.opsMessage,
    })
    const [updateTimeframe, setUpdateTimeframe] = useState(false)
    const [selectedSeverity, setSelectedSeverity] = useState<string>(
        props.opsMessage.severity
    )
    const [startDateForActiveOpsMessage, setStartDateForActiveOpsMessage] =
        useState<Date>(props.convertedStartTime)

    const [endDateForActiveOpsMessage, setEndDateForActiveOpsMessage] =
        useState<Date>(props.convertedEndTime)

    const editorRef = useRef(null)

    const {
        opsMessage,
        navIdent,
        services,
        toggleisEditing,
        changeUpdatedSeverity,
        prettifiedEndTime,
        prettifiedStartTime,
        convertedEndTime,
        convertedStartTime,
    } = props

    const router = useRouter()

    useEffect(() => {
        setIsLoading
        if (navIdent) {
            setIsLoading(false)
            return
        } else {
            if (router.isReady) {
                router.push(RouterError.PATH)
            }
        }
    }, [])

    useEffect(() => {
        changeUpdatedOpsMessage({
            ...updatedOpsMessage,
            startTime: startDateForActiveOpsMessage,
            endTime: endDateForActiveOpsMessage,
        })
    }, [startDateForActiveOpsMessage, endDateForActiveOpsMessage])

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const {
        externalHeader,
        externalMessage,
        internalHeader,
        internalMessage,
        affectedServices,
        isActive,
        onlyShowForNavEmployees,
        startTime,
        endTime,
        severity,
    } = updatedOpsMessage

    const updateOpsMessage =
        (field: keyof typeof updatedOpsMessage) =>
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            const newOpsMessage: OpsMessageI = {
                ...updatedOpsMessage,
                [field]:
                    evt.target.getAttribute("type") === "number"
                        ? parseInt(evt.target.value)
                        : evt.target.value,
            }
            changeUpdatedOpsMessage(newOpsMessage)
        }

    const handleUpdateOpsTextArea = (field, evt) => {
        const newOpsMsg: OpsMessageI = {
            ...updatedOpsMessage,
            [field]:
                evt.target.getAttribute("type") === "number"
                    ? parseInt(evt.target.value)
                    : evt.target.value,
        }
        changeUpdatedOpsMessage(newOpsMsg)
    }

    const handleUpdateOpsMessageAffectedServices = (newOps: OpsMessageI) => {
        changeUpdatedOpsMessage(newOps)
    }

    const handleUpdateSelectedSeverity = (event) => {
        const newSelectedSeverity: SeverityEnum = event.target.value
        setSelectedSeverity(newSelectedSeverity)
        changeUpdatedOpsMessage({
            ...opsMessage,
            severity: newSelectedSeverity,
        })
        changeUpdatedSeverity(newSelectedSeverity)
    }

    const handleSubmitChangesOpsMessage = async () => {
        if (updatedOpsMessage.internalMessage.length > 500) {
            toast.error(
                "Intern melding er for lang. Den kan ikke være mer enn 500 tegn"
            )
            document.getElementById("internal-message-wrapper").focus()
            return
        }
        if (updatedOpsMessage.externalMessage.length > 500) {
            toast.error(
                "Ekstern melding er for lang. Den kan ikke være mer enn 500 tegn"
            )
            document.getElementById("external-message-wrapper").focus()
            return
        }
        try {
            await updateSpecificOpsMessage(updatedOpsMessage)
                .then(() => {
                    toast.success("Endringer lagret")
                })
                .catch(() => {
                    toast.error("Det oppstod en feil")
                })
                .finally(() => {
                    router.push(RouterOpsMeldinger.PATH)
                })
        } catch (error) {
            console.log(error)
            toast.error("Noe gikk galt ved oppdatering av meldingen")
        }
    }

    const handleIsInternal = (newValue) => {
        console.log(onlyShowForNavEmployees)
        if (newValue == "Internal") {
            changeUpdatedOpsMessage({
                ...opsMessage,
                onlyShowForNavEmployees: true,
                externalHeader: internalHeader,
                externalMessage: internalMessage,
            })
        } else {
            changeUpdatedOpsMessage({
                ...opsMessage,
                onlyShowForNavEmployees: false,
            })
        }
    }

    const handleUpdateMessageInternal = (message: string) => {
        if (message.length < 501) {
            changeUpdatedOpsMessage({ ...opsMessage, internalMessage: message })
        }
    }

    const handleUpdateMessageExternal = (message: string) => {
        if (message.length < 501) {
            changeUpdatedOpsMessage({
                ...opsMessage,
                externalMessage: message,
            })
        }
    }

    // Handlers for start- and endtime
    const handleUpdateDates = (startDateInput: Date, endDateInput: Date) => {
        setStartDateForActiveOpsMessage(startDateInput)
        setEndDateForActiveOpsMessage(endDateInput)
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

    // console.log("Ny sluttdato: " + opsMessage.endTime)

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
    // -----

    return (
        <EditOpsMessageContainer>
            {/* <div className="section">
                <Checkbox
                    checked={isActive}
                    onChange={() =>
                        changeUpdatedOpsMessage({
                            ...updatedOpsMessage,
                            isActive: !updatedOpsMessage.isActive,
                        })
                    }
                >
                    Sett meldingen som <b>aktiv</b>
                </Checkbox>
            </div> */}
            <div className="section">
                <Select
                    label="Velg alvorlighetsgrad"
                    value={selectedSeverity !== null ? selectedSeverity : ""}
                    onChange={handleUpdateSelectedSeverity}
                >
                    <option value={SeverityEnum.NEUTRAL}>Nøytral - Blå</option>
                    <option value={SeverityEnum.ISSUE}>Middels - Gul</option>
                    <option value={SeverityEnum.DOWN}>Høy - Rød</option>
                </Select>
            </div>

            <div className="section">
                <RadioGroup
                    legend="Velg synlighet:"
                    onChange={(e) => handleIsInternal(e)}
                    defaultValue={"Internal"}
                >
                    <Radio value="Internal">Kun interne brukere</Radio>
                    <Radio value="Public">Interne og eksterne brukere</Radio>
                </RadioGroup>
            </div>
            <div className="section">
                <TextField
                    label="Intern tittel:"
                    value={internalHeader}
                    onChange={updateOpsMessage("internalHeader")}
                />

                <TextEditor
                    ref={editorRef}
                    isInternal={true}
                    initialValue={internalMessage}
                    title="Intern tekst:"
                    handleUpdateInternalMsg={handleUpdateMessageInternal}
                />
            </div>
            {!onlyShowForNavEmployees && (
                <div className="section">
                    <TextField
                        label="Ekstern tittel"
                        value={externalHeader}
                        onChange={updateOpsMessage("externalHeader")}
                    />

                    <TextEditor
                        ref={editorRef}
                        isInternal={true}
                        initialValue={externalMessage}
                        title="Ekstern tekst:"
                        handleUpdateInternalMsg={handleUpdateMessageExternal}
                    />
                </div>
            )}
            <ModifyAffectedServices
                opsMessageToUpdate={updatedOpsMessage}
                handleUpdateOpsMessageAffectedServices={(newOps) =>
                    handleUpdateOpsMessageAffectedServices(newOps)
                }
                services={services}
            />

            <div className="timeframe-container">
                <div className="section">
                    <div className="section">
                        <Heading size="small" level="3">
                            Foreløpig starttid
                        </Heading>
                        {convertedStartTime ? (
                            <BodyShort>{prettifiedStartTime}</BodyShort>
                        ) : (
                            <p>Ikke satt</p>
                        )}
                    </div>
                    <div>
                        <Heading size="small" level="3">
                            Foreløpig sluttid
                        </Heading>
                        {convertedEndTime ? (
                            <BodyShort>{prettifiedEndTime}</BodyShort>
                        ) : (
                            <p>Ikke satt</p>
                        )}
                    </div>
                </div>
                <Checkbox
                    checked={updateTimeframe}
                    onChange={() => setUpdateTimeframe(!updateTimeframe)}
                >
                    Ønsker du å endre datoer og klokkeslett?
                </Checkbox>
                {updateTimeframe && (
                    <DateSetterOps
                        startDateForActiveOpsMessage={
                            startDateForActiveOpsMessage
                        }
                        endDateForActiveOpsMessage={endDateForActiveOpsMessage}
                        handleUpdateDates={handleUpdateDates}
                        handleUpdateStartHours={handleUpdateStartHours}
                        handleUpdateStartMinutes={handleUpdateStartMinutes}
                        handleUpdateEndHours={handleUpdateEndHours}
                        handleUpdateEndMinutes={handleUpdateEndMinutes}
                    />
                )}
            </div>
            <div className="buttonContainer">
                <Button variant="secondary" onClick={() => router.back()}>
                    Avbryt
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmitChangesOpsMessage}
                >
                    Lagre endringer
                </Button>
            </div>
        </EditOpsMessageContainer>
    )
}

const EditAffectedServicesContainer = styled.div`
    display: flex;
    flex-direction: column;

    .chipsContainer {
        margin: 0.3rem 0 0.3rem 0;
    }
`

interface ModifyAffectedServicesI {
    opsMessageToUpdate: OpsMessageI
    handleUpdateOpsMessageAffectedServices: (updatedOpsMsg: OpsMessageI) => void
    services: Service[]
}

const ModifyAffectedServices = ({
    opsMessageToUpdate,
    handleUpdateOpsMessageAffectedServices,
    services,
}: ModifyAffectedServicesI) => {
    const addNewAffectedServices = (service: Service) => {
        if (
            opsMessageToUpdate.affectedServices
                .map((s) => s.id)
                .includes(service.id)
        ) {
            toast.error(
                "Tjeneste finnes allerede på driftsmeldingen. Noe har gått galt."
            )
            return
        }
        const adjustedServices: Service[] = [
            ...opsMessageToUpdate.affectedServices,
            service,
        ]
        const updatedOpsMessage: OpsMessageI = {
            ...opsMessageToUpdate,
            affectedServices: adjustedServices,
        }
        console.log("lagt til:")
        console.log(service)
        handleUpdateOpsMessageAffectedServices(updatedOpsMessage)
    }

    const deleteFromAffectedServices = (service: Service) => {
        if (
            !opsMessageToUpdate.affectedServices
                .map((s) => s.id)
                .includes(service.id)
        ) {
            toast.error(
                "Ser ut som tjenesten du prøver å fjerne ikke finnes på driftsmeldingen. Noe har gått galt."
            )
            return
        }
        const adjustedServices: Service[] = [
            ...opsMessageToUpdate.affectedServices.filter(
                (s) => s.id != service.id
            ),
        ]
        const updatedOpsMessage: OpsMessageI = {
            ...opsMessageToUpdate,
            affectedServices: adjustedServices,
        }
        handleUpdateOpsMessageAffectedServices(updatedOpsMessage)
    }

    const handleNewServiceToDelete = (selectedService: Service) => {
        if (!selectedService) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        deleteFromAffectedServices(selectedService)
    }

    return (
        <EditAffectedServicesContainer className="section">
            {
                <div>
                    <Heading size="xsmall">Tilknyttede tjenester:</Heading>

                    <Chips className="chipsContainer">
                        {opsMessageToUpdate.affectedServices.map((service) => (
                            <Chips.Removable
                                key={service.id}
                                onClick={() =>
                                    handleNewServiceToDelete(service)
                                }
                            >
                                {service.name}
                            </Chips.Removable>
                        ))}
                    </Chips>
                </div>
            }

            <SelectAffectedServicesComponent
                opsMessageToUpdate={opsMessageToUpdate}
                allServices={services}
                addNewAffectedServices={(serviceToAdd: Service) =>
                    addNewAffectedServices(serviceToAdd)
                }
            />
        </EditAffectedServicesContainer>
    )
}

const SelectAndAddServiceComponent = styled.div`
    display: flex;
    flex-direction: row;

    select:hover {
        cursor: pointer;
    }

    .selectContainer {
        width: 30.2rem;
    }
`

interface SelectAffectedServicesI {
    opsMessageToUpdate: OpsMessageI
    allServices: Service[]
    addNewAffectedServices: (serviceToAdd) => void
}

const SelectAffectedServicesComponent = ({
    opsMessageToUpdate,
    allServices,
    addNewAffectedServices,
}: SelectAffectedServicesI) => {
    const availableServices: Service[] = allServices.filter(
        (service) =>
            !opsMessageToUpdate.affectedServices
                .map((s) => s.id)
                .includes(service.id)
    )

    const [serviceNew, setServiceNew] = useState<Service>(availableServices[0])

    useEffect(() => {
        if (availableServices.length > 0) {
            setServiceNew(availableServices[0])
        } else {
            setServiceNew(null)
        }
    }, [allServices, opsMessageToUpdate.affectedServices])

    const handleNewSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = availableServices.find(
            (service) => idOfSelectedService === service.id
        )
        console.log(newSelectedService)

        setServiceNew(newSelectedService)
    }

    const putHandler = () => {
        if (!serviceNew) {
            toast.info("Ingen tjeneste valgt")
            return
        }
        console.log("valgt")
        console.log(serviceNew)
        addNewAffectedServices(serviceNew)
    }

    return (
        <SelectAndAddServiceComponent>
            <Select
                hideLabel
                label="Liste av tjenester"
                onChange={handleNewSelectedService}
                className="selectContainer"
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
        </SelectAndAddServiceComponent>
    )
}

export default opsMessageDetails
