import router, { useRouter } from "next/router"
import styled from "styled-components"

import { Edit, Next } from "@navikt/ds-icons"
import { Alert, BodyShort, Button, Heading, Tooltip } from "@navikt/ds-react"

import { useEffect, useState } from "react"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterOpsMeldinger } from "../../types/routes"
import { Dashboard, Service } from "../../types/types"
import { UserData } from "../../types/userData"
import { datePrettifyer } from "../../utils/datePrettifyer"
import { countHealthyServicesInListOfAreas } from "../../utils/servicesOperations"
import CustomNavSpinner from "../CustomNavSpinner"
import OpsMessageModal from "../OpsMessageModal"

const StatusSummary = styled.div`
    margin-top: 1rem;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 32px;

    .top-row {
        width: 100%;

        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;

        div:nth-child(2) {
            text-align: center;
        }
        .avvikshistorikk-button {
            visibility: hidden;
        }
    }

    .ops-container {
        display: grid;
        row-gap: 1.5rem;
        column-gap: 2rem;
        height: 17rem;
        overflow: hidden;

        @media (min-width: 800px) {
            grid-auto-rows: 7.4rem;
            grid-template-columns: repeat(2, 425px);
        }

        @media (min-width: 1150px) {
            grid-auto-rows: 7.4rem;
            grid-template-columns: repeat(3, 425px);
        }

        @media (min-width: 1600px) {
            grid-auto-rows: 7.4rem;
            grid-template-columns: repeat(3, 425px);
        }
    }

    .navds-alert {
        width: 100%;
    }

    @media (min-width: 902px) {
        /* TODO: Se på dette, det kan breake symmetrien på dashbordene hvis driftsmeldinger > 1 */
        /* flex-flow: row wrap; */
    }
    @media (min-width: 1359px) {
        width: 100%;
    }
`

//TODO Create Incidents handler and UI

interface StatusOverviewI {
    dashboard: Dashboard
    user: UserData
}

