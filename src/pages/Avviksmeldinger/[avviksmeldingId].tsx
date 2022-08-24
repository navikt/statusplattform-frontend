import { EditFilled } from "@navikt/ds-icons"
import {
    BodyShort,
    Button,
    Checkbox,
    Heading,
    Select,
    Textarea,
    TextField,
} from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { backendPath } from ".."
import { BackButton } from "../../components/BackButton"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../components/CustomNavSpinner"
import Layout from "../../components/Layout"
import { Service } from "../../types/types"
import { OpsMessageI, SeverityEnum } from "../../types/opsMessage"
import { RouterError, RouterOpsMeldinger } from "../../types/routes"
import { EndPathServices, EndPathSpecificOps } from "../../utils/apiHelper"
import {
    fetchSpecificOpsMessage,
    updateSpecificOpsMessage,
} from "../../utils/opsAPI"
import { CloseCustomized } from "../Admin"
import PublicOpsContent from "./PublicOpsContent"

const OpsMessageContainer = styled.div`
    display: flex;
    width: 100%;
`

export const getServerSideProps = async (context) => {
    const { avviksmeldingId } = await context.query

    const [resOpsMsg, resServices] = await Promise.all([
        fetch(backendPath + EndPathSpecificOps(avviksmeldingId)),
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
                        Avviksmelding - {opsMessage.internalHeader} -
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

const OpsContent = styled.div`
    padding: 1rem 2rem;
    border-radius: 0.5rem;

    display: flex;
    flex-direction: column;

    gap: 1rem;

    border-left: 7.5px solid transparent;

    &.not-editting {
        box-shadow: 0 0 10px rgb(0 0 0 / 20%);
    }

    &.neutral {
        border-color: var(--navds-global-color-blue-500);
    }

    &.down {
        border-color: var(--navds-semantic-color-feedback-danger-border);
    }

    &.issue {
        border-color: var(--navds-semantic-color-feedback-warning-border);
    }

    width: 60%;
    align-items: center;
    margin: 0 auto;

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    @media (min-width: 1050px) {
        padding: 2rem 4rem;
    }
`

interface OpsMessageComponentI {
    opsMessage: OpsMessageI
    services: Service[]
}

const OpsMessageComponent = ({
    opsMessage: serverSideOpsMessage,
    services,
}: OpsMessageComponentI) => {
    const [isEditting, toggleIsEditting] = useState(false)
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
    }, [isEditting])

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
    ]

    useEffect(() => {
        if (!usersWithAccess.includes(navIdent)) {
            router.push(RouterError.PATH)
        }
    }, [router])

    const { internalHeader, externalHeader } = opsMessage

    return (
        <OpsContent
            className={
                updatedSeverity && isEditting
                    ? updatedSeverity.toLowerCase()
                    : "not-editting"
            }
        >
            <div className="header-container">
                <Heading size="medium" level="2">
                    Avviksmelding -{" "}
                    {usersWithAccess.includes(navIdent)
                        ? internalHeader
                        : externalHeader}
                </Heading>
                {usersWithAccess.includes(navIdent) && (
                    <Button
                        variant="primary"
                        onClick={() => toggleIsEditting(!isEditting)}
                    >
                        {isEditting ? "Avbryt redigering" : <EditFilled />}
                    </Button>
                )}
            </div>

            {!isEditting ? (
                <DetailsOfOpsMessage
                    opsMessage={opsMessage}
                    navIdent={navIdent}
                />
            ) : (
                <EditOpsMessage
                    opsMessage={opsMessage}
                    navIdent={navIdent}
                    services={services}
                    toggleIsEditting={(newValue) => toggleIsEditting(newValue)}
                    changeUpdatedSeverity={changeUpdatedSeverity}
                />
            )}
        </OpsContent>
    )
}

const OpsDetailsContainer = styled.div`
    &.neutral {
        border: 3px solid #ccc;
    }

    &.down {
        border: 3px solid var(--navds-semantic-color-feedback-danger-border);
    }

    &.issue {
        border: 3px solid var(--navds-semantic-color-feedback-warning-border);
    }
`

interface DetailsOpsMsgI {
    opsMessage: OpsMessageI
    navIdent: string
}

