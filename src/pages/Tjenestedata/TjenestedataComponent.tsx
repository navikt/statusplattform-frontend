import styled from 'styled-components'
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link'

import Lenke from 'nav-frontend-lenker';
import { Innholdstittel, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { Bell, ErrorFilled, SuccessFilled, WarningFilled } from '@navikt/ds-icons';
import { BodyShort, Button, Heading } from '@navikt/ds-react';

import { Area, Service } from '../../types/navServices';
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext';
import { RouterOpprettVarsling, RouterTjenestedata } from '../../types/routes';
import { useRouter } from 'next/router';
import { IncidentCard } from '../../components/Incidents';
import { useLoader } from '../../utils/useLoader';
import CustomNavSpinner from '../../components/CustomNavSpinner';
import { fetchAreasContainingService } from '../../utils/areasAPI';


const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;

const CategoryContainer = styled.div`
    width: 100%;
    padding: 0;

    button {
        margin: 32px 0 40px 0;
    }
    
    @media (min-width: 650px) {
        width: 650px;
        padding: 1rem 3rem;
    }
`

const ServiceContainer = styled.div`
    min-width: 100px;
    min-height: 75px;

    padding: 1rem;
    /* background-color: var(--navBakgrunn); */
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

const StatusIcon = styled.span`
    .up {
        color: var(--navGronn);
    }
    .down {
        color: var(--redError)
    }
    .issue {
        color: var(--navOransje)
    }
`

const CenterContent = styled.div`
    text-align: center;
    padding: 1rem;
`

const formatStatusMessage = (serviceToFormat) =>   {
    switch (serviceToFormat.status) {
        case "OK":
            return (<SuccessFilled className="up" />)
        case "DOWN":
            return (<ErrorFilled className="down" />)
        case "ISSUE":
            return (<WarningFilled className="issue" />)
        default:
            break
    }
}

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
            <CenterContent><Innholdstittel>{service.name}</Innholdstittel></CenterContent>

            <Button variant="secondary" onClick={() => router.push(RouterOpprettVarsling.PATH)}><Bell/> Bli varslet ved avvik</Button> 
    
            <IncidentCard descriptionOfIncident="Beskrivelse" status={service.status} timeframe='Tidsrom' titleOfIncident='Tittel' logLink='Loglenke' />

            <ServiceContainer>
                <ServiceWrapper>
                    <ServiceData service={service} areasContainingService={areasContainingService} />
                </ServiceWrapper>
            </ServiceContainer>


            <Button onClick={() => changeShowHistory(!showHistory)} variant="secondary">
                {showHistory ? "- Skjul tidligere avvik" : "+ Vis tidligere avvik"}
            </Button>
            
            {showHistory &&
                <ServiceIncidentHistory service={service} />
            }
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


    const { type, dependencies, id, monitorlink, team } = service

    return (
        <>
        {navIdent &&
            <ServiceDataContainer>

                <BodyShort spacing><b>Team</b></BodyShort>
                <BodyShort>{team}</BodyShort>
                <span className="separator" />

                <BodyShort spacing><b>Type</b></BodyShort>
                <BodyShort>{type}</BodyShort>
                <span className="separator" />
                    
                    <BodyShort spacing><b>Avhengigheter</b></BodyShort>

                    <BodyShort>
                        {dependencies.length > 0 ?
                            dependencies.map((element, index) => {

                                if(dependencies.length != index+1) {
                                    return (
                                        <a key={id} href={RouterTjenestedata.PATH + element.id}>
                                            {element.name + ", "}
                                        </a>
                                    )
                                }

                                return (
                                    <>
                                        <a href={RouterTjenestedata.PATH + element.id} >{element.name}</a>
                                    </>
                                )
                            })
                        :
                            <BodyShort>Ikke definert</BodyShort>
                        }
                    </BodyShort>
                    <span className="separator" />

                    <BodyShort spacing><b>Områder</b></BodyShort>
                        {areasContainingService.map((element, index) => {
                            if(areasContainingService.length != index+1) {
                                return (
                                    element.name + ", "
                                )
                            }return (
                                element.name
                            )
                        })}
                    <BodyShort>
                    
                    </BodyShort>
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
    
    // TODO: Henting av tjenestehistorikkdata som driftsmeldinger og diverse


    return (
        <PublicDataContainer>
            <span>
                <Heading size="medium" level="2" spacing>Vedlikehold- og avvikshistorikk</Heading>
            </span>

            <div>
                <IncidentCard descriptionOfIncident='Beskrivelse' status='DOWN' timeframe='Tidsrom' titleOfIncident='Tittel' logLink='Loglenke' />
            </div>

        </PublicDataContainer>
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