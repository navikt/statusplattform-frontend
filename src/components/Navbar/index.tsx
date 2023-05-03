import { BodyShort, Button, Heading, Popover } from "@navikt/ds-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useRef, useState } from "react"
import styled from "styled-components"

import {
    ChatExclamationmarkIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    FigureIcon,
    MenuGridIcon,
} from "@navikt/aksel-icons"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import {
    RouterAdmin,
    RouterArbeidsgiver,
    RouterInternt,
    RouterOpsMeldinger,
    RouterPrivatperson,
    RouterSamarbeidspartner,
    RouterUUStatus,
    RouterVaktor,
} from "../../types/routes"
import { UserData } from "../../types/userData"
import { Employer } from "@navikt/ds-icons"

const MainNav = styled.nav`
    height: 2.35rem;

    display: none;
    border-bottom: 1px solid var(--a-gray-100);

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;

        li {
            :hover {
                cursor: pointer;
            }

            .inactive {
                border-bottom: transparent 3px solid;

                :hover {
                    border-bottom: var(--a-blue-500) 3px solid;
                }
            }

            :active {
                color: black;
                background-color: transparent;

                box-shadow: 0 0 0 0;
                outline-offset: -3px;
            }
            .activeIntern {
                display: flex;
                flex-direction: row;
                color: black;

                width: 6rem;

                padding-left: 0.3rem;

                border: none;
                outline: none;
                outline-offset: -3px;

                border-bottom: var(--a-blue-500) 3px solid;
            }
            .inactiveIntern {
                width: 4.5rem;
                padding-left: 0.3rem;
                border-bottom: transparent 3px solid;

                :hover {
                    border-bottom: var(--a-blue-500) 3px solid;
                }
            }

            a {
                text-decoration: none;
                color: black;
            }
        }
    }

    @media (min-width: 768px) {
        display: block;
    }
`

const CustomChevron = styled(ChevronRightIcon)`
    color: var(--a-gray-700);
    height: 1.15rem;
    width: 1.15rem;
    position: absolute;
    margin-top: 0.1rem;
    margin-left: 0.1rem;
`

const CustomPopoverContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    color: var(--a-gray-800);

    .internalLinks {
        color: var(--a-blue-800);
        text-decoration: none;
        margin: 0 0 0 2.5rem;

        :hover {
            text-decoration: underline;
        }

        .subMenuIcon {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0 0 0 -2rem;
            position: absolute;
        }

        .adminIcon {
            width: 1.3rem;
            height: 1.3rem;
            margin: 0 0 0 -2rem;
            position: absolute;
        }
    }
    .SubMenuHead {
        text-align: center;
        text-decoration: none;

        :hover {
            text-decoration: none;
        }
    }
`

const LenkeSpacer = styled.div`
    margin: 0 1rem;
    height: 100%;

    border-bottom: 3px transparent;
    display: flex;
    align-items: center;

    &.active {
        border-bottom: var(--a-blue-500) 3px solid;

        p {
            font-weight: bold !important;
        }
    }
`

const SubLenkeSpacer = styled.div`
    margin: 0 1rem 0 -2rem;
    height: 100%;

    border-bottom: 3px transparent;
    display: flex;
    align-items: center;

    &.active {
        border-bottom: var(--a-blue-500) 3px solid;

        p {
            font-weight: bold !important;
        }
    }
`

const SubMenuDivider = styled.div`
    width: 17rem;
    height: 1px;

    background-color: var(--a-gray-300);
`

const VaktorLogo = styled.img`
    height: 1.4rem;
    width: 1.4rem;
    position: absolute;
    margin: -0.1rem 0 0 -2rem;
