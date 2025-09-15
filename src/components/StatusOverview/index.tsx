import router, { useRouter } from "next/router"
import styled from "styled-components"

import { PencilIcon, ChevronRightIcon } from "@navikt/aksel-icons"
import { MenuElipsisHorizontalIcon } from "@navikt/aksel-icons"
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
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;

    .noOpsContainer {
        max-height: 7.5rem !important;
    }

    .top-row {
        width: 100%;
        display: flex;
        justify-content: right;
        float: right;

        .affectedservices {
            position: absolute;
            left: 50%;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
        }
    }

    .ops-container {
        display: grid;
        row-gap: 5rem;
        column-gap: 2rem;
        grid-template-rows: repeat(1, 7.5rem);
        overflow: hidden;

        @media (min-width: 800px) {
            grid-template-columns: repeat(2, 425px);
            grid-template-rows: repeat(1, 7.5rem);
        }

        @media (min-width: 1150px) {
            grid-template-columns: repeat(3, 425px);
            grid-template-rows: repeat(1, 7.5rem);
        }

        @media (min-width: 1600px) {
            grid-template-columns: repeat(3, 425px);
            grid-template-rows: repeat(1, 7.5rem);
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
        const activeOpsmessages = opsMessages.map((opsMsg) => opsMsg.isActive)

        if (allAreaStatusesOk && activeOpsmessages.length == 0) {
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
                <div className="top-row">
                    <div className="deviation-button-wrapper">
                        <Button
                            variant="tertiary"
                            size="small"
                            icon={<ChevronRightIcon />}
                            iconPosition="right"
                            onClick={() => router.push(RouterOpsMeldinger.PATH)}
                        >
                            Se alle driftsmeldinger
                        </Button>
                    </div>
                </div>
                <Alert variant="success">
                    Alle tjenestene fungerer normalt
                </Alert>
                {opsMsgList.length != 0 && (
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
                )}
            </StatusSummary>
        )
    } else {
        return (
            <StatusSummary>
                <div className="top-row">
                    {opsMessages.length != 0 && (
                        <div className="affectedservices">
                            {`Avvik på ${
                                countIssueServices() + countDownServices()
                            } av ${countServicesInAreas()} tjenester`}
                        </div>
                    )}
                    <div className="deviation-button-wrapper">
                        <Button
                            variant="tertiary"
                            size="small"
                            icon={<ChevronRightIcon />}
                            iconPosition="right"
                            onClick={() => router.push(RouterOpsMeldinger.PATH)}
                        >
                            Se alle driftsmeldinger
                        </Button>
                    </div>
                </div>
                {opsMessages.length == 0 ? (
                    <div className="noOpsContainer">
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

const PencilIconOpsButton = styled(Button)`
    height: 2rem;
    margin: -0.6rem 0.2rem 0;
    color: var(--a-gray-400);
`

const ReadOpsButton = styled(Button)`
    height: 2rem;
    margin: -0.6rem 0.2rem 0;
    color: var(--a-gray-400);
`

const DeviationCardContainer = styled.div`
    position: relative;
    height: fit-content;
    min-height: 7rem;
    padding: 0.75rem 0 1rem;
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

    &.noOps {
        min-height: 3rem !important;
        max-width: 17rem;
        padding: 0.8rem 0 0 1.1rem;
    }

    &.has-issue {
        border-left-color: var(--a-orange-200);
        :hover {
            background: var(--a-orange-50);
        }
    }

    &.has-down {
        border-left-color: var(--a-red-200);
        :hover {
            background: var(--a-red-50);
        }
    }

    &.has-neutral {
        border-left-color: var(--a-blue-200);
        :hover {
            background: var(--a-blue-50);
        }
    }

    .headercontent {
        padding-right: 1rem;

        overflow: hidden;
        display: -webkit-box;

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
            overflow: hidden;
            display: -webkit-box;

            -webkit-box-orient: vertical;
        }
    }

    .opsMsgTime {
        color: var(--a-gray-500);
    }

    .opsMsgContainer {
        margin: -0.9rem 0;
        height: fit-content;
        max-height: 2.8rem;
        padding-right: 1rem;

        overflow: hidden;
        text-overflow: clip;
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
            className={"noOps has-" + status.toLowerCase()}
        >
            <div className="content">
                <BodyShort>{message}</BodyShort>
            </div>
        </DeviationCardContainer>
    )
}

const handlePencilIconOpsClick = (e, id) => {
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

                    <div className="opsMsgButtons">
                        {approvedUsers.includes(user.navIdent) && (
                            <Tooltip
                                content="Rediger driftsmelding"
                                placement="right"
                            >
                                <PencilIconOpsButton
                                    icon={<PencilIcon />}
                                    aria-label="Rediger driftsmelding"
                                    size="small"
                                    variant="tertiary"
                                    className={severity.toLowerCase()}
                                    onClick={(e) => handlePencilIconOpsClick(e, id)}
                                ></PencilIconOpsButton>
                            </Tooltip>
                        )}
                    </div>
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
