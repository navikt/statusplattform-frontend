import styled from 'styled-components'
import { useRouter } from 'next/router';

import { Bell } from '@navikt/ds-icons';
import { BodyShort, Button, Detail, Heading, Panel } from '@navikt/ds-react';

import { AreaServicesList } from '../../types/navServices'
import { countHealthyServices, countServicesInAreas, getListOfTilesThatFail, beautifyListOfStringsForUI, countFailingServices } from '../../utils/servicesOperations';
import { RouterAvvikshistorikk, RouterOpprettVarsling } from '../../types/routes';


const StatusSummary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;

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

    return (
        <StatusSummary>
            <DeviationReportCard status={"ISSUE"} titleOfDeviation={"Vi opplever større problemer med"} message={"Vi opplever problemer med flere av våre tjenester"}/>
            <DeviationReportCard status={"DOWN"} titleOfDeviation={"Vi opplever større problemer med"} message={"Vi opplever problemer med flere av våre tjenester"}/>
        </StatusSummary>
    )
}



const DeviationCardContianer = styled.button`
    position: relative;
    height: 100%;
    outline: transparent solid 2px;
    border: none;
    padding: 0;

    display: flex;
    
    .content {
        text-align: left;
        height: 100%;
        margin-left: 1.3rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        :hover{cursor: pointer;}
        :focus, :hover {
            .navds-heading {
                text-decoration: none;
            }
        }
    }

    .navds-heading {
        text-decoration: underline;
    }

    span {
        position: absolute;

        height: 100%;
        padding: 7px;
    }

    .ok {background: var(--navds-global-color-green-500);}
    .issue{background: var(--navds-global-color-orange-500);}
    .down{background: var(--navds-global-color-red-500);}

    :focus {
        outline: var(--navds-semantic-color-focus) solid 2px;
    }
    :active {background: var(--navds-semantic-color-interaction-primary-selected); color: white;}

    @media (min-width: 425px) {
        height: 80px;
        width: 425px;
    }
`


const DeviationReportCard: React.FC<{status: string, titleOfDeviation: string, message: string}> = ({status, titleOfDeviation, message}) => {
    return (
        <DeviationCardContianer aria-label={message + ". Trykk her for mer informasjon"}>
            <span className={status.toLowerCase()} />
            <div className="content">
                <Detail size="small">01.03.2022</Detail>
                <Heading size="small" level="3">{titleOfDeviation}</Heading>
                <BodyShort size="small">{message}</BodyShort>
            </div>
        </DeviationCardContianer>
    )
}



export default StatusOverview