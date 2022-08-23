import styled from 'styled-components'
import { useRouter } from 'next/router';

import { Clock } from '@navikt/ds-icons';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';

import { Area, Dashboard, Service } from '../../types/types'
import { countHealthyServicesInListOfAreas } from '../../utils/servicesOperations';
import { RouterAvvikshistorikk } from '../../types/routes';
import { useContext, useEffect, useState } from 'react';
import CustomNavSpinner from '../CustomNavSpinner';
import { OpsMessageI, SeverityEnum } from '../../types/opsMessage';
import { UserData } from '../../types/userData';
import { UserStateContext } from '../ContextProviders/UserStatusContext';


const StatusSummary = styled.div`
    margin-top: 1rem;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 32px;

    .top-row {
        width: 100%;

        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;

        div:nth-child(2) {
            text-align: center;
        }
        .avvikshistorikk-button {
            visibility: hidden;
        }
    }

    .navds-alert {
        width: 100%;
    }

    @media (min-width: 902px) {
        /* TODO: Se på dette, det kan breake symmetrien på dashbordene hvis avviksmeldinger > 1 */
        /* flex-flow: row wrap; */
    }
    @media (min-width: 1359px) {
        width: 100%;
    }
`


//TODO Create Incidents handler and UI

interface StatusOverviewI {
    dashboard: Dashboard
}