`

export default function Navbar() {
    const router = useRouter()

    const user = useContext<UserData>(UserStateContext)

    const buttonRef = useRef<HTMLLIElement>(null)
    const [openState, setOpenState] = useState(false)

    return (
        <>
            <MainNav>
                <ul role="tablist">
                    <li
                        role="tab"
                        onClick={() => router.push(RouterPrivatperson.PATH)}
                    >
                        <Link href={RouterPrivatperson.PATH}>
                            <LenkeSpacer
                                className={`${
                                    router.asPath === RouterPrivatperson.PATH
                                        ? "active"
                                        : "inactive"
                                }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${
                                        router.pathname === "/Privatperson"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    {RouterPrivatperson.NAME}
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                    <li
                        role="tab"
                        onClick={() => router.push(RouterArbeidsgiver.PATH)}
                    >
                        <Link href={RouterArbeidsgiver.PATH}>
                            <LenkeSpacer
                                className={`${
                                    router.asPath === RouterArbeidsgiver.PATH
                                        ? "active"
                                        : "inactive"
                                }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${
                                        router.pathname === "/Arbeidsgiver"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    {RouterArbeidsgiver.NAME}
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                    <li
                        role="tab"
                        onClick={() =>
                            router.push(RouterSamarbeidspartner.PATH)
                        }
                    >
                        <Link href={RouterSamarbeidspartner.PATH}>
                            <LenkeSpacer
                                className={`${
                                    router.asPath ===
                                    RouterSamarbeidspartner.PATH
                                        ? "active"
                                        : "inactive"
                                }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${
                                        router.pathname === "/Samarbeidspartner"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    {RouterSamarbeidspartner.NAME}
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                    {user.navIdent && (
                        <li
                            role="tab"
                            onClick={() => setOpenState(!openState)}
                            ref={buttonRef}
                        >
                            <LenkeSpacer
                                className={`${
                                    router.asPath === RouterInternt.PATH ||
                                    router.asPath === RouterUUStatus.PATH
                                        ? "activeIntern"
                                        : "inactiveIntern"
                                }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${
                                        router.pathname === "/Internt"
                                            ? "activeIntern"
                                            : ""
                                    }`}
                                >
                                    {/* {router.asPath === RouterInternt.PATH ||
                                    router.asPath === RouterUUStatus.PATH ? ( 
                                    //     <>
                                    //         {" "}
                                    //         <b>{RouterInternt.NAME}</b> {}{" "}
                                    //         <CustomChevron />
                                    //     </>
                                    // ) : (*/}
                                    <>
                                        {RouterInternt.NAME}
                                        <CustomChevron />
                                    </>
                                </BodyShort>
                            </LenkeSpacer>
                        </li>
                    )}

                    {user.navIdent && router.asPath === RouterInternt.PATH && (
                        <li
                            role="tab"
                            onClick={() => router.push(RouterInternt.PATH)}
                        >
                            <Link href={RouterInternt.PATH}>
                                <SubLenkeSpacer
                                    className={`${
                                        router.asPath === RouterInternt.PATH
                                            ? "active"
                                            : "inactive"
                                    }`}
                                >
                                    <BodyShort
                                        size="small"
                                        className={`${
                                            router.pathname === "/Internt"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        Produktområder
                                    </BodyShort>
                                </SubLenkeSpacer>
                            </Link>
                        </li>
                    )}
                    {user.navIdent && router.asPath === RouterUUStatus.PATH && (
                        <li
                            role="tab"
                            onClick={() => router.push(RouterUUStatus.PATH)}
                        >
                            <Link href={RouterUUStatus.PATH}>
                                <SubLenkeSpacer
                                    className={`${
                                        router.asPath === RouterUUStatus.PATH
                                            ? "active"
                                            : "inactive"
                                    }`}
                                >
                                    <BodyShort
                                        size="small"
                                        className={`${
                                            router.pathname === "/UUStatus"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        Status Universell Utforming
                                    </BodyShort>
                                </SubLenkeSpacer>
                            </Link>
                        </li>
                    )}
                </ul>
            </MainNav>
            <Popover
                open={openState}
                onClose={() => setOpenState(false)}
                anchorEl={buttonRef.current}
            >
                <Popover.Content>
                    {user.navIdent && (
                        <CustomPopoverContent>
                            <a
                                onClick={() => router.push(RouterInternt.PATH)}
                                className="internalLinks"
                            >
                                <MenuGridIcon className="subMenuIcon" />
                                Produktområder
                            </a>

                            <SubMenuDivider />

                            <a
                                onClick={() => router.push(RouterUUStatus.PATH)}
                                className="internalLinks"
                            >
                                <FigureIcon className="subMenuIcon" />{" "}
                                {RouterUUStatus.NAME}
                            </a>

                            <SubMenuDivider />

                            <a
                                href="https://status.nav.no/vaktor"
                                aria-label="Lenke til Vaktor"
                                className="internalLinks"
                            >
                                <VaktorLogo
                                    src="/sp/assets/images/vaktor.png"
                                    alt="Vaktor"
                                    aria-hidden="true"
                                />

                                {RouterVaktor.NAME}
                            </a>
                        </CustomPopoverContent>
                    )}
                </Popover.Content>
            </Popover>
        </>
    )
}
