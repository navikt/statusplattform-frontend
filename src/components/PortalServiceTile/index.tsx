import styled from 'styled-components'
import { useState } from "react";

import { SuccessCircleGreen, WarningCircleOrange, ErrorCircleRed } from 'components/TrafficLights'

import { Bag, Folder, PensionBag, HealthCase, ErrorFilled, WarningFilled, Employer, Information, People, Family, Service, Globe } from '@navikt/ds-icons'
import Panel from 'nav-frontend-paneler';
import { Undertittel } from "nav-frontend-typografi";


const PanelCustomized = styled(Panel)`
    color: var(--navBla);
    width: 100%;
    margin: 5px;
    min-height: 90px;
    

    > div {
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
    @media (min-width: 500px) {
        width: 250px;
    }
    @media (min-width: 700px) {
        height: 100%;
    }
    :hover {
        span {
            text-decoration: underline;
        }
        -webkit-box-shadow:0px 1px 0 black;
        -moz-box-shadow:0px 1px 0 black;
        box-shadow:0px 1px 0 black;
        cursor: pointer;
    }
    ${({ expanded }) => expanded && `
       
        
    `}

`;

const UndertittelCustomized = styled(Undertittel)`
    border-radius: 10px;
    background-color:white;
    height: 100%;
    display: flex;
    flex-direction: row;
    span:first-child{
        top: 50%;
        align-items: center;
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
    color:black;
    background-color:white;
    > li {
        display: flex;
        justify-content: flex-start;
        list-style-type: none;
        section {
            display: flex;
            align-items: center;
        }
        section:nth-child(2) {
            margin-left: 10px;

            white-space: normal;
            word-wrap: break-word;
        }
    }
    @media (min-width: 250px){
        > li {
            margin: 5px 0px 5px 0px;
        }
    }
`;


const handleAndSetNavIcon = (areaName: string) => {
    if (areaName == "Arbeid") {
        return <Bag />
    }
    if (areaName == "Pensjon") {
        return <PensionBag />
    }
    if (areaName == "Helse") {
        return <HealthCase />
    }
    if (areaName == "Ansatt") {
        return <Employer />
    }
    if (areaName == "Informasjon") {
        return <Information />
    }
    if (areaName == "Bruker") {
        return <People />
    }
    if (areaName == "Familie") {
        return <Family />
    }
    if (areaName == "EksterneTjenester") {
        return <Service />
    }
    if (areaName == "Lokasjon") {
        return <Globe />
    }
    return <Folder />
}

const handleAndSetStatusIcon = (status: string) => {
    if (status == "OK") {
        return <SuccessCircleGreen />
    }
    if (status == "DOWN") {
        // return <ErrorFilledColored />
        return <ErrorCircleRed/>
    }
    if (status == "ISSUE") {
        // return <WarningFilledColored />
        return <WarningCircleOrange />
    }
    return status
}

export interface PortalServiceTileProps {
    area: any;
    expanded:boolean;
}



export const PortalServiceTile = ({area, expanded}: PortalServiceTileProps) => {
    const [isExpanded, setExpanded] = useState(expanded)
    const toggleExpanded = () => {
        setExpanded(!isExpanded)
    }

    return (
        <PanelCustomized onClick={() => toggleExpanded()}>
            <div>
                
                <UndertittelCustomized>
                    <section>{handleAndSetStatusIcon(area.status)}</section>
                    <section>{handleAndSetNavIcon(area.area.name)}</section>
                    <span>{area.area.name}</span>
                </UndertittelCustomized> 
                {isExpanded &&
                    <ServicesList>
                        {area.services.map(service => (
                            <li key={service.name}>
                                <section> {handleAndSetStatusIcon(service.status)}</section><section>{service.name}</section>
                            </li>
                        ))}
                    </ServicesList>
                }

            </div>
        </PanelCustomized>
    )
}

// export default PortalServiceTile