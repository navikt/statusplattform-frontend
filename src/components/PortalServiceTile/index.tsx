import Link from "next/link"
import styled from "styled-components"
import { useContext, useEffect, useState } from "react"
import { Accordion, Button } from "@navikt/ds-react"
import { Expand } from "@navikt/ds-icons"
import { BodyShort, Detail, Heading } from "@navikt/ds-react"
import {
    ErrorFilledCustomized,
    WrenchFilledCustomized,
    SuccessFilledCustomized,
    WarningFilledCustomized,
    HelptextCustomizedBlue,
    HelpTextCustomizedGray,
} from "../../components/TrafficLights"
import { Area, MaintenanceObject, SubArea } from "../../types/types"
import { FilterContext } from "../../components/ContextProviders/FilterContext"
import { UserStateContext } from "../ContextProviders/UserStatusContext"
import { useRouter } from "next/router"
import { Collapse } from "react-collapse"
import { RouterTjenestedata } from "../../types/routes"

const CustomAccordionHeader = styled(Accordion.Header)`
    border: none;
    padding: 1.5rem 0.6rem 1.2rem 0.6rem;
    border-radius: 4px;
`
const CustomizedAccordion = styled(Accordion)<{
    alignment: string
    height_when_not_expanded: string
    center_if_not_expanded
}>`
    background: none;
    border-radius: 4px;

    box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
    width: 100%;

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
    justify-content: ${(props): any => props.center_if_not_expanded};

    //Styrer om panelet skal strekke etter høyden eller ikke basert på prop i render
    align-self: ${(props): any => props.alignment};
    min-height: ${(props): any => props.height_when_not_expanded};

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
        margin-right: 8px;

        top: 50%;
        align-items: center;
    }
`

const ServicesList = styled.ul`
    color: black;

    border-radius: 0 0 10px 10px;

    padding: 0;
    margin: 0;

    &.sub-area-services {
        padding-left: 1rem;
    }

    .sub-area-list-item:first-child {
        padding-top: 0;
    }

    > li {
        display: flex;
        justify-content: flex-start;

        padding: 0.5rem 0;
        margin-left: 1.5rem;
        font-size: 1.3rem;

        section {
            /* &.logged-in{
                text-decoration: underline;
            } */

            display: flex;
            align-items: center;

            svg {
                margin-right: 8px;
            }

            &.logged-in:hover {
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
`
const DisplayText = styled.span`
  color:black;
  text-decoration: none!important;
`

const LenkeCustomized = styled(Link)`
    text-decoration: none;

    :hover {
        text-decoration: underline;
    }

`

export const handleAndSetStatusIcon = (
    status: string | null,
    isInternal?: boolean
): any => {
    switch (status) {
        case "OK":
            return <SuccessFilledCustomized />
        case "ISSUE":
            return <WarningFilledCustomized className="" />
        case "DOWN":
            return <ErrorFilledCustomized />
        case "MAINTENANCE":
            return <WrenchFilledCustomized />
        case "UNKNOWN":
            return <HelpTextCustomizedGray />
        case null:
            if (isInternal) {
                return (
                    <div className="no-status-wrapper">
                        <HelptextCustomizedBlue aria-label="Ingen status å hente fra tjenesten" />
                        <span className="info-hover-text">
                            <Detail>
                                Ingen status er lagt til på tjenesten
                            </Detail>
                        </span>
                        <div className="arrow"></div>
                    </div>
                )
            } else {
                return (
                    <HelptextCustomizedBlue aria-label="Ingen status tilgjengelig" />
                )
            }
        default:
            return (
                <HelptextCustomizedBlue aria-label="Ingen status tilgjengelig" />
            )
    }
}

export interface PortalServiceTileProps {
    area: Area
    expanded: boolean
    toggleTile: Function
    tileIndex: number
    isAllExpanded: boolean
    heightOfTileInRowBasedOfLargestTileInRow?: string
}