const StatusOverview = ({ dashboard }: StatusOverviewI) => {
    const router = useRouter()
    const [hasIssue, setHasIssue] = useState(false)
    const [hasDown, setHasDown] = useState(false)
    const [allGood, setAllGood] = useState(false)
    const [allNeutral, setAllNeutral] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const { areas, opsMessages } = dashboard

    const user = useContext(UserStateContext)
    
    useEffect(() => {
        setIsLoading(true)
        const allAreaStatusesOk = countServicesInAreas() === countHealthyServicesInListOfAreas(areas)
        const allAreaStatusesNeutral = countServicesInAreas() === countNeutralServicesInListOfAreas(areas)
        const areaStatuses = areas.map(area => area.status)

        if(allAreaStatusesOk) {
            setAllGood(true)
        }

        if(allAreaStatusesNeutral) {
            setAllNeutral(true)
        }

        if (areaStatuses.includes("DOWN")) {
            setAllGood(false)
            setAllNeutral(false)
            setHasDown(true)
        }else setHasDown(false)

        if (areaStatuses.includes("ISSUE")) {
            setAllGood(false)
            setAllNeutral(false)
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
        return services.filter(service => service.record.status == "ISSUE").length
    }

    const countNeutralServicesInListOfAreas = (areas: Area[]) => {
        const services: Service[] = areas.flatMap(area => area.services)
        return services.filter(service => service.record.status == null).length
    }

    const countDownServices = () => {
        const services: Service[] = areas.flatMap(area => area.services)
        return services.filter(service => service.record.status == "DOWN").length
    }





    if(isLoading) return <CustomNavSpinner />


    /*
        Hvis alt er good og ingen avviksmeldinger, viser vi bare en Alert med "Alt er good"
        Hvis alt er good og det er KUN nøytrale avviksmeldinger, viser vi en Alert med "Alt er good" etterfulgt av avviksmeldingene
        Hvis alt er good og det er avviksmeldinger, viser vi en Alert med "Alt er good" etterfulgt av avviksmeldingene
        ELSE - Hvis det er noe som ikke er good, viser vi en tekstbeskjed med "Avvik på X av Y tjenester" etterfulgt av avviksmeldingene
    */
    console.log(opsMessages.length)



// FORTSETT MED Å SE PÅ HVORFOR AVVIKSMELDINGER PLUTSELIG ER SKJULT. DETTE VAR WEIRD AF BRO!


    const opsHasNeutral: boolean = opsMessages.flatMap(message => message.severity == SeverityEnum.NEUTRAL).length > 0
    // console.log(opsMessages)
    if (allGood) {
        return (
            <StatusSummary>
                <div className="top-row">
                    <div className="deviation-button-wrapper">
                        <Button variant="tertiary" size="small" onClick={() => router.push(RouterAvvikshistorikk.PATH)}>Se avvikshistorikk <Clock /> </Button>
                    </div>
                    <div></div>
                    <div className="planlagte-vedlikehold">
                        {/* Dette må synliggjøres når det er klart. HUSK: Dette er top-row seksjonen. Her skal altså bare tittel vises. */}
                    </div>
                </div>

                <Alert variant="success" >
                    Alle våre systemer fungerer normalt
                </Alert>

                {(opsHasNeutral && (!hasIssue || !hasDown)) &&
                    opsMessages.map((opsMessage, i) => {
                        return (
                            <DeviationReportCard key={i} opsMessage={opsMessage} user={user} />
                        )
                    })
                }
            </StatusSummary>
        )
    }

    
    
    else {
        return (
            <StatusSummary>
                <div className="top-row">
                    <div className="deviation-button-wrapper">
                        <Button variant="tertiary" size="small" onClick={() => router.push(RouterAvvikshistorikk.PATH)}>Se avvikshistorikk <Clock /> </Button>
                    </div>
                    <div>
                        {!allNeutral &&
                            <>
                                {`Avvik på ${countIssueServices() + countDownServices()} av ${countServicesInAreas()} tjenester`}
                            </>
                        }
                    </div>
                    <div className="planlagte-vedlikehold">
                        {/* Dette må synliggjøres når det er klart. HUSK: Dette er top-row seksjonen. Her skal altså bare tittel vises. */}
                    </div>
                </div>

                {allNeutral
                    ?
                        opsMessages.length == 0 &&
                            <div className="ops-container">
                                {opsMessages.map((opsMessage, i) => {
                                    return (
                                        <DeviationReportCard key={i} opsMessage={opsMessage} user={user} />
                                    )
                                })}
                            </div>
                    :
                        opsMessages.length == 0 
                        ?
                            <div className="ops-container">
                                {(hasIssue==true && !hasDown) &&
                                    <DeviationCardIfNoOpsMessage status={"ISSUE"} message={`Avvik på ${countIssueServices()} av ${countServicesInAreas()} tjenester`} />
                                }
                                {hasDown==true &&
                                    <DeviationCardIfNoOpsMessage status={"DOWN"} message={`Avvik på ${countIssueServices() + countDownServices()} av ${countServicesInAreas()} tjenester`} />
                                }
                            </div>

                        :
                            <div className="ops-container">
                                {opsMessages.map((opsMessage, i) => {
                                    return (
                                        <div key={i}>
                                            {console.log(opsMessage)}
                                            <DeviationReportCard key={i} opsMessage={opsMessage} user={user} />
                                        </div>
                                    )
                                })}
                            </div>
                }

            </StatusSummary>
        )
    }
}



    

    // if(opsMessages.length == 0) {
    //     return (
    //         <StatusSummary>
    //             <div className="top-row">
    //                 <div className="deviation-button-wrapper">
    //                     <Button variant="tertiary" size="small" onClick={() => router.push(RouterAvvikshistorikk.PATH)}>Se avvikshistorikk <Clock /> </Button>
    //                 </div>
    //                 <div></div>
    //                 <div className="planlagte-vedlikehold">
    //                     {/* Dette må synliggjøres når det er klart. HUSK: Dette er top-row seksjonen. Her skal altså bare tittel vises. */}
    //                 </div>
    //             </div>

    //             {(hasIssue==true && !hasDown) &&
    //                 <DeviationCardIfNoOpsMessage status={"ISSUE"} message={`Avvik på ${countIssueServices()} av ${countServicesInAreas()} tjenester`} />
    //             }
    //             {hasDown==true &&
    //                 <DeviationCardIfNoOpsMessage status={"DOWN"} message={`Avvik på ${countIssueServices() + countDownServices()} av ${countServicesInAreas()} tjenester`} />
    //             }
    //             {allGood &&
    //                 <Alert variant="success" >Alle våre systemer fungerer normalt</Alert>
    //             }
    //         </StatusSummary>
    //     )
    // }





    // return (
    //     <StatusSummary>
    //         <div className="top-row">
    //             <div className="deviation-button-wrapper">
    //                 <Button className="avvikshistorikkbutton" variant="tertiary" size="small" onClick={() => router.push(RouterAvvikshistorikk.PATH)}>Se avvikshistorikk <Clock /> </Button>
    //             </div>
                
    //             <div>{`Avvik på ${countIssueServices() + countDownServices()} av ${countServicesInAreas()} tjenester`}</div>

    //             <div className="planlagte-vedlikehold">
    //                 {/* Dette må synliggjøres når vedlikeholdsmeldinger er klart. HUSK: Dette er top-row seksjonen. Her skal altså bare tittel vises. */}
    //             </div>
    //         </div>

    //         {(hasIssue || hasDown) &&
    //             <div className="ops-container">
    //                 {opsMessages.map((opsMessage, i) => {
    //                     return (
    //                         <DeviationReportCard key={i} opsMessage={opsMessage} user={user} />
    //                     )
    //                 })}
    //             </div>
    //         }


            
    //         {allGood
    //             ?
    //                 (opsHasNeutral
    //                     ?
    //                         <div className="ops-container"></div>
    //                     : 
    //                         <Alert variant="success" >Alle våre systemer fungerer normalt</Alert>
    //                 )
    //             :
    //                 <></>
    //         }
    //     </StatusSummary>
    // )
// }



const DeviationCardContainer = styled.button`
    position: relative;
    height: 100%;
    
    padding: 1rem .5rem;
    
    border: none;
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
        background: var(--navds-global-color-orange-100);
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

    &.has-neutral {
        background: var(--navds-global-color-blue-100);

        :hover {
            background: var(--navds-global-color-blue-300);
        }

        border-left-color: var(--navds-global-color-blue-500);
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

interface DeviationCardI {
    opsMessage: OpsMessageI
    user: UserData
}


const DeviationCardIfNoOpsMessage: React.FC<{status: string, message: string}> = ({status, message}) => {
    
    return (
        <DeviationCardContainer aria-label={message + ". Trykk her for mer informasjon"} className={"has-" + status.toLowerCase()}>
            <div className="content">
                <BodyShort>{message}</BodyShort>
            </div>
        </DeviationCardContainer>
    )
}

const DeviationReportCard = ({opsMessage, user}: DeviationCardI) => {
    const { affectedServices, endTime, startTime,  externalHeader, externalMessage, internalHeader, internalMessage, isActive, onlyShowForNavEmployees, severity } = opsMessage

    // TODO: When the solution is ready to open for the public, re-implemented the commented code (or change it to something else)
    // if(user.navIdent || (user.navIdent && onlyShowForNavEmployees == true)) {
        return (
            <DeviationCardContainer aria-label={opsMessage.internalHeader + ". Trykk her for mer informasjon"} className={"has-" + severity.toLowerCase()}>
                {/* <span className={status.toLowerCase()} /> */}
                <div className="content">
                    {/* <Detail size="small">01.03.2022</Detail> */}
                    <Heading size="small" level="3">{internalHeader}</Heading>
                    {/* <BodyShort size="small">{titleOfDeviation}</BodyShort> */}
                </div>
            </DeviationCardContainer>
        )
    // }

    
    // return (
    //     <DeviationCardContainer aria-label={opsMessage.externalHeader + ". Trykk her for mer informasjon"} className={"has-" + severity.toLowerCase()}>
    //         {/* <span className={status.toLowerCase()} /> */}
    //         <div className="content">
    //             {/* <Detail size="small">01.03.2022</Detail> */}
    //             <Heading size="small" level="3">{opsMessage.externalHeader}</Heading>
    //             {/* <BodyShort size="small">{titleOfDeviation}</BodyShort> */}
    //         </div>
    //     </DeviationCardContainer>
    // )
}




export default StatusOverview