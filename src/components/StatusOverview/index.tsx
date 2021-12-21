import styled from 'styled-components'

import { AreaServicesList } from '../../types/navServices'

import { Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { countHealthyServices, countServicesInAreas, getListOfTilesThatFail, beautifyListOfStringsForUI } from '../../utils/servicesOperations';
import { Knapp } from 'nav-frontend-knapper';
import { toast } from 'react-toastify';
import { Bell } from '@navikt/ds-icons';


const StatusOverviewContainer = styled.div`
    max-width: 1080px;
    width: 100%;
    padding: 0;
    margin: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
        p {
            margin: 5px 0;
        }
    }
`;

const StatusBannerContainer = styled.div`
    border-radius: 4px;
    background-color: white;    
    padding: 1rem 0;

    display: flex;
    justify-content: space-between;
    flex-direction: column;

    .knapp-wrapper {
        width: min-content;
        .knapp {
            width: max-content;
        }
        button:first-child {
            margin-bottom: 16px;
        }
    }

    div:first-child {
        padding-bottom: 1rem;
        max-width: 700px;
    }

    @media (min-width: 200px) {
        padding: 2rem 1rem;
    }
    @media (min-width: 500px) {
        flex-direction: row;
    }
    h2 {
        margin: 0 0 .5rem;
    }
`;

const KnappCustomized = styled(Knapp)`
	/* width: 7rem; */
    max-height: 62px;
    white-space: normal;
    transition: 0.4s;
    text-transform: none;
    :hover {
        transition: 0.4s;
        background-color: var(--navBla);
        color: white;
    }
    @media(min-width: 45rem){
        align-self: center;
    }
    span:nth-child(2) {
        display: none;
    }
`;

const OverviewComponents = styled.div`
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    @media (min-width: 350px){
        flex-direction: row;
        justify-content: space-between;
    }
`;
const StatusContainer = styled.div`
    width: calc(50% - 1rem);
    max-width: none;
`

const IconHeader = styled.div`
    width: 100%;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    span {
        margin-right: 10px;
        font-size: 2rem;
    }
`

const CirclesContainer = styled.div`
    max-width: 30rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
`;

const IncidentsAndStatusCircleWrapper = styled.div`
    border: 2px solid transparent;
    border-radius: 50%;
`;

const MaintenanceStatusCircleWrapper = styled.div`
    border: 2px solid transparent;
    border-radius: 50%;
`;

const MaintenanceContainer = styled.div`
    width: calc(50% - 1rem);
    max-width: none;
`

const StatusSummary = styled.p`
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    display: inline-block;
`


//TODO Create Incidents handler and UI

const StatusOverview = (props: AreaServicesList) => {
    const numberOfServices: number = countServicesInAreas(props)
    const numberOfHealthyServices: number = countHealthyServices(props)
    const tilesThatFail: string[] = getListOfTilesThatFail(props)

    const handleRedirect = () => {
        toast.info("Ikke implementert enda")
    }

    return (
        <StatusOverviewContainer>

            <StatusBannerContainer>
                <div>
                    <Systemtittel>Avvik</Systemtittel>
                    <StatusSummary>
                        {numberOfHealthyServices == numberOfServices ?
                            (<>
                                <span>
                                    Ingen feil å melde
                                </span>
                            </>)
                        :
                            (<>
                                <span>
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
                                </span>
                            </>)
                        }
                    </StatusSummary>
                    <Undertekst>Sist oppdatert: Ikke implementert</Undertekst>
                </div>
                <div className="knapp-wrapper">
                    <KnappCustomized onClick={handleRedirect}>
                        Se avvikshistorikk
                    </KnappCustomized>
                    <KnappCustomized onClick={handleRedirect}>
                        <Bell /> Bli varslet ved avvik
                    </KnappCustomized>
                </div>
                {/* <Link href="/IncidentsPage"> */}
                {/* </Link> */}
            </StatusBannerContainer>
            {/*
            <OverviewComponents>
                <StatusContainer>
                    <IconHeader>
                        <span><Calender /></span>
                        <div>
                            <Systemtittel>
                                Hendelser
                                <Undertekst> siste 48 timene</Undertekst>
                            </Systemtittel>
                        </div>
                    </IconHeader>
                <CirclesContainer>

                        <IncidentsAndStatusCircleWrapper>
                            <NavInfoCircle topText="Hendelser" centerTextLeft="0" centerTextRight="16" bottomText="Siste 24 timene"/>
                        </IncidentsAndStatusCircleWrapper>

                        <MaintenanceStatusCircleWrapper>
                            <NavInfoCircle topText="Systemer" centerTextLeft={numberOfHealthyServices} centerTextRight={numberOfServices} bottomText="Oppe"/>
                        </MaintenanceStatusCircleWrapper>

                    </CirclesContainer>
                </StatusContainer>
                <MaintenanceContainer>
                    <IconHeader>
                        <MaintenanceScheduling />
                    </IconHeader>
                </MaintenanceContainer>

            </OverviewComponents>*/}

        </StatusOverviewContainer>
    )
}

export default StatusOverview