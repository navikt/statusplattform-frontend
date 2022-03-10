import Link from 'next/link'
import styled from 'styled-components'
import { SetStateAction, useContext, useState } from 'react';
import { useRouter } from 'next/router';


import { BodyShort, Heading, Panel } from '@navikt/ds-react';
import { Innholdstittel } from 'nav-frontend-typografi';
import CustomNavSpinner from '../../components/CustomNavSpinner';

import { Area, Service, ServiceHistory } from '../../types/navServices';
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext';
import { RouterTjenestedata } from '../../types/routes';
import { IncidentCard } from '../../components/Incidents';
import { useLoader } from '../../utils/useLoader';
import { fetchAreasContainingService } from '../../utils/areasAPI';
import { handleAndSetStatusIcon } from '../../components/PortalServiceTile';
import { fetchServiceHistory } from '../../utils/servicesAPI';


const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;

const CategoryContainer = styled.div`
    width: 100%;
    padding: 0;

    display: flex;
    flex-direction: column;

    .title-container {
        svg {
            margin-right: .6rem;
        }
        margin-bottom: 2rem;
    }

    .info-hover-text, .arrow {
        visibility: hidden;
    }

    .no-status-wrapper {
        :hover {
            .info-hover-text, .arrow {
                visibility: visible;
            }
        }
    }

    .no-status-wrapper {
        position: relative;
        display: inline-block;

        .info-hover-text {
            position: absolute;
            background: white;

            border-radius: 4px;

            top: -.7rem;
            padding: .7rem;

            width: 200px;
        }
        
        .arrow {
            position: absolute;
            top: 25%;
            right: 0;

            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-right: 10px solid white;
        }
    }

    button {
        margin: 32px 0 40px 0;
    }

    .top-row {
        margin-bottom: 3rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 50px;

        .navds-panel{width: 100%;}
        .navds-panel:first-child {
            -moz-box-shadow: 0 0 10px rgba(0,0,0, 0.2);
            -webkit-box-shadow: 0 0 10px rgba(0,0,0, 0.2);
            box-shadow: 0 0 10px rgba(0,0,0, 0.2);
        }
        .navds-panel:last-child {border: none; background: none; height: max-content;}

        @media(min-width: 825px) {
            flex-direction: row;
        }
    }
    
    @media (min-width: 650px) {
        padding: 0rem 2rem;
    }
`


const ServiceContainer = styled.div`
    min-width: 100px;
    min-height: 75px;

    padding: 1rem;
    /* background-color: var(--navds-semantic-color-canvas-background-light); */
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;


    /* Padding på alle sub-elementer for å ha spacing */
    & > * {
        padding: 1rem 0;
    }

`

const ServiceWrapper = styled.div`
    width: 100%;
`

const TjenestedataContent: React.FC<{service: Service}> = ({service}) => {
    const [showHistory, changeShowHistory] = useState(false)

    const {data: areasContainingService, isLoading, reload} = useLoader(() => fetchAreasContainingService(service.id), [])

    const router = useRouter()

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    if (!service) {
        return <ErrorParagraph>Kunne ikke hente tjenesten. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }

    return (
        <CategoryContainer>
            <div className="title-container"><Innholdstittel>{handleAndSetStatusIcon(service.status, true)}{service.name}</Innholdstittel></div>

            {/* <div>
                <Button variant="secondary" onClick={() => router.push(RouterOpprettVarsling.PATH)}><Bell/> Bli varslet ved avvik</Button> 
            </div> */}


            <div className="top-row">
                <Panel>
                    <ServiceContainer>
                        <ServiceWrapper>
                            <ServiceData service={service} areasContainingService={areasContainingService} />
                        </ServiceWrapper>
                    </ServiceContainer>
                </Panel>
                
                <IncidentCard descriptionOfIncident="Beskrivelse" status={service.status} timeframe='Tidsrom' titleOfIncident='Tittel' logLink='Loglenke' />
            </div>
    

            


            {/* <div>
                <Button onClick={() => changeShowHistory(!showHistory)} variant="secondary">
                    {showHistory ? "- Skjul tidligere avvik" : "+ Vis tidligere avvik"}
                </Button>
            </div> */}
            
            {/* {showHistory && */}
            <ServiceIncidentHistory service={service} />
            {/* } */}
        </CategoryContainer>
    )
}







/*------------------------------------------ Helpers below ------------------------------------------*/




const ServiceDataContainer = styled.div`
    &, .classified {
        display: flex;
        flex-direction: column;
    }    

    .separator {
        width: 100%;
        height: 1px;
        background-color: var(--navds-global-color-gray-400);
        margin: 16px 0;
    }

    a {
        color: var(--navds-semantic-color-link);
    }

    
`



