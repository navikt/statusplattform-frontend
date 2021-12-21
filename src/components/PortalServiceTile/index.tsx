import styled from 'styled-components'
import { useContext } from "react";

import { WarningCircleOrange, NoStatusAvailableCircle, PlannedMaintenanceCircle, SuccessStrokeCustomized, ErrorCloseCustomized } from '../../components/TrafficLights'
import { getIconsFromGivenCode } from '../../utils/servicesOperations'
import { Area, MaintenanceObject} from '../../types/navServices'
import { FilterContext } from '../../components/ContextProviders/FilterContext';

import { Expand, Collapse, Divide, SuccessStroke, AutomaticSystem } from '@navikt/ds-icons'
import Panel from 'nav-frontend-paneler';
import { Systemtittel, Undertittel } from "nav-frontend-typografi";
import Lenke from 'nav-frontend-lenker';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { EtikettAdvarsel, EtikettFokus, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';






const EkspanderbartpanelCustomized = styled(Ekspanderbartpanel)<{alignment: string}>`
    margin: 0 16px;
    width: 100%;


    .top-content {
        .etikett-container {
            margin-right: 5px;
            display: flex;
            gap: 12px;
        }
    }

    @media (min-width: 425px) {
        width: 425px;
        .top-content {
            .etikett-container {
                margin-right: 0;
            }
        }
    }

    display: flex;
    flex-direction: column;

    //Styrer om panelet skal strekke etter høyden eller ikke basert på prop i render
    align-self: ${(props): any => (props.alignment)};

    .maintenance-message {
        padding: 1px;
        width: 100%;
        color: grey;
        
        font-size: 1rem;
        font-weight: normal;
        font-style: italic;
    }

    
`

const PanelCustomized = styled(Panel)<{alignment: string}>`
    margin: 0 5px;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    justify-content: space-between;
    > div {
        padding: 1rem;
        h2 svg:first-child {
            width: 1.778rem;
            height: 1.778rem;
            margin-left: 10px;
        }
        h2 {
            font-size: 1.25rem;
        }
    }
    @media (min-width: 468px){
        h2 svg:first-child {
            display: block;
        }
    }
    @media (min-width: 600px) {
        width: 290px;
    }
    
    //Styrer om panelet skal strekke etter høyden eller ikke basert på prop i render
    align-self: ${(props): any => (props.alignment)};
`;

const SystemtittelCustomized = styled(Systemtittel)`
    border-radius: 10px;
    background-color: white;
    height: 50px;
    display: flex;
    flex-direction: row;
    span {
        display: flex;
        align-items: center;
        /* text-overflow: hidden;
        overflow: hidden; */
    }
    svg {
        margin-right: 10px;
            
        top: 50%;
        align-items: center;
    }
`;

const ServicesList = styled.ul`
    margin-left:0;
    border-radius:0 0 10px 10px;
    color: black;
    background-color: white;

    list-style: none;
    padding: 0;
    
    > li {
        list-style-type: none;

        display: flex;
        justify-content: flex-start;
        section {
            display: flex;
            align-items: center;
        }
        section:nth-child(2) {
            margin-left: 10px;

            white-space: normal;
            word-break: break-word;
        }
    }

    a {
        display: flex;
    }
    
    @media (min-width: 250px){
        > li {
            margin: 5px 0px 5px 0px;
        }
    }
`;

const CenteredExpandRetractSpan = styled.button`
    background-color: white;
    border: none;
    padding: 1rem;
    display: flex;
    justify-content: center;
    :hover {
        span {
            text-decoration: underline;
        }
        -webkit-box-shadow:0px 1px 0 black;
        -moz-box-shadow:0px 1px 0 black;
        box-shadow: #a0a0a0 0 2px 1px 0;
        cursor: pointer;
    }
`

const LenkeCustomized = styled(Lenke)`
    text-decoration: none;
    :hover {
        text-decoration: underline;
    }
`


const handleAndSetNavIcon = (ikon: string) => {
    return getIconsFromGivenCode(ikon)
}

const handleAndSetStatusIcon = (status: string, isInternal?: boolean): any => {
    switch(status) {
        case 'OK':
            return <SuccessStrokeCustomized />
        case 'DOWN':
            return <ErrorCloseCustomized />
        case 'ISSUE':
            return <WarningCircleOrange />
        case 'MAINTENANCE':
            return <PlannedMaintenanceCircle />
        case null:
            if(isInternal) {
                return <NoStatusAvailableCircle />
            }
        default:
            return null
    }
}

export interface PortalServiceTileProps {
    area: Area;
    expanded: boolean;
    toggleTile: Function;
    tileIndex: number;
}


export const PortalServiceTile = ({area, expanded ,toggleTile, tileIndex}: PortalServiceTileProps) => {
    const {filters, matches} = useContext(FilterContext)

    const toggleExpanded = () => {
        toggleTile(tileIndex)
    }

    const testMaintenanceObject: MaintenanceObject = {isPlanned: true, message: "Planlagt 24. desember"}

    return (
        <EkspanderbartpanelCustomized
            alignment={expanded == true ? "stretch" : "flex-start"}
            tittel={
                <div className="top-content">
                    <SystemtittelCustomized>
                        {/* <span>{handleAndSetStatusIcon(area.status, false)}</span> */}
                        <span>{handleAndSetNavIcon(area.icon)}</span>
                        <span>{area.name}</span>
                    </SystemtittelCustomized> 
                    <div>
                        <SwitchEtikett status={area.status} maintenanceObject={testMaintenanceObject}/>
                    </div>
                    {testMaintenanceObject.message &&
                        <p className="maintenance-message"><AutomaticSystem /> {testMaintenanceObject.message}</p>
                    }
                </div>
            }
            aria-label="Ekspander område"
            aria-expanded={expanded}
            apen={expanded}
            onClick={toggleExpanded}
        >
            <ServicesList>
                {area.services.map(service => {
                    if (filters.length == 0) {
                        return (
                            <li key={service.name}>
                                <LenkeCustomized href={"/TjenesteData/" + service.id}>
                                    <section>{handleAndSetStatusIcon(service.status, false)}</section><section>{service.name}</section>
                                </LenkeCustomized>
                            </li>
                        )
                    }
                    if(matches(service.status)) {
                        return (
                            <li key={service.name}>
                                <LenkeCustomized href={"/TjenesteData/" + service.id}>
                                    <section>{handleAndSetStatusIcon(service.status, false)}</section><section>{service.name}</section>
                                </LenkeCustomized>
                            </li>
                        )
                    }
                    return
                }
                )}
            </ServicesList>
        </EkspanderbartpanelCustomized>
    )
}





        // <PanelCustomized alignment={expanded == true ? "stretch" : "flex-start"}>
        //     <div>
        //         <UndertittelCustomized>
        //             <section>{handleAndSetStatusIcon(area.status, false)}</section>
        //             <section>{handleAndSetNavIcon(area.icon)}</section>
        //             <span>{area.name}</span>
        //         </UndertittelCustomized> 
        //         {expanded &&
        //             <>
        //                 <ServicesList>
        //                 {area.services.map(service => {
        //                     if (filters.length == 0) {
        //                         return (
        //                             <li key={service.name}>
        //             					<LenkeCustomized href={"/TjenesteData/" + service.id}>
        //                                     <section>{handleAndSetStatusIcon(service.status, false)}</section><section>{service.name}</section>
        //                                 </LenkeCustomized>
        //                             </li>
        //                         )
        //                     }
        //                     if(matches(service.status)) {
        //                         return (
        //                             <li key={service.name}>
        //             					<LenkeCustomized href={"/TjenesteData/" + service.id}>
        //                                     <section>{handleAndSetStatusIcon(service.status, false)}</section><section>{service.name}</section>
        //                                 </LenkeCustomized>
        //                             </li>
        //                         )
        //                     }
        //                     return
        //                 }
        //                 )}
        //                 </ServicesList>
        //             </>
        //         }
        //     </div>

        //     <CenteredExpandRetractSpan aria-expanded={expanded} aria-label="Utvid eller lukk panelmeny" onClick={() => toggleExpanded()}>{expanded ? <Collapse /> : <Expand />}</CenteredExpandRetractSpan>
        // </PanelCustomized>





const SwitchEtikett: React.FC<{maintenanceObject?: MaintenanceObject, status: string}> = ({maintenanceObject, status}) => {
    
    return (
        <div className="etikett-container">
            {maintenanceObject && 
                <EtikettInfo>
                    Vedlikehold pågår
                </EtikettInfo>
            }
            {(() => {
                switch (status) {
                    case 'OK':
                        return <EtikettSuksess>Fungerer normalt</EtikettSuksess>

                    case 'ISSUE':
                        return <EtikettFokus>Redusert funksjonalitet</EtikettFokus>
                    case 'DOWN':
                        return <EtikettAdvarsel>Feil på tjeneste</EtikettAdvarsel>
                    default:
                        return null
                }
            })()}
        
        </div>
    )
}