export const PortalServiceTile = ({
    area,
    expanded,
    toggleTile,
    tileIndex,
    isAllExpanded,
    heightOfTileInRowBasedOfLargestTileInRow,
}: PortalServiceTileProps) => {
    const [updatedArea, updateArea] = useState(area)

    const { filters, matches } = useContext(FilterContext)
    const { navIdent } = useContext(UserStateContext)
    const router = useRouter()

    const toggleExpanded = () => {
        toggleTile(tileIndex)
    }

    useEffect(() => {
        updateArea(area)
    }, [area])

    const testMaintenanceObject: MaintenanceObject = {
        isPlanned: false,
        message: "Planlagt 24. desember",
    }

    const { name, status, subAreas } = updatedArea
    const [open, setOpen] = useState(false)

    return (
        <>
            <CustomizedAccordion
                alignment={expanded == true ? "stretch" : "flex-start"}
                height_when_not_expanded={
                    expanded != true
                        ? `${heightOfTileInRowBasedOfLargestTileInRow}`
                        : "auto"
                }
                center_if_not_expanded={
                    expanded == true ? "flex-start" : "center"
                }
            >
                <Accordion.Item open={open}>
                    <CustomAccordionHeader onClick={() => setOpen(!open)}>
                        <div
                            className={
                                router.asPath.includes("Internt")
                                    ? "top-content logged-in"
                                    : "top-content not-logged-in"
                            }
                        >
                            <HeadingCustomized size="medium">
                                <span>
                                    <StatusIconHandler
                                        status={status}
                                        isArea={true}
                                    />
                                </span>
                                <span>{name}</span>
                            </HeadingCustomized>

                            {router.asPath.includes("Internt") && (
                                <Detail size="small">
                                    {/* <>Oppetid 100%</> */}

                                    {testMaintenanceObject.message &&
                                    testMaintenanceObject.isPlanned ? (
                                        <BodyShort className="maintenance-message">
                                            {testMaintenanceObject.message}
                                        </BodyShort>
                                    ) : (
                                        <span className="empty-space"></span>
                                    )}
                                </Detail>
                            )}
                        </div>
                    </CustomAccordionHeader>
                    <Accordion.Content>
                        <ServicesList>
                            <div className="sub-area-container">
                                {subAreas.map((subArea, index) => {
                                    return (
                                        <SubAreaComponent
                                            key={subArea.id}
                                            subArea={subArea}
                                            isLastElement={
                                                area.services.length == 0 &&
                                                subAreas.length == index + 1
                                            }
                                            isAllExpanded={isAllExpanded}
                                            navIdent={navIdent}
                                        />
                                    )
                                })}
                            </div>

                            {area.services.map((service) => {
                                let displaytext = service.ohDisplay? " " +service.ohDisplay.displayText: "";
                                if (filters.length == 0) {
                                    return (
                                        <li key={service.name}>
                                            {navIdent ? (
                                                <LenkeCustomized
                                                    href={
                                                        RouterTjenestedata.PATH +
                                                        service.id
                                                    }
                                                >
                                                    <section className="logged-in">
                                                        <StatusIconHandler
                                                            status={
                                                                service.record
                                                                    .status
                                                            }
                                                            isArea={false}
                                                            statusNotFromTeam={
                                                                service.statusNotFromTeam
                                                            }
                                                            isOpen={service.ohDisplay && service.ohDisplay.isOpen}
                                                        />{" "}
                                                        {service.name}
                                                    </section>
                                                    <DisplayText>{displaytext}</DisplayText>
                                                </LenkeCustomized>

                                            ) : (
                                                <section>
                                                    <StatusIconHandler
                                                        status={
                                                            service.record
                                                                .status
                                                        }
                                                        isArea={false}
                                                        statusNotFromTeam={
                                                            service.statusNotFromTeam
                                                        }
                                                    />{" "}
                                                    {service.name}
                                                </section>
                                            )}
                                        </li>
                                    )
                                }
                                if (matches(service.record.status)) {
                                    return (
                                        <li key={service.name}>
                                            {navIdent ? (
                                                <LenkeCustomized
                                                    href={
                                                        RouterTjenestedata.PATH +
                                                        service.id
                                                    }
                                                >
                                                    <section>
                                                        <StatusIconHandler
                                                            status={
                                                                service.record
                                                                    .status
                                                            }
                                                            isArea={false}
                                                            statusNotFromTeam={
                                                                service.statusNotFromTeam
                                                            }
                                                        />{" "}
                                                    </section>
                                                </LenkeCustomized>
                                            ) : (
                                                <section>
                                                    <StatusIconHandler
                                                        status={
                                                            service.record
                                                                .status
                                                        }
                                                        isArea={false}
                                                        statusNotFromTeam={
                                                            service.statusNotFromTeam
                                                        }
                                                    />{" "}
                                                    {service.name}
                                                </section>
                                            )}
                                        </li>
                                    )
                                }
                                return
                            })}
                        </ServicesList>
                    </Accordion.Content>
                </Accordion.Item>
            </CustomizedAccordion>
        </>
    )
}

const IconWrapper = styled.div`
    height: 1.38rem;
    width: 1.38rem;

    margin-right: 0.5rem;
`

