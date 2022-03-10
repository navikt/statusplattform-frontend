import styled from 'styled-components'
import { useContext, useEffect, useState } from "react";
import Link from 'next/link'

import { Expand, Wrench } from '@navikt/ds-icons'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { EtikettAdvarsel, EtikettFokus, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { BodyShort, Detail, Heading } from '@navikt/ds-react';

import { ErrorCustomized, ErrorFilledCustomized, WrenchFilledCustomized, NoStatusAvailableCircle, WrenchOutlinedCustomized, SuccessCustomized, SuccessFilledCustomized, WarningCustomized, WarningFilledCustomized, HelptextCustomizedBlue } from '../../components/TrafficLights'
import { getIconsFromGivenCode } from '../../utils/servicesOperations'
import { Area, MaintenanceObject, SubArea} from '../../types/navServices'
import { FilterContext } from '../../components/ContextProviders/FilterContext';
import { StringifyOptions } from 'querystring';
import { UserStateContext } from '../ContextProviders/UserStatusContext';
import { useRouter } from 'next/router';
import { useLoader } from '../../utils/useLoader';
import CustomNavSpinner from '../CustomNavSpinner';
import { Collapse } from 'react-collapse';
import { RouterTjenestedata } from '../../types/routes';







const EkspanderbartpanelCustomized = styled(Ekspanderbartpanel)<{alignment: string}>`
    /* 
        Adjustment to EkspanderbartPanel-component padding
        padding-bottom 34px is due to position: absolute in navds-detail
    */
    .ekspanderbartPanel__hode {
        padding: 0;
        padding-right: 20px;
        
        .not-logged-in {
            padding: 20px;
        }

        .logged-in {
            padding: 20px; 
            padding-bottom:40px;
        }
        &:focus {
            outline: 2px solid var(--navds-semantic-color-focus);
        }
    }

    .ekspanderbartPanel__hode--focus, .ekspanderbartPanel__hode:focus{box-shadow: none;}

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

    &.sub-area-services {
        padding-left: 1rem;
    }
    
    > li {
        list-style-type: none;

        display: flex;
        justify-content: flex-start;
        
        padding: .8rem 0;
        border-bottom: 1px solid var(--navds-semantic-color-border-inverted);

        section {
            &.logged-in{
                text-decoration: underline;
            }

            display: flex;
            align-items: center;

            svg {
                margin-right: 8px;
            }

            &.logged-in:hover {
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
            return <SuccessFilledCustomized />
        case 'DOWN':
            return <ErrorFilledCustomized />
        case 'ISSUE':
            return <WarningFilledCustomized />
        case 'MAINTENANCE':
            return <WrenchFilledCustomized />
        case null:
            if(isInternal) {
                return(
                    <div className="no-status-wrapper">
                        <HelptextCustomizedBlue aria-label="Ingen status å hente fra tjenesten" />
                        <span className="info-hover-text">
                            <Detail>Ingen status er lagt til på tjenesten</Detail>
                        </span>
                        <div className="arrow"></div>
                    </div>
                )
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
    isAllExpanded: boolean
}


export const PortalServiceTile = ({area, expanded, toggleTile, tileIndex, isAllExpanded}: PortalServiceTileProps) => {
    
    const {filters, matches} = useContext(FilterContext)
    const { navIdent } = useContext(UserStateContext)
    const router = useRouter()

    const toggleExpanded = () => {
        toggleTile(tileIndex)
    }

    const testMaintenanceObject: MaintenanceObject = {isPlanned: false, message: "Planlagt 24. desember"}

    const { name, status, subAreas } = area

    return (
        <EkspanderbartpanelCustomized
            alignment={expanded == true ? "stretch" : "flex-start"}
            border={false}
            tittel={
                <div className={router.asPath.includes("Internt") ? "top-content logged-in" : "top-content not-logged-in"}>
                    <HeadingCustomized size="medium">
                        <span><StatusIconHandler status={status} isArea={true} /></span>
                        <span>{name}</span>
                    </HeadingCustomized>

                    {router.asPath.includes("Internt") &&
                        <Detail size="small">
                            <>Oppetid 100%</>

                            {(testMaintenanceObject.message && testMaintenanceObject.isPlanned) ?
                                <BodyShort className="maintenance-message">
                                    {testMaintenanceObject.message}
                                </BodyShort>
                                :
                                <span className="empty-space"></span>
                            }
                        </Detail>
                    }
                </div>
            }
            aria-label="Ekspander område"
            aria-expanded={expanded}
            apen={expanded}
            onClick={toggleExpanded}
        >
            
            <ServicesList>
                <div className="sub-area-container">
                    {subAreas.map((subArea, index) => {
                        return (
                            <SubAreaComponent key={subArea.id} subArea={subArea} isLastElement={area.services.length == 0 && subAreas.length == index+1} isAllExpanded={isAllExpanded} navIdent={navIdent} />
                        )
                    })}
                </div>

                {area.services.map(service => {
                    if (filters.length == 0) {
                        return (
                            <li key={service.name}>
                                {navIdent
                                ?
                                    <LenkeCustomized href={RouterTjenestedata.PATH + service.id}>
                                        <section className="logged-in"><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
                                    </LenkeCustomized>
                                :
                                    <section><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
                                }
                            </li>
                        )
                    }
                    if(matches(service.status)) {
                        return (
                            <li key={service.name}>
                                {navIdent
                                ?
                                    <LenkeCustomized href={RouterTjenestedata.PATH + service.id}>
                                        <section><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
                                    </LenkeCustomized>
                                :
                                    <section><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
                                }
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











const SubAreaContent = styled.div`
    padding: .8rem 0;


    .sub-area-services {
        list-style: none;
    }

    button {
        padding: 0;
        border: none;
        background: none;

        display: flex;
        flex-direction: row;
        align-items: center;

        .expanded {
            transition: 200ms transform;
        }

        .not-expanded {
            transform: scaleY(-1);
            transition: 200ms transform;
        }
        :hover {
            cursor: pointer;
        }
    }

    svg {
        margin-right: 8px;
    }

    svg:last-child{
        margin-left: 8px;
    }

    .sub-area-services {
        transition: 200ms transform;

        .expanded {
            transition: height 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

    }
    
    &.not-last-element {
        border-bottom: 1px solid var(--navds-semantic-color-border-inverted);
    }
`


const SubAreaComponent: React.FC<{subArea: SubArea, isLastElement: boolean, isAllExpanded: boolean, navIdent: string}> = ({subArea, isLastElement, isAllExpanded, navIdent}) => {
    const [isToggled, setIsToggled] = useState(false)

    const listOfStatusesInSubArea: string[] = subArea.services.map(service => service.status)

    useEffect(() => {
        if(isAllExpanded) {
            setIsToggled(isAllExpanded)
        }
    },[isAllExpanded])

    
    return (
        <SubAreaContent className={isLastElement ? "" : "not-last-element"}>
            <button className="sub-area-button" aria-expanded={isToggled} onClick={() => setIsToggled(!isToggled)}>
                {handleAndSetStatusIcon(subArea.status)}
                <b> 
                    {subArea.name} 
                </b>
                <Expand className={!isToggled ? "expanded" : "not-expanded"}/>
            </button>



            <Collapse isOpened={isToggled}>
                <ServicesList className={`sub-area-services ${isToggled ? "expanded" : ""}`}>
                    {subArea.services.map((service, index) => {
                        return (
                            <li className={subArea.services.length != index+1 ? "not-last-element" : ""} key={service.id}>
                                {navIdent
                                ?
                                    // <LenkeCustomized href={"/Tjenestedata/" + service.id}>
                                    //     <section><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
                                    // </LenkeCustomized>
                                    <LenkeCustomized href={RouterTjenestedata.PATH + service.id}>
                                        <section className="logged-in"><StatusIconHandler isArea={false} status={service.status} /> {service.name}</section>
                                    </LenkeCustomized>
                                :
                                    <section><StatusIconHandler status={service.status} isArea={false} /> {service.name}</section>
                                }
                            </li>
                            
                        )
                    })}
                </ServicesList>
            </Collapse>



        </SubAreaContent>
    )
}