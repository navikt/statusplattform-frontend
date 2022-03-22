import styled from 'styled-components'
import { useRouter } from 'next/router';

import { Bell } from '@navikt/ds-icons';
import { Alert, BodyShort, Button, Detail, Heading, Panel } from '@navikt/ds-react';

import { AreaServicesList } from '../../types/navServices'
import { countHealthyServices, countServicesInAreas, getListOfTilesThatFail, beautifyListOfStringsForUI, countFailingServices } from '../../utils/servicesOperations';
import { RouterAvvikshistorikk, RouterOpprettVarsling } from '../../types/routes';
import { useEffect, useState } from 'react';
import CustomNavSpinner from '../CustomNavSpinner';


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

const StatusOverview = (props: AreaServicesList) => {
    const router = useRouter()
    const [hasIssue, setHasIssue] = useState(false)
    const [hasDown, setHasDown] = useState(false)
    const [allGood, setAllGood] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // setIsLoading(true)
        const areaStatusesOk = props.areas.map(area => area.status == "OK")
        const areaStatuses = props.areas.map(area => area.status)
        
        if(props.areas.map(a => a.status == "OK").length == props.areas.length) {
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


        // setIsLoading(false)
    }, [props])

    // if(isLoading) return <CustomNavSpinner />


    return (
        <StatusSummary>
            {hasIssue==true &&
                <DeviationReportCard status={"ISSUE"} titleOfDeviation={"Vi opplever større problemer med"} message={"Vi opplever problemer med flere av våre tjenester"}/>
            }
            {hasDown==true &&
                <DeviationReportCard status={"DOWN"} titleOfDeviation={"Vi opplever større problemer med"} message={"Vi opplever problemer med flere av våre tjenester"}/>
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


const DeviationReportCard: React.FC<{status: string, titleOfDeviation: string, message: string}> = ({status, titleOfDeviation, message}) => {
    
    return (
        <DeviationCardContainer aria-label={message + ". Trykk her for mer informasjon"} className={"has-"+status.toLowerCase()}>
            {/* <span className={status.toLowerCase()} /> */}
            <div className="content">
                <Detail size="small">01.03.2022</Detail>
                <Heading size="small" level="3">{titleOfDeviation}</Heading>
                <BodyShort size="small">{message}</BodyShort>
            </div>
        </DeviationCardContainer>
    )
}



export default StatusOverview