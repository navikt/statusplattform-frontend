import styled from 'styled-components'
import { useRouter } from 'next/router';

import { Bell } from '@navikt/ds-icons';
import { BodyShort, Button, Detail, Heading, Panel } from '@navikt/ds-react';

import { AreaServicesList } from '../../types/navServices'
import { countHealthyServices, countServicesInAreas, getListOfTilesThatFail, beautifyListOfStringsForUI, countFailingServices } from '../../utils/servicesOperations';
import { RouterAvvikshistorikk, RouterOpprettVarsling } from '../../types/routes';


const StatusOverviewContainer = styled.div`
    width: 100%;
    padding: 0;
    margin: 50px 0;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    /* Temporary width-adjustments */
    @media(min-width: 425px) {
        width: 425px;
    }
    @media(min-width: 902px) {
        width: 882px;
    }
    @media(min-width: 1359px) {
        width: 1339px;
    }
`;

const StatusBannerContainer = styled.div`
    background-color: transparent;

    /* display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-direction: column; */

    .button-wrapper {
        display: flex;
        flex-direction: column;

        span {
            vertical-align: middle;
            height: 24px;
        }
        
        button:first-child {
            margin-bottom: 16px;
        }
    }

    div:first-child {
        /* max-width: 700px;
        margin-bottom: 16px; */
    }

    @media (min-width: 500px) {
        /* flex-direction: row; */

        div:first-child {
            margin-bottom: 0;
        }
    }
    
    h2 {
        margin: 0 0 .5rem;
    }
`;

const StatusSummary = styled.div`
    margin: 0;
    font-size: 1rem;
    font-weight: bold;

    display: flex;
    flex-flow: row wrap;
    gap: 32px;


    .deviation-container {
        display: flex;
        flex-direction: row;
    }

    .bold {
        font-weight: bold;
    }
`


//TODO Create Incidents handler and UI

const StatusOverview = (props: AreaServicesList) => {
    const numberOfServices: number = countServicesInAreas(props)
    const numberOfHealthyServices: number = countHealthyServices(props)
    const tilesThatFail: string[] = getListOfTilesThatFail(props)

    const router = useRouter()
    console.log(numberOfHealthyServices)

    return (
        <StatusOverviewContainer>

            <StatusBannerContainer>
                <div className="deviation-container">
                    <StatusSummary>
                        <DeviationReportCard status={"ISSUE"} titleOfDeviation={"Vi opplever større problemer med"} message={"Vi opplever problemer med flere av våre tjenester"}/>
                        <DeviationReportCard status={"DOWN"} titleOfDeviation={"Vi opplever større problemer med"} message={"Vi opplever problemer med flere av våre tjenester"}/>
                    </StatusSummary>
                    
                </div>

                {/* <div className="button-wrapper">
                    <Button variant="secondary" size="medium" onClick={() => router.push(RouterAvvikshistorikk.PATH)}>
                        Se avvikshistorikk
                    </Button>
                    <Button variant="secondary" size="medium" onClick={() => router.push(RouterOpprettVarsling.PATH)}>
                        <span><Bell /></span> <BodyShort>Bli varslet ved avvik</BodyShort>
                    </Button>
                </div> */}

            </StatusBannerContainer>
           
        </StatusOverviewContainer>
    )
}



const DeviationCardContianer = styled.div`
    height: 88px;

    display: flex;

    .content {
        /* Temporary width-adjustments */
        @media(min-width: 425px) {
            width: 425px;
        }
        @media(min-width: 902px) {
            width: 882px;
        }
        @media(min-width: 1359px) {
            width: 1339px;
        }
    }



    .ok, .issue, .down {
        padding: 7px;
        margin-right: 1.3rem;
    }

    .ok {background: var(--navds-global-color-green-500);}
    .issue{background: var(--navds-global-color-orange-500);}
    .down{background: var(--navds-global-color-red-500);}

    @media (min-width: 425px) {
        width: 425px;
    }
`


const DeviationReportCard: React.FC<{status: string, titleOfDeviation: string, message: string}> = ({status, titleOfDeviation, message}) => {
    return (
        <DeviationCardContianer>
            <span className={status.toLowerCase()} />
            <div className="content">
                <Detail size="small" spacing>01.03.2022</Detail>
                <Heading spacing size="small" level="3">{titleOfDeviation}</Heading>
                <BodyShort size="small">{message}</BodyShort>
            </div>
        </DeviationCardContianer>
    )
}



export default StatusOverview