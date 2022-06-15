import styled from 'styled-components'
import { useRouter } from 'next/router';

import { Bell } from '@navikt/ds-icons';
import { Alert, BodyShort, Button, Detail, Heading, Panel } from '@navikt/ds-react';

import { AreaServicesList, Service } from '../../types/navServices'
import { countHealthyServices, countServicesInAreas, getListOfTilesThatFail, beautifyListOfStringsForUI, countFailingServices } from '../../utils/servicesOperations';
import { RouterAvvikshistorikk, RouterOpprettVarsling } from '../../types/routes';
import { useEffect, useState } from 'react';
import CustomNavSpinner from '../CustomNavSpinner';
import { OpsMessageI } from '../../types/opsMessage';


const StatusSummary = styled.div`
    margin-top: 1rem;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 32px;

    .navds-alert {
        width: 100%;
    }

    @media (min-width: 902px) {
        flex-flow: row wrap;
    }
    @media (min-width: 1359px) {
        width: 100%;
    }
`


//TODO Create Incidents handler and UI

const StatusOverview = ({areas}: AreaServicesList) => {
    const router = useRouter()
    const [hasIssue, setHasIssue] = useState(false)
    const [hasDown, setHasDown] = useState(false)
    const [allGood, setAllGood] = useState(false)
    const [opsMessages, changeOpsMessages] = useState<OpsMessageI[]>([])

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const areaStatusesOk = areas.map(area => area.status == "OK")
        const areaStatuses = areas.map(area => area.status)

        if(areas.map(a => a.status == "OK").length == areas.length) {
            setAllGood(true)
        }

        if (areaStatuses.includes("DOWN")) {
            setAllGood(false)
            setHasDown(true)
        }else setHasDown(false)

        if (areaStatuses.includes("ISSUE")) {
            setAllGood(false)
            setHasIssue(true)
        }else setHasIssue(false)


        setIsLoading(false)
    }, [areas])

    const countServicesInAreas = () => {
        const services: Service[] = areas.flatMap(area => area.services)
        return services.length
    }

    const countIssueServices = () => {
        const services: Service[] = areas.flatMap(area => area.services)
        return services.filter(service => service.status == "ISSUE").length
    }

    const countDownServices = () => {
        const services: Service[] = areas.flatMap(area => area.services)
        return services.filter(service => service.status == "DOWN").length
    }



    if(isLoading) return <CustomNavSpinner />







    
    if(opsMessages.length == 0) {
        return (
            <StatusSummary>
                {(hasIssue==true && !hasDown) &&
                    <DeviationCardIfNoOpsMessage status={"ISSUE"} message={`Avvik på ${countIssueServices()} av ${countServicesInAreas()} tjenester`} />
                }
                {hasDown==true &&
                    <DeviationCardIfNoOpsMessage status={"DOWN"} message={`Avvik på ${countIssueServices() + countDownServices()} av ${countServicesInAreas()} tjenester`} />
                }
                {allGood &&
                    <Alert variant="success" >Alle våre systemer fungerer normalt</Alert>
                }
            </StatusSummary>
        )
    }


    return (
        <StatusSummary>
            {hasIssue==true &&
                <DeviationCardIfNoOpsMessage status={"ISSUE"} message={`Avvik på ${countIssueServices()} av ${countServicesInAreas()} tjenester`} />
            }
            {hasDown==true &&
                <DeviationCardIfNoOpsMessage status={"DOWN"} message={`Nedetid og avvik på ${countIssueServices()} av ${countServicesInAreas()} tjenester`} />
            }
            {allGood &&
                <Alert variant="success" >Alle våre systemer fungerer normalt</Alert>
            }
        </StatusSummary>
    )
}



const DeviationCardContainer = styled.button`
    position: relative;
    height: 100%;
    
    border: none;
    padding: 1rem .5rem;

    border-radius: 5px;
    border-left: 7.5px solid transparent;

    display: flex;

    &:hover{
        cursor: pointer;

        .content {

            .navds-heading {
                text-decoration: none;
            }
        }
    }
    
    &.has-issue {
        background: var(--navds-semantic-color-feedback-warning-background);
        border-color: var(--navds-semantic-color-feedback-warning-background);

        :hover {
            background: var(--navds-global-color-orange-300);
            border-color: var(--navds-semantic-color-feedback-warning-icon);
        }

        border-left-color: var(--navds-semantic-color-feedback-warning-icon);
    }

    &.has-down {
        background: var(--navds-global-color-red-100);

        :hover {
            background: var(--navds-global-color-red-300);
        }

        border-left-color: var(--navds-global-color-red-500);
    }

    
    .content {
        text-align: left;
        width: 100%;
        height: 100%;
        margin-left: 1.3rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        :focus {
            .navds-heading {
                text-decoration: none;
            }
        }
    }

    .navds-heading {
        text-decoration: underline;
    }

    :focus {
        outline: var(--navds-semantic-color-focus) solid 2px;
    }
    :active {background: var(--navds-semantic-color-interaction-primary-selected); color: white;}

    @media (min-width: 425px) {
        width: 425px;
    }
`

const DeviationCardIfNoOpsMessage: React.FC<{status: string, message: string}> = ({status, message}) => {
    
    return (
        <DeviationCardContainer aria-label={message + ". Trykk her for mer informasjon"} className={"has-"+status.toLowerCase()}>
            <div className="content">
                <BodyShort size="small">{message}</BodyShort>
            </div>
        </DeviationCardContainer>
    )
}

const DeviationReportCard: React.FC<{status: string, titleOfDeviation: string, message: string}> = ({status, titleOfDeviation, message}) => {
    
    return (
        <DeviationCardContainer aria-label={message + ". Trykk her for mer informasjon"} className={"has-"+status.toLowerCase()}>
            {/* <span className={status.toLowerCase()} /> */}
            <div className="content">
                {/* <Detail size="small">01.03.2022</Detail> */}
                <Heading size="small" level="3">{titleOfDeviation}</Heading>
                <BodyShort size="small">{titleOfDeviation}</BodyShort>
            </div>
        </DeviationCardContainer>
    )
}



export default StatusOverview