const StatusOverview = ({ dashboard, user }: StatusOverviewI) => {
    const router = useRouter()
    const [hasIssue, setHasIssue] = useState(false)
    const [hasDown, setHasDown] = useState(false)
    const [allGood, setAllGood] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const { areas, opsMessages } = dashboard

    useEffect(() => {
        setIsLoading(true)
        const allAreaStatusesOk =
            countServicesInAreas() === countHealthyServicesInListOfAreas(areas)
        const areaStatuses = areas.map((area) => area.status)

        if (allAreaStatusesOk) {
            setAllGood(true)
        } else if (areaStatuses.includes("DOWN")) {
            setAllGood(false)
            setHasDown(true)
        } else if (areaStatuses.includes("ISSUE")) {
            setAllGood(false)
            setHasIssue(true)
        } else setHasIssue(false)

        setIsLoading(false)
    }, [areas])
    const countServicesInAreas = () => {
        const services: Service[] = areas.flatMap((area) => area.services)
        return services.length
    }

    const countIssueServices = () => {
        const services: Service[] = areas.flatMap((area) => area.services)
        return services.filter((service) => service.record.status == "ISSUE")
            .length
    }

    const countDownServices = () => {
        const services: Service[] = areas.flatMap((area) => area.services)
        return services.filter((service) => service.record.status == "DOWN")
            .length
    }

    const opsMsgList = opsMessages.sort((a, b) =>
        a.severity > b.severity ? 1 : b.severity > a.severity ? -1 : 0
    )

    if (isLoading) return <CustomNavSpinner />

    if (allGood) {
        return (
            <StatusSummary>
                <Alert variant="success">
                    Alle våre systemer fungerer normalt
                </Alert>

                <div className="ops-container">
                    {(!hasIssue || !hasDown) &&
                        opsMsgList.map((opsMessage, i) => {
                            return (
                                <DeviationReportCard
                                    key={i}
                                    opsMessage={opsMessage}
                                    user={user}
                                />
                            )
                        })}
                </div>
            </StatusSummary>
        )
    } else {
        return (
            <StatusSummary>
                <div className="top-row">
                    <div className="deviation-button-wrapper">
                        <Button
                            variant="tertiary"
                            size="small"
                            icon={<Next />}
                            iconPosition="right"
                            onClick={() => router.push(RouterOpsMeldinger.PATH)}
                        >
                            Se alle driftsmeldinger
                        </Button>
                    </div>
                    <div>
                        {`Avvik på ${
                            countIssueServices() + countDownServices()
                        } av ${countServicesInAreas()} tjenester`}
                    </div>

                    <div className="planlagte-vedlikehold">
                        {/* Dette må synliggjøres når det er klart. HUSK: Dette er top-row seksjonen. Her skal altså bare tittel vises. */}
                    </div>
                </div>
                {opsMessages.length == 0 ? (
                    <div className="ops-container">
                        {hasIssue == true && !hasDown && (
                            <DeviationCardIfNoOpsMessage
                                status={"ISSUE"}
                                message={`Avvik på ${countIssueServices()} av ${countServicesInAreas()} tjenester`}
                            />
                        )}
                        {hasDown == true && (
                            <DeviationCardIfNoOpsMessage
                                status={"DOWN"}
                                message={`Avvik på ${
                                    countIssueServices() + countDownServices()
                                } av ${countServicesInAreas()} tjenester`}
                            />
                        )}
                    </div>
                ) : (
                    <div className="ops-container">
                        {opsMessages.map((opsMessage, i) => {
                            return (
                                <div key={i}>
                                    <DeviationReportCard
                                        key={i}
                                        opsMessage={opsMessage}
                                        user={user}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </StatusSummary>
        )
    }
}

const EditOpsButton = styled(Button)`
    height: 2rem;
    margin: -0.6rem 0.2rem 0;
    color: var(--a-gray-400);
`

const DeviationCardContainer = styled.div`
    position: relative;
    height: 100%;
    padding: 1rem 0;
    border: none;
    border-radius: 5px;
    border-left: 7.5px solid transparent;
    background: white;
    display: flex;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

    &:active:hover {
        background-color: var(--a-blue-100);
        color: black;
    }

    &:hover {
        cursor: pointer;

        .content {
            .navds-heading {
                text-decoration: none;
            }
        }
    }

    &.has-issue {
        border-left-color: var(--a-orange-200);
    }

    &.has-down {
        border-left-color: var(--a-red-200);
    }

    &.has-neutral {
        border-left-color: var(--a-blue-200);
    }

    .headercontent {
        padding-right: 1rem;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .topcontent {
        text-align: left;
        width: 100%;
        margin-bottom: 0.2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .navds-heading {
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }

    .opsMsgTime {
        color: var(--a-gray-500);
    }

    .opsMsgContainer {
        margin: -0.9rem 0;
        height: 2.8rem;
        padding-right: 1rem;

        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .content {
        text-align: left;
        width: 100%;

        margin-left: 1rem;

        display: flex;
        flex-direction: column;
    }

    :focus {
        outline: var(--a-border-focus) solid 2px;
    }
    :active {
        background: var(--a-surface-action-selected);
        color: white;
    }

    @media (min-width: 425px) {
        width: 425px;
    }
`

interface DeviationCardIfNoOpsI {
    status: string
    message: string
}

const DeviationCardIfNoOpsMessage = ({
    status,
    message,
}: DeviationCardIfNoOpsI) => {
    return (
        <DeviationCardContainer
            aria-label={message + ". Trykk her for mer informasjon"}
            className={"has-" + status.toLowerCase()}
        >
            <div className="content">
                <BodyShort>{message}</BodyShort>
            </div>
        </DeviationCardContainer>
    )
}

const handleEditOpsClick = (e, id) => {
    e.stopPropagation()
    router.push(RouterOpsMeldinger.PATH + `/${id}/RedigerMelding`)
}

interface DeviationCardI {
    opsMessage: OpsMessageI
    user: UserData
}

const DeviationReportCard = ({ opsMessage, user }: DeviationCardI) => {
    const { internalHeader, startTime, internalMessage, severity, id } =
        opsMessage

    const [modalOpen, setModalOpen] = useState(false)

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

    return (
        <DeviationCardContainer
            aria-label={
                opsMessage.internalHeader + ". Trykk her for mer informasjon"
            }
            className={
                !severity ? "has-neutral" : "has-" + severity.toLowerCase()
            }
            onClick={() => setModalOpen(!modalOpen)}
        >
            <div className="content">
                <div className="topcontent">
                    <div className="opsMsgTime">
                        {datePrettifyer(startTime)}
                    </div>

                    {approvedUsers.includes(user.navIdent) && (
                        <Tooltip
                            content="Rediger driftsmelding"
                            placement="right"
                        >
                            <EditOpsButton
                                icon={<Edit />}
                                aria-label="Rediger driftsmelding"
                                size="small"
                                variant="tertiary"
                                className={severity.toLowerCase()}
                                onClick={(e) => handleEditOpsClick(e, id)}
                            ></EditOpsButton>
                        </Tooltip>
                    )}
                </div>
                <div className="headercontent">
                    <Heading size="small">{internalHeader}</Heading>
                </div>
                <div className="opsMsgContainer">
                    <BodyShort>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: internalMessage,
                            }}
                        />
                    </BodyShort>
                </div>
            </div>
            <OpsMessageModal
                opsMessage={opsMessage}
                navIdent={user.navIdent}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </DeviationCardContainer>
    )
}

export default StatusOverview
