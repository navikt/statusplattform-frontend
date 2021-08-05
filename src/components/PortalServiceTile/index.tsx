import styled from 'styled-components'
import { useState } from "react";

import { SuccessCircleGreen, WarningCircleOrange, ErrorCircleRed } from 'components/TrafficLights'
import { Tile } from 'types/navServices'
import { getIconsFromGivenCode } from 'utils/servicesOperations'

import { Expand, Collapse, Bag, Folder, PensionBag, HealthCase, ErrorFilled, WarningFilled, Employer, Information, People, Family, Service, Globe } from '@navikt/ds-icons'
import Panel from 'nav-frontend-paneler';
import { Undertittel } from "nav-frontend-typografi";


const PanelCustomized = styled(Panel)`
    color: var(--navBla);
    margin: 5px;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    justify-content: space-between;
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
    @media (min-width: 600px) {
        width: 100%;
    }
    
    :hover {
        span {
            text-decoration: underline;
        }
        -webkit-box-shadow:0px 1px 0 black;
        -moz-box-shadow:0px 1px 0 black;
        box-shadow: #a0a0a0 0 2px 1px 0;
        cursor: pointer;
    }
    ${({ isExpanded }) => isExpanded && `
        align-self: stretch !important;
    `}

`;

const UndertittelCustomized = styled(Undertittel)`
    border-radius: 10px;
    background-color: white;
    height: 50px;
    display: flex;
    flex-direction: row;
    span{
        text-overflow: hidden;
        overflow: hidden;
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

const CenteredExpandRetractSpan = styled.span`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    /* align-self: stretch; */
`


const handleAndSetNavIcon = (ikon: string) => {
    return getIconsFromGivenCode(ikon)
}

const handleAndSetStatusIcon = (status: string): any => {
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
    tile: Tile;
    expanded:boolean;
}


//expanded kan være true eller false avhengig av dashboard prop. Hvis prop er true, er knappen på dashboard togglet og alle ekspanderes.
export const PortalServiceTile = ({tile, expanded}: PortalServiceTileProps) => {
    const [isExpanded, setExpanded] = useState(expanded)
    const toggleExpanded = () => {
        setExpanded(!isExpanded)
    }

    return (
        <PanelCustomized isExpanded={isExpanded} onClick={() => toggleExpanded()}>
            <div>
                <UndertittelCustomized>
                    <section>{handleAndSetStatusIcon(tile.status)}</section>
                    <section>{handleAndSetNavIcon(tile.area.ikon)}</section>
                    <span>{tile.area.name}</span>
                </UndertittelCustomized> 
                {isExpanded &&
                    <>
                        <ServicesList apneTekst="Se mer">
                        {tile.services.map(service => (
                            <li key={service.name}>
                                <section> {handleAndSetStatusIcon(service.status)}</section><section>{service.name}</section>
                            </li>
                        ))}
                        </ServicesList>
                    </>
                }
            </div>
            
            <CenteredExpandRetractSpan>{isExpanded ? <Collapse /> : <Expand />}</CenteredExpandRetractSpan>
        </PanelCustomized>
    )
}

// export default PortalServiceTile