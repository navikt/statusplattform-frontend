import { BodyShort, Popover } from "@navikt/ds-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useRef, useState } from "react"
import styled from "styled-components"


import { ChevronRightIcon, FigureIcon, MenuGridIcon } from "@navikt/aksel-icons"
import { CustomPopoverContent } from "../../styles/styles"

import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import {
    RouterArbeidsgiver,
    RouterInternt,
    RouterPrivatperson,
    RouterSamarbeidspartner,
    RouterUUStatus,
    RouterVaktor,
} from "../../types/routes"
import { UserData } from "../../types/userData"

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
    width: 15.5rem;
    height: 1px;
    margin: 0.6rem 0 0.6rem;
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
                        onClick={() => router.push(RouterInternt.PATH)}
                    >
                        <Link href={RouterInternt.PATH }>
                            <LenkeSpacer
                                className={`${
                                    router.asPath === RouterInternt.PATH
                                        ? "active"
                                        : "inactive"
                                }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${
                                        router.asPath === RouterInternt.PATH
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    Produktområder
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                    <li
                        role="tab"
                        onClick={() => router.push(RouterUUStatus.PATH)}
                    >
                        <Link href={RouterUUStatus.PATH}>
                            <LenkeSpacer
                                className={`${
                                    router.asPath === RouterUUStatus.PATH
                                        ? "active"
                                        : "inactive"
                                }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${
                                        router.asPath === RouterUUStatus.PATH
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    {RouterUUStatus.NAME}
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                    <li
                        role="tab"
                        onClick={() =>
                            router.push(RouterVaktor.PATH)
                        }
                    >
                        <Link href={RouterVaktor.PATH}>
                            <LenkeSpacer
                                className={`${
                                    router.asPath ===
                                    RouterVaktor.PATH
                                        ? "active"
                                        : "inactive"
                                }`}
                            >
                                <BodyShort
                                    size="small"
                                    className={`${
                                        router.asPath === RouterVaktor.PATH
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    {RouterVaktor.NAME}
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
                                    router.asPath === RouterPrivatperson.PATH ||
                                    router.asPath === RouterArbeidsgiver.PATH ||
                                    router.asPath === RouterSamarbeidspartner.PATH
                                        
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

                                    <>
                                        {"Sider for publikum"}
                                        <CustomChevron />
                                    </>

                                </BodyShort>
                            </LenkeSpacer>
                        </li>
                    )}
                    {user.navIdent && router.asPath === RouterPrivatperson.PATH && (
                        <li
                            role="tab"
                            onClick={() => router.push(RouterPrivatperson.PATH)}
                        >
                            <Link href={RouterPrivatperson.PATH}>
                                <SubLenkeSpacer
                                    className={`${
                                        router.asPath === RouterPrivatperson.PATH
                                            ? "active"
                                            : "inactive"
                                    }`}
                                >
                                    <BodyShort
                                        size="small"
                                        className={`${
                                            router.pathname === RouterPrivatperson.PATH
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        {RouterPrivatperson.NAME}
                                    </BodyShort>
                                </SubLenkeSpacer>
                            </Link>
                        </li>
                    )}


                    {user.navIdent && router.asPath === RouterArbeidsgiver.PATH && (
                        <li
                            role="tab"
                            onClick={() => router.push(RouterArbeidsgiver.PATH)}
                        >
                            <Link href={RouterArbeidsgiver.PATH}>

                                <SubLenkeSpacer

                                    className={`${
                                        router.asPath === RouterArbeidsgiver.PATH
                                            ? "active"
                                            : "inactive"
                                    }`}
                                >
                                    <BodyShort
                                        size="small"
                                        className={`${
                                            router.pathname === RouterArbeidsgiver.PATH
                                                ? "active"
                                                : ""
                                        }`}
                                    >

                                        {RouterArbeidsgiver.NAME}
                                    </BodyShort>
                                </SubLenkeSpacer>
                            </Link>
                        </li>
                    )}
                    {user.navIdent && router.asPath === RouterSamarbeidspartner.PATH && (
                        <li
                            role="tab"
                            onClick={() => router.push(RouterSamarbeidspartner.PATH)}
                        >
                            <Link href={RouterSamarbeidspartner.PATH}>

                                <SubLenkeSpacer

                                    className={`${
                                        router.asPath === RouterSamarbeidspartner.PATH
                                            ? "active"
                                            : "inactive"
                                    }`}
                                >
                                    <BodyShort
                                        size="small"
                                        className={`${
                                            router.pathname === RouterSamarbeidspartner.PATH
                                                ? "active"
                                                : ""
                                        }`}
                                    >

                                        {RouterSamarbeidspartner.NAME}
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
                    <CustomPopoverContent>
                        {user.navIdent && (
                            <>
                                <div>
                                    <a
                                        onClick={() =>
                                            router.push(RouterPrivatperson.PATH)
                                        }
                                        className="internalLinks"
                                    >
                                        <MenuGridIcon className="subMenuIcon" />
                                        {RouterPrivatperson.NAME}
                                    </a>
                                </div>
                                <div>
                                    <SubMenuDivider />

                                    <a
                                        onClick={() =>
                                            router.push(RouterArbeidsgiver.PATH)
                                        }
                                        className="internalLinks"
                                    >
                                        <FigureIcon className="subMenuIcon" />{" "}
                                        {RouterArbeidsgiver.NAME}
                                    </a>
                                </div>
                                <div>
                                    <SubMenuDivider />

                                    <a
                                        onClick={() =>
                                            router.push(RouterSamarbeidspartner.PATH)
                                        }
                                        className="internalLinks"
                                    >
                                        <FigureIcon className="subMenuIcon" />{" "}
                                        {RouterSamarbeidspartner.NAME}
                                    </a>
                                </div>
                            </>
                        )}
                    </CustomPopoverContent>
            </Popover>
        </>
    )
}
