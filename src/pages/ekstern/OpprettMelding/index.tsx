import {
    Alert,
    Button,
    Chips,
    Heading,
    Label,
    Radio,
    RadioGroup,
    Select,
    Textarea,
    TextField,
} from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import styled from "styled-components"
import { backendPath } from "../../"
import { TitleContext } from "../../../components/ContextProviders/TitleContext"
import CustomNavSpinner from "../../../components/CustomNavSpinner"
import DateSetterOps from "../../../components/DateSetterOps"
import Layout from "../../../components/Layout"
import TextEditor from "../../../components/TextEditor"
import { OpsScheme, Spacer } from "../../../styles/styles"
import {
    OpsMessageI,
    SeverityEnum,
    StatusEnum,
} from "../../../types/opsMessage"
import { Service, Team } from "../../../types/types"
import { postOpsMessage } from "../../../utils/opsAPI"
import { UserStateContext } from "../../../components/ContextProviders/UserStatusContext";
import { UserData } from "../../../types/userData"
import { fetchServiceFromId, fetchServicesMinimal } from "../../../utils/servicesAPI"
import { checkUserMembershipInTeam, fetchSimplifiedTeamByName } from "../../../utils/teamKatalogAPI"

export const getServerSideProps = async () => {
    const response = await fetch(`${backendPath}/rest/Services/Minimal`)
    const services: Service[] =  await response.json()

    return {
        props: {
            services,
        },
    }
}

interface CreateOpsMessageProps{
    services: Service[]
}
const CreateOpsMessage = ({ services }: CreateOpsMessageProps) => {
    const [opsMessage, setOpsMessage] = useState<OpsMessageI>({
        internalHeader: "",
        internalMessage: "",
        externalHeader: "",
        externalMessage: "",
        onlyShowForNavEmployees: false,
        isActive: true,
        affectedServices: [],
        startTime: new Date(),
        endTime: new Date(),
        severity: SeverityEnum.NEUTRAL,
        status: StatusEnum.EXAMINING,
        state: "",
    })

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
        postOpsMessage(opsMessage)
        router.push("/samarbeidspartner")
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
    const [selectedStatus, setSelectedStatus] = useState<string>("EXAMINING")
    const [showAutomaticTimeMsg, setShowAutomaticTimeMsg] = useState(true)
    const [showCustomDates, setShowCustomDates] = useState(false)

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
        status,
    } = opsMessage

    if (!router.isReady || isLoading) {
        return <CustomNavSpinner />
    }

    const handleUpdateAffectedServices = (newServices: Service[]) => {
        setOpsMessage({ ...opsMessage, affectedServices: newServices })
    }

    const handleUpdateMessageInternal = (message: string) => {
        setOpsMessage({ ...opsMessage, internalMessage: message, externalMessage: message })
    }

    const handleIsActive = (newValue) => {
        if (newValue == "1") {
            var currentTime = new Date()
            var endTime = new Date()
            currentTime.setDate(currentTime.getDate())
            endTime.setDate(endTime.getDate() + 14)

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

    const handleUpdateSelectedStatus = (event) => {
        const newSelectedStatus: StatusEnum = event.target.value
        setSelectedStatus(newSelectedStatus)
        setOpsMessage({ ...opsMessage, status: newSelectedStatus })
    }

    const handleUpdateDates = (startDateInput: Date, endDateInput: Date) => {
        setStartDateForActiveOpsMessage(startDateInput)
        setEndDateForActiveOpsMessage(endDateInput)
    }

    const handleUpdateStartDate = (event) => {
        const dateInput: Date = new Date(event)
        setStartDateForActiveOpsMessage(dateInput)
    }

    const handleUpdateEndDate = (event) => {
        const dateInput: Date = new Date(event)
        setEndDateForActiveOpsMessage(dateInput)
        setShowCustomDates(true)
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
                Opprett ekstern driftsmelding
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

            <div className="input-area">
                <Select
                    label="Velg status:"
                    value={selectedStatus !== null ? selectedStatus : ""}
                    onChange={handleUpdateSelectedStatus}
                >
                    {" "}
                    <option value="EXAMINING">Undersøkes</option>{" "}
                    <option value="MAINTENANCE">Vedlikehold</option>
                    <option value="SOLVING">Feilretting pågår</option>
                    <option value="SOLVED">Løst</option>
                </Select>
            </div>

            <Spacer height="0.5rem" />

            <div className="input-area">
                <TextField
                    label="Tittel:"
                    defaultValue={
                        selectedStatus === "MAINTENANCE"
                            ? "Vedlikehold på:" 
                            : "Problemer med:"
                    }
                    onChange={(e) =>
                        setOpsMessage({
                            ...opsMessage,
                            externalHeader: e.target.value,
                            internalHeader: e.target.value
                        })
                    }
                    maxLength={100}
                />

                <TextEditor
                    ref={createMsgRef}
                    isInternal={true}
                    status={selectedStatus}
                    initialValue={internalMessage}
                    title="Innhold:"
                    handleUpdateMsg={handleUpdateMessageInternal}
                />
            </div>

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
                <>
                    <DateSetterOps
                        startDateForActiveOpsMessage={
                            startDateForActiveOpsMessage
                        }
                        endDateForActiveOpsMessage={endDateForActiveOpsMessage}
                        handleUpdateStartDate={handleUpdateStartDate}
                        handleUpdateEndDate={handleUpdateEndDate}
                        handleUpdateStartHours={handleUpdateStartHours}
                        handleUpdateStartMinutes={handleUpdateStartMinutes}
                        handleUpdateEndHours={handleUpdateEndHours}
                        handleUpdateEndMinutes={handleUpdateEndMinutes}
                        showCustomDates={showCustomDates}
                    />
                </>
            )}

            <div className="button-container">
                <Button variant="secondary" onClick={() => router.back()}>
                    Avbryt
                </Button>
                <Button variant="primary" onClick={handleSubmitOpsMessage}>
                    Send inn
                </Button>
            </div>
        </OpsScheme>
    )
}