const ServiceData: React.FC<{service: Service, areasContainingService: Area[]}> = ({service, areasContainingService}) => {
    const { navIdent } = useContext(UserStateContext)

    const regex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)


    const { type, serviceDependencies: dependencies, componentDependencies, id, monitorlink, team } = service

    return (
        <>
        {navIdent &&
            <ServiceDataContainer>
                <BodyShort spacing><b>Team</b></BodyShort>
                <BodyShort>{team}</BodyShort>

                <span className="separator" />
                    


                    
                    <BodyShort spacing><b>Avhengigheter til tjenester</b></BodyShort>

                    <div>
                        {dependencies.length > 0
                        ?
                            dependencies.map((element, index) => {

                                if(dependencies.length != index+1) {
                                    return (
                                        <Link key={id} href={RouterTjenestedata.PATH + element.id}>
                                            {element.name + ", "}
                                        </Link>
                                    )
                                }

                                return (
                                    <Link key={id} href={RouterTjenestedata.PATH + element.id} >
                                        {element.name}
                                    </Link>
                                )
                            })
                        :
                            <BodyShort>Ikke definert</BodyShort>
                        }
                    </div>


                    <span className="separator" />


                    <BodyShort spacing><b>Avhengigheter til komponenter</b></BodyShort>

                    {componentDependencies.length > 0 
                    ?
                        <div>
                            {componentDependencies.map((component, index) => {
                                if(componentDependencies.length != index+1) {
                                    return (
                                        <Link key={component.id} href={RouterTjenestedata.PATH + component.id}>
                                            {component.name + ", "}
                                        </Link>
                                    )
                                }

                                return (
                                    <Link href={RouterTjenestedata.PATH + component.id} key={component.id}>
                                        {component.name}
                                    </Link>
                                )
                            })}
                        </div>

                    :
                        <BodyShort>Ikke definert</BodyShort>
                    }

                    <span className="separator" />







                    <BodyShort spacing><b>Områder</b></BodyShort>
                    <ul>
                        {areasContainingService.map((area, index) => {
                            if(areasContainingService.length != index+1) {
                                return (
                                    <li key={area.id}>{area.name}, </li>
                                )
                            } return (
                                <li key={area.id}>{area.name}</li>
                            )
                        })}
                    </ul>

                    <span className="separator" />

                    <BodyShort spacing><b>Monitorlenke</b></BodyShort>
                    <BodyShort>{regex.test(monitorlink) ? <a href={monitorlink}>{monitorlink}</a> : "Ikke definert"}</BodyShort>
                </ServiceDataContainer>
            }
        </>
    )
}





/*------------------------------------------  ------------------------------------------*/



const PublicDataContainer = styled.div`
    display: flex;
    flex-flow: column;
    justify-content: center;
`


const ServiceIncidentHistory: React.FC<{service: Service}>= ({service}) => {
    const [isLast90Days, setIsLast90Days] = useState<boolean>(true)
    // TODO: Henting av tjenestehistorikkdata som driftsmeldinger og diverse
    const { data, isLoading, reload } = useLoader(() => fetchServiceHistory(service.id), [])

    if(isLoading) {
        return <CustomNavSpinner />
    }

    console.log(data)

    return (
        <PublicDataContainer>
            <span>
                <Heading size="medium" level="2" spacing>Historikk</Heading>
            </span>

            <TabHistory setIsLast90Days={setIsLast90Days} isLast90Days={isLast90Days} />
            <HistoryOfService service={service} isLast90Days={isLast90Days} serviceHistory={data} />

        </PublicDataContainer>
    )
}






const TabMenu = styled.ul`
    list-style: none;
    padding: 0;
    width: 100%;

    span:first-child {
        padding: 1rem 1rem 1rem 0;
    }

    span:not(:first-child) {
        padding: 1rem;
    }

    li {

        display: inline-block;

        :hover {
            cursor: pointer;
        }

        &.inactive {
            border-bottom: transparent 3px solid;
            
            :hover {
                border-bottom: var(--navds-global-color-blue-500) 3px solid;
            }
        }
        &.active {
            border-bottom: var(--navds-semantic-color-focus) 3px solid;
        }

        :focus, :active {
            background-color: transparent;
            outline: var(--navds-semantic-color-focus) 3px solid;
            box-shadow: 0 0 0 0;
            outline-offset: 3px;
        }

        a {
            text-decoration: none;
            color: black;
        }
    }
`

