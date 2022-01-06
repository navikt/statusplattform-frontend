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
import { BodyShort } from '@navikt/ds-react';






const EkspanderbartpanelCustomized = styled(Ekspanderbartpanel)<{alignment: string}>`
    width: 100%;

    .top-content {
        .etikett-container {
            margin-right: 5px;
            display: flex;
            gap: 12px;
        }

        .icon {
            margin-right: 0.5rem;
            vertical-align: middle;
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
        color: grey;
        
        font-size: 1rem;
        font-style: italic;
    }
`

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
    color: black;
    background-color: white;
    
    border-radius:0 0 10px 10px;

    list-style: none;
    padding: 0;
    margin: 0;
    
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
        li {
            margin: 5px 0px 5px 0px;
        }
    }
`;

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
                    <BodyShort spacing>
                        <SwitchEtikett status={area.status} maintenanceObject={testMaintenanceObject}/>
                    </BodyShort>
                    {testMaintenanceObject.message &&
                        <BodyShort className="maintenance-message"><AutomaticSystem className="icon" /> {testMaintenanceObject.message}</BodyShort>
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