export const AffectedServicesContainer = styled.div`
    margin: 1rem 0;

    .chipsContainer {
        margin: 0.3rem 0 0.7rem 0;
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
            <Label>Tilknyttede tjenester:</Label>
            <Chips className="chipsContainer">
                {newAffectedServices.map((service) => (
                    <Chips.Removable
                        key={service.id}
                        onClick={() =>
                            handleDeleteListOfAffectedServices(service)
                        }
                    >
                        {service.name}
                    </Chips.Removable>
                ))}
            </Chips>
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
    
    const user = useContext<UserData>(UserStateContext)
    const availableServices: Service[] = services.filter(
      (service) =>
        !affectedServicesAttachedToOpsMessage.map((s) => s.id).includes(service.id)
    );
  
    const [selectedService, updateSelectedService] = useState<Service | null>(
      () => (availableServices.length > 0 ? availableServices[0] : null)
    );
  
    useEffect(() => {
      if (availableServices.length > 0) {
        updateSelectedService(availableServices[0]);
      } else {
        updateSelectedService(null);
      }
    }, [services, affectedServicesAttachedToOpsMessage]);
  
    const handleNewSelectedService = (event) => {
      const idOfSelectedService: string = event.target.value;
      const newSelectedService: Service = availableServices.find(
        (service) => idOfSelectedService === service.id
      );
  
      updateSelectedService(newSelectedService);
    };
  
    const checkUserMembership = async (teamId, userId) => {
        try {
            const url = `${backendPath}/rest/teams/check-user?team_id=${teamId}&user_id=${userId}`
            const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error("Failed to check user membership");
        }
  
        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error checking user membership:", error);
        return false;
      }
    };

  
    const putHandler = async () => {
      if (!selectedService) {
        toast.info("Ingen tjeneste valgt");
        return;
      }
  
      // Check if the current user is a member of the team that owns the selected service
        const service: Service = await fetchServiceFromId(selectedService.id);
        const team: Team = await fetchSimplifiedTeamByName(service.team);
        const isMember = await checkUserMembershipInTeam(team.id, user.navIdent);
      if (isMember) {
        handleUpdateListOfAffectedServices(selectedService);
      } else {
        toast.warn("Du er ikke medlem av teamet som eier denne tjenesten");
      }
    };
  
    return (
      <AffectedServicesSelectComponent>
        <Select onChange={handleNewSelectedService} label="Tilknyttede tjenester:" hideLabel>
          <option key={undefined} value="">
            -
          </option>
          {availableServices.length > 0 ? (
            availableServices.map((service) => {
              return (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              );
            })
          ) : (
            <option key={undefined} value="">
              Ingen tjeneste å legge til
            </option>
          )}
        </Select>
  
        <div>
          <Button variant="secondary" type="button" onClick={putHandler}>
            Legg til
          </Button>
        </div>
      </AffectedServicesSelectComponent>
    );
  };

export default CreateOpsMessage
