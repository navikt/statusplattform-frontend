import styled from 'styled-components'
import { useContext } from "react";
import Link from 'next/link'

import { Wrench } from '@navikt/ds-icons'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { EtikettAdvarsel, EtikettFokus, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { BodyShort, Detail, Heading } from '@navikt/ds-react';

import { ErrorCustomized, ErrorFilledCustomized, WrenchFilledCustomized, NoStatusAvailableCircle, WrenchOutlinedCustomized, SuccessCustomized, SuccessFilledCustomized, WarningCustomized, WarningFilledCustomized } from '../../components/TrafficLights'
import { getIconsFromGivenCode } from '../../utils/servicesOperations'
import { Area, MaintenanceObject} from '../../types/navServices'
import { FilterContext } from '../../components/ContextProviders/FilterContext';
import { StringifyOptions } from 'querystring';







const EkspanderbartpanelCustomized = styled(Ekspanderbartpanel)<{alignment: string}>`
    /* 
        Adjustment to EkspanderbartPanel-component padding
        padding-bottom 34px is due to position: absolute in navds-detail
    */
    .ekspanderbartPanel__hode{padding: 20px; padding-bottom:40px;}
    width: 100%;

    -moz-box-shadow: 0 0 10px rgba(0,0,0, 0.2);
    -webkit-box-shadow: 0 0 10px rgba(0,0,0, 0.2);
    box-shadow: 0 0 10px rgba(0,0,0, 0.2);

    .top-content {
        position: relative;

        .etikett-container {
            margin-right: 5px;
            display: flex;
            gap: 12px;
        }

        .icon {
            margin-right: 0.5rem;
            vertical-align: middle;
        }

        .navds-detail {
            color: var(--navds-global-color-gray-600);
            position: absolute;
            width: 385px;
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

    :hover {
        span {
            color: black;
            text-decoration: underline;
        }
    }
`

const HeadingCustomized = styled(Heading)`
    padding-bottom: 6.5px;
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
        
        padding: .8rem 0;
        border-bottom: 1px solid var(--navds-semantic-color-border-inverted);

        section {
            text-decoration: underline;

            display: flex;
            align-items: center;

            svg {
                margin-right: 8px;
            }

            :hover {
                text-decoration: none;
                cursor: pointer;
            }
        }
        
        section:nth-child(2) {
            white-space: normal;
            word-break: break-word;
        }
    }

    li:last-child {
        border-bottom: none;
    }

    a {
        display: flex;
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
            border={false}
            tittel={
                <div className="top-content">
                    <HeadingCustomized size="medium">
                        <span><StatusIconHandler status={status} isArea={true} /></span>
                        <span>{name}</span>
                    </HeadingCustomized> 
                    <Detail size="small">
                        Oppetid 100%
                        {(testMaintenanceObject.message && testMaintenanceObject.isPlanned) ?
                            <BodyShort className="maintenance-message">
                                {testMaintenanceObject.message}
                            </BodyShort>
                            :
                            <span className="empty-space"></span>
                        }
                    </Detail>
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