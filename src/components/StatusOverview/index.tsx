import styled from 'styled-components'
import { toast } from 'react-toastify';

import { AreaServicesList } from '../../types/navServices'
import { countHealthyServices, countServicesInAreas, getListOfTilesThatFail, beautifyListOfStringsForUI } from '../../utils/servicesOperations';

import Panel from 'nav-frontend-paneler'
import { Bell } from '@navikt/ds-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { RouterAvvikshistorikk, RouterOpprettVarsling } from '../../types/routes';


const StatusOverviewContainer = styled.div`
    max-width: 1080px;
    width: 100%;
    padding: 0;
    margin: 50px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const StatusBannerContainer = styled(Panel)`
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .knapp-wrapper {
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
        max-width: 700px;
        margin-bottom: 16px;
    }

    @media (min-width: 500px) {
        flex-direction: row;

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
    display: inline-block;

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


    return (
        <StatusOverviewContainer>

            <StatusBannerContainer border={true}>
                <div>
                    <Heading spacing size="medium" level="4">
                        Avvik
                    </Heading>
                    <StatusSummary>
                        {numberOfHealthyServices == numberOfServices ?
                            (<>
                                {/* <span> */}
                                    <BodyShort className="bold" spacing>
                                        Ingen feil å melde
                                    </BodyShort>
                                {/* </span> */}
                            </>)
                        :
                            (<>
                                <BodyShort spacing>
                                    <span>Feil oppdaget i følgende områder:</span>
                                    {tilesThatFail.length > 1 ? 
                                        <span>
                                            {beautifyListOfStringsForUI(tilesThatFail)} 
                                        </span>
                                        :
                                        <span>
                                            {" " + tilesThatFail[0] + "."}
                                        </span>
                                    }
                                </BodyShort>
                            </>)
                        }
                    </StatusSummary>
                    <BodyShort size="small">Sist oppdatert: Ikke implementert</BodyShort>
                    
                </div>

                <div className="knapp-wrapper">
                    <Button variant="secondary" size="medium" onClick={() => router.push(RouterAvvikshistorikk.PATH)}>
                        Se avvikshistorikk
                    </Button>
                    <Button variant="secondary" size="medium" onClick={() => router.push(RouterOpprettVarsling.PATH)}>
                        <span><Bell /></span> <BodyShort>Bli varslet ved avvik</BodyShort>
                    </Button>
                </div>

            </StatusBannerContainer>
           
        </StatusOverviewContainer>
    )
}

export default StatusOverview