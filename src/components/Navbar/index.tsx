import { useContext } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import styled from "styled-components"

import { BodyShort } from "@navikt/ds-react"

import { UserData } from "../../types/userData"
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import {
    RouterArbeidsgiver,
    RouterInternt,
    RouterPrivatperson,
    RouterSamarbeidspartner,
} from "../../types/routes"

const Nav = styled.nav`
    height: 2.75rem;
    border-bottom: #c6c2bf 1px solid;

    display: none;

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

            :focus,
            :active {
                color: black;
                background-color: transparent;
                outline: var(--a-border-focus) 3px solid;
                box-shadow: 0 0 0 0;
                outline-offset: -3px;
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
        <Nav>
            <ul role="tablist">
                {user.navIdent && (
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
                                    {RouterInternt.NAME}
                                </BodyShort>
                            </LenkeSpacer>
                        </Link>
                    </li>
                )}
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
                    onClick={() => router.push(RouterSamarbeidspartner.PATH)}
                >
                    <Link href={RouterSamarbeidspartner.PATH}>
                        <LenkeSpacer
                            className={`${
                                router.asPath === RouterSamarbeidspartner.PATH
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

                <li role="tab">
                    <Link href={"https://status.nav.no/vaktor"}>
                        <LenkeSpacer>
                            <BodyShort size="small">Vaktor</BodyShort>
                        </LenkeSpacer>
                    </Link>
                </li>
            </ul>
        </Nav>
    )
}