interface History {
    setIsLast90Days: React.Dispatch<SetStateAction<boolean>>,
    isLast90Days: boolean
}

const TabHistory = ({setIsLast90Days, isLast90Days}: History) => {

    return (
        <TabMenu>
            <span>
                <li className={isLast90Days ? "active" : "inactive"} onClick={() => setIsLast90Days(true)}>
                    <a href="#historyiioiok99">
                        Siste 90 dager
                    </a>
                </li>
            </span>
            <span>
                <li className={!isLast90Days ? "active" : "inactive"} onClick={() => setIsLast90Days(false)}>
                    <a href="#history">
                        Måned for måned
                    </a>
                </li>
            </span>
        </TabMenu>
    )
}








const HistoryContainer = styled.div`
`

const DailyOverview = styled.div`
    height: 92px;
    background: white;
    padding: 20px;

    border-radius: 4px;

    display: flex;
    flex-direction: row;
    gap: 8px;

    .entry {
        display: block;
        position: relative;

        height: 100%;
        width: 8px;
        border-radius: 2px;
        
        &.ok {
            background: var(--navds-global-color-green-500);
        }
        &.issue {
            background: var(--navds-global-color-orange-500);
        }
        &.down {
            background: var(--navds-global-color-red-500);
        }

        .entry-data {
            position: absolute;
        }
    }
`

const MonthlyOverview = styled.div``

const HistoryOfService: React.FC<{service: Service, isLast90Days: boolean, serviceHistory: ServiceHistory[]}> = ({service, isLast90Days, serviceHistory}) => {

    const mockList = [{status: "OK", title: "Oppe", message: "Ingen feil på tjeneste"},
        {status: "ISSUE", title: "Avvik på tjeneste", message: "Tjenesten er delvis nede grunnet problemer"},
        {status: "DOWN", title: "Nede", message: "Tjenesten var nede"}
    ]



    return (
        <HistoryContainer id="history">
            {isLast90Days
            ?
                <DailyOverview>
                    {mockList.map((entry, index) => {
                        return (
                            <span key={index} className={`entry ${entry.status.toLowerCase()}`}>
                                {/* <div className="entry-data" onMouseEnter={e => {
                                        setStyle({display: 'block'});
                                    }}
                                    onMouseLeave={e => {
                                        setStyle({display: 'none'})
                                    }}
                                >
                                    <Heading size="medium" level="3">
                                        {handleAndSetStatusIcon(entry.status)} {entry.title}
                                    </Heading>
                                    <BodyShort>
                                        {entry.message}
                                    </BodyShort>
                                </div> */}
                            </span>
                        )
                    })}
                </DailyOverview>
            :
                <MonthlyOverview>
                    månedlig
                </MonthlyOverview>
            }
        </HistoryContainer>
    )
}












// OLD, Might use later
const HistoryWrapper = styled.div`
    display: flex;
    gap: 3px;
    div {
        position: relative;
    }
    span {
        position: relative;
        background-color: grey;
        height: 34px;
        width: 7.6px;
        display: block;
        p {
            border: 1px solid black;
            background-color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 100;
            top: calc(32px/2 + 10px);
            transform: translateX(-50%);
            display: none;
            position: absolute;
        }
        .pointer-wrapper {
            position: absolute;
            height: 10px;
            top: 9px;
            z-index: 1001;
            width: 0;
            div {
                display: none;
                position: absolute;
            }
            .pointer-top {
                border: 9px solid transparent;
                border-bottom-color: black;
                top: calc(31px/2);
                transform: translateX(-28%);
                z-index: -10;
            }
            .pointer-bottom {
                border: 8px solid transparent;
                border-bottom-color: white;
                margin-left: 1px;
                margin-bottom: -1px;
                top: calc(35px/2);
                transform: translateX(-31%);
                z-index: 101;
            }
        }
        :hover {
            .pointer-top, .pointer-bottom, p {
                display: block;
            }
        }
    }
`
const Past90Days: React.FC<{service: Service | null}> = ({service}) => {
    // Array er et test-array. Må endres når vi får records inn på rett måte
    const test = Array.from(Array(10).keys())
    
    return (
        <HistoryWrapper>
            {test.map((e, index) => {
                return (
                    <div key={index}>
                        <span className={service.status}>
                            <div className="pointer-wrapper" >
                                <div className="pointer-top" />
                                <div className="pointer-bottom" />
                            </div>
                            <p className="hover-text">Statushistorikk under utvikling</p>
                        </span>
                    </div>
                )
            })}
        </HistoryWrapper>
    )
}
// ---


export default TjenestedataContent