export const StatusIconHandler: React.FC<{
    status: string
    isArea: boolean
    isOpen?: boolean
    statusNotFromTeam?: boolean
}> = ({ status, isArea, statusNotFromTeam ,isOpen}) => {
    const router = useRouter()
    let isIntern = false
    let className = statusNotFromTeam && isIntern? "status-not-from-team": ""

    if(isOpen != undefined && !isOpen){
        className += " service-closed"
    }

    useEffect(() => {}, [router])

    if (router.isReady) {
        router.asPath.includes("Internt")
            ? (isIntern = true)
            : (isIntern = false)
    }

    return (
        <>
            {(() => {
                switch (status) {
                    case "OK":
                        return (
                            <IconWrapper>
                                <SuccessFilledCustomized
                                    className={className}
                                    aria-label={
                                        isArea
                                            ? "Områdestatus: OK"
                                            : "Tjenestestatus: OK"
                                    }
                                />
                            </IconWrapper>
                        )
                    case "ISSUE":
                        return (
                            <IconWrapper>
                                <WarningFilledCustomized
                                    className={className}
                                    aria-label={
                                        isArea
                                            ? "Områdestatus: Tjenester i området har feil"
                                            : "Tjenestestatus: Feil på tjeneste"
                                    }
                                />
                            </IconWrapper>
                        )
                    case "DOWN":
                        return (
                            <IconWrapper>
                                <ErrorFilledCustomized
                                    className={className}
                                    aria-label={
                                        isArea
                                            ? "Områdestatus: Tjenester i området er nede"
                                            : "Tjenestestatus: Nede"
                                    }
                                />
                            </IconWrapper>
                        )
                    case "UNKNOWN":
                        return (
                            <IconWrapper>
                                <HelpTextCustomizedGray
                                    className={className}
                                    aria-label={
                                        isArea
                                            ? "Områdestatus: Tjenester i området mangler status"
                                            : "Tjenestestatus: Mangler status"
                                    }
                                />
                            </IconWrapper>
                        )
                    case null:
                        return (
                            <IconWrapper>
                                <HelpTextCustomizedGray aria-label="Ingen status tilgjengelig" />
                            </IconWrapper>
                        )
                    default:
                        return null
                }
            })()}
        </>
    )
}

const SubAreaContent = styled.div`
    font-size: 1.3rem;

    button {
        padding: 0.8rem 0;

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

    .sub-area-button {
        margin-left: 1.5rem;
    }

    svg {
        margin-right: 8px;
    }

    svg:last-child {
        margin-left: 8px;
    }

    .sub-area-services {
        transition: 200ms transform;

        .expanded {
            transition: height 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
    }
`

const SubAreaComponent: React.FC<{
    subArea: SubArea
    isLastElement: boolean
    isAllExpanded: boolean
    navIdent: string
}> = ({ subArea, isLastElement, isAllExpanded, navIdent }) => {
    const [isToggled, setIsToggled] = useState(false)

    const listOfStatusesInSubArea: string[] = subArea.services.map(
        (service) => service.record.status
    )

    useEffect(() => {
        if (isAllExpanded) {
            setIsToggled(isAllExpanded)
        }
    }, [isAllExpanded])

    return (
        <SubAreaContent className={isLastElement ? "" : "not-last-element"}>
            <button
                className="sub-area-button"
                aria-expanded={isToggled}
                onClick={() => setIsToggled(!isToggled)}
            >
                {" "}
                <StatusIconHandler status={subArea.status} isArea={false} />
                <b>{subArea.name}</b>
                <Expand className={!isToggled ? "expanded" : "not-expanded"} />
            </button>

            <Collapse isOpened={isToggled}>
                <ServicesList
                    className={`sub-area-services ${
                        isToggled ? "expanded" : ""
                    }`}
                >
                    {subArea.services.map((service, index) => {
                        return (
                            <li
                                className={`sub-area-list-item ${
                                    subArea.services.length != index + 1
                                        ? "not-last-element"
                                        : ""
                                }`}
                                key={service.id}
                            >
                                {navIdent ? (
                                    <LenkeCustomized
                                        href={
                                            RouterTjenestedata.PATH + service.id
                                        }
                                    >
                                        <section className="logged-in">
                                            <StatusIconHandler
                                                isArea={false}
                                                status={service.record.status}
                                                statusNotFromTeam={
                                                    service.statusNotFromTeam
                                                }
                                            />{" "}
                                            {service.name}
                                        </section>
                                    </LenkeCustomized>
                                ) : (
                                    <section>
                                        <StatusIconHandler
                                            status={service.record.status}
                                            isArea={false}
                                            statusNotFromTeam={
                                                service.statusNotFromTeam
                                            }
                                        />{" "}
                                        {service.name}
                                    </section>
                                )}
                            </li>
                        )
                    })}
                </ServicesList>
            </Collapse>
        </SubAreaContent>
    )
}
