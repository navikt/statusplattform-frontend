import { Edit, Back } from "@navikt/ds-icons"
import {
    BodyShort,
    Button,
    Checkbox,
    Heading,
    Select,
    Textarea,
    TextField,
    Tag,
} from "@navikt/ds-react"

import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { backendPath } from "../.."
import { BackButton } from "../../../components/BackButton"
import { UserStateContext } from "../../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"
import Layout from "../../../components/Layout"
import { Service } from "../../../types/types"
import { OpsMessageI, SeverityEnum } from "../../../types/opsMessage"
import { RouterError, RouterOpsMeldinger } from "../../../types/routes"
import { EndPathServices, EndPathSpecificOps } from "../../../utils/apiHelper"
import {
    fetchSpecificOpsMessage,
    updateSpecificOpsMessage,
} from "../../../utils/opsAPI"
import { OpsScheme, Spacer } from "../../../styles/styles"
import { CloseCustomized } from "../../Admin"
import PublicOpsContent from "../PublicOpsContent"
import DateSetterOps from "../../../components/DateSetterOps"

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

    const usersWithAccess: string[] = [
        "L152423",
        "H161540",
        "K146221",
        "J104568",
        "G124938",
        "M106261",
        "K132081",
        "H123099",
        "L110875",
        "K125327",
        "F110862",
        "A110886",
        "L120166",
        "H166137",
        "G121973",
    ]

    useEffect(() => {
        if (!usersWithAccess.includes(navIdent)) {
            router.push(RouterError.PATH)
        }
    }, [router])

    const { internalHeader, externalHeader, startTime, endTime } = opsMessage

    const convertedStartTime = new Date(startTime)
    const convertedEndTime = new Date(endTime)

    const datePrettifyer = (date: Date) => {
        return `${
            convertedEndTime.getDate() < 10
                ? `0${convertedEndTime.getDate()}`
                : convertedEndTime.getDate()
        }/${
            convertedEndTime.getMonth() + 1 < 10
                ? `0${convertedEndTime.getMonth() + 1}`
                : convertedEndTime.getMonth() + 1
        }/${convertedEndTime.getFullYear().toString().substr(-2)} kl ${
            convertedEndTime.getHours() < 10
                ? `0${convertedEndTime.getHours()}`
                : convertedEndTime.getHours()
        }:${
            convertedEndTime.getMinutes() < 10
                ? `0${convertedEndTime.getMinutes()}`
                : convertedEndTime.getMinutes()
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
                    Driftsmelding:{" "}
                </SubHeader>
                <Spacer height="0.8rem" />
                <Heading size="large" level="1">
                    {usersWithAccess.includes(navIdent)
                        ? internalHeader
                        : externalHeader}
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 40rem;

    .section {
        margin: 1rem 0;
        width: 40rem;
    }
    .section:last-child {
        margin-bottom: 0;
    }

    .timeframe-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .current-timeframe-wrapper {
        display: flex;
        flex-flow: row wrap;
        gap: 1rem;
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
            await updateSpecificOpsMessage(updatedOpsMessage).then(() => {
                toast.success("Endringer lagret")
                toggleisEditing(false)
            })
        } catch (error) {
            console.log(error)
            toast.error("Noe gikk galt ved oppdatering av meldingen")
        }
    }

    // Handlers for start- and endtime
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
        console.log("Inni metoden, input er: " + dateInput)

        setEndDateForActiveOpsMessage(dateInput)
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
            <div className="section">
                <Heading size="medium" level="3">
                    Intern beskjed
                </Heading>
                <TextField
                    label="Intern header"
                    value={internalHeader}
                    onChange={updateOpsMessage("internalHeader")}
                />
                <Textarea
                    id="internal-message-wrapper"
                    className="text-area-wrapper"
                    label="Intern beskjed"
                    value={internalMessage}
                    size="medium"
                    maxLength={500}
                    onChange={(evt) =>
                        handleUpdateOpsTextArea("internalMessage", evt)
                    }
                />
            </div>

            <div className="section">
                <Heading size="medium" level="3">
                    Ekstern beskjed
                </Heading>
                <TextField
                    label="Ekstern header"
                    value={externalHeader}
                    onChange={updateOpsMessage("externalHeader")}
                />
                <Textarea
                    id="external-message-wrapper"
                    className="text-area-wrapper"
                    label="Ekstern beskjed"
                    value={externalMessage}
                    size="medium"
                    maxLength={500}
                    onChange={(evt) =>
                        handleUpdateOpsTextArea("externalMessage", evt)
                    }
                />
            </div>

            <div className="section">
                <Select
                    label="Velg alvorlighetsgrad"
                    value={selectedSeverity !== null ? selectedSeverity : ""}
                    onChange={handleUpdateSelectedSeverity}
                >
                    <option value={SeverityEnum.NEUTRAL}>Nøytral</option>
                    <option value={SeverityEnum.ISSUE}>Gul</option>
                    <option value={SeverityEnum.DOWN}>Rød</option>
                </Select>
            </div>

            <ModifyAffectedServices
                opsMessageToUpdate={updatedOpsMessage}
                handleUpdateOpsMessageAffectedServices={(newOps) =>
                    handleUpdateOpsMessageAffectedServices(newOps)
                }
                services={services}
            />

            <div className="section">
                <Heading size="medium" level="3">
                    Ytterligere detaljer
                </Heading>
                <Checkbox
                    checked={isActive}
                    onChange={() =>
                        changeUpdatedOpsMessage({
                            ...updatedOpsMessage,
                            isActive: !updatedOpsMessage.isActive,
                        })
                    }
                >
                    Er den aktiv?
                </Checkbox>
                <Checkbox
                    checked={onlyShowForNavEmployees}
                    onChange={() =>
                        changeUpdatedOpsMessage({
                            ...updatedOpsMessage,
                            onlyShowForNavEmployees:
                                !updatedOpsMessage.onlyShowForNavEmployees,
                        })
                    }
                >
                    Vises bare for ansatte?
                </Checkbox>
            </div>

            <div className="timeframe-container">
                <div className="current-timeframe-wrapper">
                    <div>
                        <Heading size="medium" level="3">
                            Foreløpig starttid
                        </Heading>
                        {convertedStartTime ? (
                            <BodyShort>{prettifiedStartTime}</BodyShort>
                        ) : (
                            <p>Ikke satt</p>
                        )}
                    </div>
                    <div>
                        <Heading size="medium" level="3">
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
                        handleUpdateStartDate={handleUpdateStartDate}
                        handleUpdateStartHours={handleUpdateStartHours}
                        handleUpdateStartMinutes={handleUpdateStartMinutes}
                        handleUpdateEndDate={handleUpdateEndDate}
                        handleUpdateEndHours={handleUpdateEndHours}
                        handleUpdateEndMinutes={handleUpdateEndMinutes}
                    />
                )}
            </div>
            <Button variant="primary" onClick={handleSubmitChangesOpsMessage}>
                Lagre endringer
            </Button>
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
            {opsMessageToUpdate.affectedServices.length == 0 ? (
                <BodyShort>
                    Ingen tjenester er knyttet til driftsmeldingen
                </BodyShort>
            ) : (
                <div>
                    <b>Tilknyttede tjenester mot driftsmeldingen:</b>
                    <ul>
                        {opsMessageToUpdate.affectedServices.map((service) => {
                            return (
                                <li key={service.id}>
                                    {service.name}
                                    <button
                                        onClick={() =>
                                            handleNewServiceToDelete(service)
                                        }
                                    >
                                        <CloseCustomized />
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

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
    const [selectedService, updateSelectedService] = useState<Service | null>(
        () => (availableServices.length > 0 ? availableServices[0] : null)
    )

    useEffect(() => {
        if (availableServices.length > 0) {
            updateSelectedService(availableServices[0])
        } else {
            updateSelectedService(null)
        }
    }, [allServices, availableServices])

    const handleNewSelectedService = (event) => {
        const idOfSelectedService: string = event.target.value
        const newSelectedService: Service = availableServices.find(
            (service) => idOfSelectedService === service.id
        )
        updateSelectedService(newSelectedService)
    }

    const handleNewServiceToAdd = (selectedService: Service) => {
        if (!selectedService) {
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
                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => handleNewServiceToAdd(selectedService)}
                >
                    {" "}
                    Legg til
                </Button>
            </div>
        </SelectAndAddServiceComponent>
    )
}

export default opsMessageDetails
