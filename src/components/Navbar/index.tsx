import { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import styled from "styled-components"

import { BodyShort, Label } from "@navikt/ds-react"

import { UserData } from "../../types/userData"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import {
    RouterArbeidsgiver,
    RouterInternt,
    RouterPrivatperson,
    RouterSamarbeidspartner,
    RouterUUStatus,
} from "../../types/routes"
import { ChevronDownIcon } from "@navikt/aksel-icons"

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

                width: 5.5rem;
                padding-left: 0.65rem;

                border: none;
                outline: none;
                outline-offset: -3px;

                border-bottom: var(--a-blue-500) 3px solid;
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

const SubNav = styled.nav`
    box-shadow: inset 0px -1px 1px rgba(0, 0, 0, 0.075);
    height: 2.1rem;
    padding-left: 25rem;
    padding-top: 0.2rem;
    z-index: 1000;
    display: none;
    background-color: transparent;
    border-bottom: 1px solid #e6e5e4;

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
                border-bottom: invisible 3px solid;

                :hover {
                    border-bottom: var(--a-blue-500) 3px solid;
                }
            }

            :focus,
            :active {
                color: black;
                background-color: transparent;
                outline: var(--a-border-focus) 3px solid;
                box-shadow: 0 0 0 0;
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

const CustomChevron = styled(ChevronDownIcon)`
    color: var(--a-gray-700);
    height: 2.5rem;
    position: absolute;
    margin-top: -0.55rem;
    margin-left: 0.2rem;
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

export default function Navbar() {
    const router = useRouter()

    const user = useContext<UserData>(UserStateContext)

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
                            onClick={() => router.push(RouterInternt.PATH)}
                        >
                            <Link href={RouterInternt.PATH}>
                                <LenkeSpacer
                                    className={`${
                                        router.asPath === RouterInternt.PATH ||
                                        router.asPath === RouterUUStatus.PATH
                                            ? "activeIntern"
                                            : "inactive"
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
                                        {router.asPath === RouterInternt.PATH ||
                                        router.asPath ===
                                            RouterUUStatus.PATH ? (
                                            <>
                                                {" "}
                                                <b>{RouterInternt.NAME}</b>{" "}
                                                <CustomChevron />
                                            </>
                                        ) : (
                                            RouterInternt.NAME
                                        )}
                                    </BodyShort>
                                </LenkeSpacer>
                            </Link>
                        </li>
                    )}
                </ul>
            </MainNav>

            {user.navIdent &&
                (router.asPath === RouterInternt.PATH ||
                    router.asPath === RouterUUStatus.PATH) && (
                    <SubNav>
                        <ul>
                            <li
                                role="tab"
                                onClick={() => router.push(RouterInternt.PATH)}
                            >
                                <Link href={RouterInternt.PATH}>
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
                                                router.pathname === "/Internt"
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
                                            router.asPath ===
                                            RouterUUStatus.PATH
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
                                            UU Status
                                        </BodyShort>
                                    </LenkeSpacer>
                                </Link>
                            </li>
                            <li role="tab">
                                <Link href={"https://status.nav.no/vaktor"}>
                                    <LenkeSpacer className="inactive">
                                        <BodyShort size="small">
                                            Vaktor
                                        </BodyShort>
                                    </LenkeSpacer>
                                </Link>
                            </li>
                        </ul>
                    </SubNav>
                )}
        </>
    )
}