const DetailsOfOpsMessage = ({ opsMessage, navIdent }: DetailsOpsMsgI) => {
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
    } = opsMessage

    const convertedStartTime = new Date(startTime)
    const convertedEndTime = new Date(endTime)

    const prettifiedStartTime = `${
        convertedStartTime.getDate() < 10
            ? `0${convertedStartTime.getDate()}`
            : convertedStartTime.getDate()
    }.${
        convertedStartTime.getMonth() + 1 < 10
            ? `0${convertedStartTime.getMonth() + 1}`
            : convertedStartTime.getMonth() + 1
    }.${convertedStartTime.getFullYear()}, ${
        convertedStartTime.getHours() < 10
            ? `0${convertedStartTime.getHours()}`
            : convertedStartTime.getHours()
    }:${
        convertedStartTime.getMinutes() < 10
            ? `0 ${convertedStartTime.getMinutes()}`
            : convertedStartTime.getMinutes()
    }`
    const prettifiedEndTime = `${
        convertedEndTime.getDate() < 10
            ? `0${convertedEndTime.getDate()}`
            : convertedEndTime.getDate()
    }.${
        convertedEndTime.getMonth() + 1 < 10
            ? `0${convertedEndTime.getMonth() + 1}`
            : convertedEndTime.getMonth() + 1
    }.${convertedEndTime.getFullYear()}, ${
        convertedEndTime.getHours() < 10
            ? `0${convertedEndTime.getHours()}`
            : convertedEndTime.getHours()
    }:${
        convertedEndTime.getMinutes() < 10
            ? `0 ${convertedEndTime.getMinutes()}`
            : convertedEndTime.getMinutes()
    }`

    return (
        <OpsDetailsContainer>
            {navIdent ? (
                <div>
                    <BodyShort spacing>{internalMessage}</BodyShort>
                </div>
            ) : (
                <div>{externalMessage}</div>
            )}

            <Heading size="small" level="3">
                Ytterligere detaljer
            </Heading>
            {navIdent && (
                <>
                    <ul>
                        <li>Er den aktiv: {isActive ? "Ja" : "Nei"}</li>
                        <li>
                            Vises bare for ansatte:{" "}
                            {onlyShowForNavEmployees ? "Ja" : "Nei"}
                        </li>
                    </ul>

                    {convertedStartTime && (
                        <ul>
                            <li>Starttid: {prettifiedStartTime}</li>
                        </ul>
                    )}

                    {endTime && (
                        <ul>
                            <li>Sluttid: {prettifiedEndTime}</li>
                        </ul>
                    )}
                </>
            )}

            <b>Tilknyttede tjenester:</b>
            {affectedServices.length > 0 && (
                <ul>
                    {affectedServices.map((service) => {
                        return <li key={service.id}>{service.name}</li>
                    })}
                </ul>
            )}
        </OpsDetailsContainer>
    )
}

const EditOpsMessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    .section {
        margin: 1rem 0;
    }
    .section:last-child {
        margin-bottom: 0;
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
    toggleIsEditting: (newValue) => void
    changeUpdatedSeverity: (newValue) => void
}

const EditOpsMessage = ({
    opsMessage,
    navIdent,
    services,
    toggleIsEditting,
    changeUpdatedSeverity,
}: EditOpsMessageI) => {
    const [isLoading, setIsLoading] = useState(true)
    const [updatedOpsMessage, changeUpdatedOpsMessage] = useState<OpsMessageI>({
        ...opsMessage,
    })
    const [selectedSeverity, setSelectedSeverity] = useState<string>(
        opsMessage.severity
    )

    const router = useRouter()
    const ref = useRef(null)

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
                toggleIsEditting(false)
            })
        } catch (error) {
            console.log(error)
            toast.error("Noe gikk galt ved oppdatering av meldingen")
        }
    }

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

            {/* <div className="section">
                <Heading size="medium" level="3">Startdato</Heading>
                <TextField label="Dato" type="date" value={} onChange={updateOpsMessage("startDate")} />
                <TextField label="Klokkeslett" type="time" value={} onChange={updateOpsMessage("startTime")} />
            </div> */}

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
                "Tjeneste fins allerede på avviksmeldingen. Noe har gått galt."
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
                "Ser ut som tjenesten du prøver å fjerne ikke fins på avviksmeldingen. Noe har gått galt."
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
                    Ingen tjenester er knyttet til avviksmeldingen
                </BodyShort>
            ) : (
                <div>
                    <b>Tilknyttede tjenester mot avviksmeldingen:</b>
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
