import styled from 'styled-components'

import { Innholdstittel, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { BackButton } from '../../components/BackButton';
import { ErrorFilled, SuccessFilled, WarningFilled } from '@navikt/ds-icons';
import { Service } from '../../types/navServices';
import { useContext } from 'react';
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext';
import Lenke from 'nav-frontend-lenker';


const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;

const CategoryContainer = styled.div`
    width: 100%;
    
    padding: 0;
    
    @media (min-width: 560px) {
        padding: 1rem 3rem;
    }
`
const ServiceContainer = styled.div`
    min-width: 100px;
    min-height: 75px;

    padding: 1rem;
    background-color: var(--navBakgrunn);
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
    padding: 1rem 0;
`
const IncidentsWrapper = styled.span`
    padding: 2rem;
    width: 80%;
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

const TjenesteData: React.FC<{service: Service}> = ({service}) => {
    const { name, navIdent } = useContext(UserStateContext)

    
    if (!service) {
        return <ErrorParagraph>Kunne ikke hente tjenesten. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }


    return (
        <CategoryContainer>
            <BackButton />
            <CenterContent><Innholdstittel>{service.name}</Innholdstittel></CenterContent>
            <ServiceContainer>

                <ServiceWrapper key={service.name}>
                    <Systemtittel>
                        <StatusIcon>{formatStatusMessage(service)} </StatusIcon>
                        Tjenestenavn - {service.name}
                    </Systemtittel>

                    <IncidentsWrapper>
                        <Undertittel>Eksempelrapport</Undertittel>
                        <div>
                            <Past90Days service={service}/>
                        </div>
                    </IncidentsWrapper>
                </ServiceWrapper>

                {navIdent &&
                    <ServiceData service={service} />
                }

                <PublicAvailableData service={service} />

            </ServiceContainer>
        </CategoryContainer>
    )
}







/*------------------------------------------ Helpers below ------------------------------------------*/






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



/*------------------------------------------  ------------------------------------------*/


const ServiceDataWrapper = styled.div`
    .row {
        padding: 1rem;

        display: flex;
        flex-flow: row wrap;

        justify-content: center;
    }
    

    .column {
        flex-basis: 50%;

        display: flex;
        flex-flow: column wrap;
        align-items: center;

        .element {
            width: 200px;
        }
    }
`

const ServiceData: React.FC<{service: Service}> = ({service}) => {

    return (
        <ServiceDataWrapper>
            {(service.dependencies.length > 0) &&
                <div className="row">
                    {service.dependencies.length > 0 &&
                        <div className="column">
                            <div className="element">
                                <h3>Avhengigheter til tjenesten</h3>
                                <ul>

                                    {service.dependencies.map(dependency => {
                                        return (
                                            <li key={dependency.id}><Lenke href={"/TjenesteData/" + dependency.id} >{dependency.name}</Lenke></li>
                                        )})
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </div>
            }

            {service.monitorlink &&
                <div className="row">
                    {service.monitorlink &&
                        <div className="column">
                            <div className="element">
                                <h3>Monitorlink</h3>
                                {service.monitorlink}
                            </div>
                        </div>
                    }
                </div>
            }

            {(service.team.length > 0 || service.type) &&
                <div className="row">
                    {service.team.length > 0 &&
                        <div className="column">
                            <div className="element">
                                <h3>Team</h3>
                                {service.team}
                            </div>
                        </div>
                    }

                    {service.type.length > 0 &&
                        <div className="column">
                            <div className="element">
                                <h3>Type</h3>
                                {service.type}
                            </div>
                        </div>
                    }
                </div>
            }
        </ServiceDataWrapper>
    )
}






/*------------------------------------------  ------------------------------------------*/


const PublicDataContainer = styled.div`
    display: flex;
    flex-flow: row;

    justify-content: center;
`


const PublicAvailableData: React.FC<{service: Service}>= ({service}) => {
    
    // TODO: Henting av tjenestehistorikkdata som driftsmeldinger og diverse


    return (
        <PublicDataContainer>
            <div>
                <h3>Vedlikehold- og avvikshistorikk</h3>
                Ikke implementert
            </div>

        </PublicDataContainer>
    )
}


export default TjenesteData