import styled from 'styled-components'
import { useContext } from "react";
import Link from 'next/link'

import { Wrench } from '@navikt/ds-icons'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { EtikettAdvarsel, EtikettFokus, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { BodyShort, Heading } from '@navikt/ds-react';

import { ErrorCustomized, ErrorFilledCustomized, WrenchFilledCustomized, NoStatusAvailableCircle, WrenchOutlinedCustomized, SuccessCustomized, SuccessFilledCustomized, WarningCustomized, WarningFilledCustomized } from '../../components/TrafficLights'
import { getIconsFromGivenCode } from '../../utils/servicesOperations'
import { Area, MaintenanceObject} from '../../types/navServices'
import { FilterContext } from '../../components/ContextProviders/FilterContext';
import { StringifyOptions } from 'querystring';







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
    .empty-space {
        height: 15px;

        display: block;
    }
`

const HeadingCustomized = styled(Heading)`
    padding: .5rem 0;
    display: flex;
    flex-direction: row;
    
    span {
        display: flex;
        align-items: center;
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
            color: var(--navds-link-color-text);

            display: flex;
            align-items: center;

            svg {
                margin-right: 8px;
            }

            :hover {
                text-decoration: underline;
                cursor: pointer;
            }
        }
        
        section:nth-child(2) {
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

const LenkeCustomized = styled(Link)`
    text-decoration: none;

    :hover {
        text-decoration: underline;
    }
`


const handleAndSetNavIcon = (ikon: string) => {
    return getIconsFromGivenCode(ikon)
}

export const handleAndSetStatusIcon = (status: string, isInternal?: boolean): any => {
    switch(status) {
        case 'OK':
            return <SuccessCustomized />
        case 'DOWN':
            return <ErrorCustomized />
        case 'ISSUE':
            return <WarningCustomized />
        case 'MAINTENANCE':
            return <WrenchOutlinedCustomized />
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


export const PortalServiceTile = ({area, expanded, toggleTile, tileIndex}: PortalServiceTileProps) => {
    const {filters, matches} = useContext(FilterContext)

    const toggleExpanded = () => {
        toggleTile(tileIndex)
    }

    const testMaintenanceObject: MaintenanceObject = {isPlanned: false, message: "Planlagt 24. desember"}

    const { name, status } = area

    return (
        <EkspanderbartpanelCustomized
            alignment={expanded == true ? "stretch" : "flex-start"}
            tittel={
                <div className="top-content">
                    <HeadingCustomized size="medium">
                        <span><StatusIconHandler status={status} isArea={true} /></span>
                        <span>{name}</span>
                    </HeadingCustomized> 

                    {(testMaintenanceObject.message && testMaintenanceObject.isPlanned) ?
                        <BodyShort className="maintenance-message">
                            <Wrench className="icon" /> {testMaintenanceObject.message}
                        </BodyShort>
                        :
                        <span className="empty-space"></span>
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
                                <LenkeCustomized href={"/Tjenestedata/" + service.id}>
                                    <section><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
                                </LenkeCustomized>
                            </li>
                        )
                    }
                    if(matches(service.status)) {
                        return (
                            <li key={service.name}>
                                <LenkeCustomized href={"/Tjenestedata/" + service.id}>
                                    <section><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
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





export const StatusIconHandler: React.FC<{status: string, isArea: boolean}> = ({status, isArea}) => {
    return (
        <>
            {(() => {
                switch (status) {
                    case 'OK':
                        return <SuccessFilledCustomized aria-label={isArea ? "Områdestatus: OK" : "Tjenestestatus: OK"}/>
                    case 'ISSUE':
                        return <WarningFilledCustomized aria-label={isArea ? "Områdestatus: Tjenester i området har feil" : "Tjenestestatus: Feil på tjeneste"}/>
                    case 'DOWN':
                        return <ErrorFilledCustomized aria-label={isArea ? "Områdestatus: Tjenester i området er nede" : "Tjenestestatus: Nede"}/>
                    default:
                        return null
                }
            })()}   
        </>
    )
}