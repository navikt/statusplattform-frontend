import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useRef, useState } from "react"
import styled from "styled-components"

import { XMarkIcon, Buildings2Icon, MenuHamburgerIcon } from "@navikt/aksel-icons"
import { Button, Popover } from "@navikt/ds-react"

import { UserStateContext } from "../../ContextProviders/UserStatusContext"
import { UserData } from "../../../types/userData"
import {
    RouterAdmin,
    RouterArbeidsgiver,
    RouterInternt,
    RouterOpsMeldinger,
    RouterPrivatperson,
    RouterSamarbeidspartner,
    RouterUUStatus,
} from "../../../types/routes"

const BurgerMenuContainer = styled.div`
    display:block & > * {
        color: black !important;
    }

    .navds-button:hover {
        box-shadow: inset 0 0 0 2px var(--a-gray-900);
    }

    .menu-text {
        font-weight: bold;
    }

    .hamburger-ikon,
    .close-ikon {
        width: 28px;
        height: 24px;

        position: relative;
        display: block;
    }

    .closed-burger {
        display: none;
    }

    @media (min-width: 768px) {
        display: none;
    }

    @media (min-width: 450px) {
        button {
            margin-right: 1rem;
        }
    }
`

const PopoverCustomized = styled(Popover)`
    width: max-content;

    div {
        display: flex;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 1rem;

        li {
            padding: 1rem 0;
        }

        .popover-link-ikon {
            margin-right: 0.5rem;
        }

        a {
            color: black;
        }
    }
`

const BurgerMenu = () => {
    const buttonRef = useRef(null)
    const [open, setOpen] = useState(false)

    useRouter()

    return (
        <BurgerMenuContainer>
            <Button
                variant="tertiary"
                id="menu-container"
                aria-expanded={open}
                ref={buttonRef}
                onClick={() => setOpen(!open)}
                iconPosition="right"
                icon={open ? <XMarkIcon /> : <MenuHamburgerIcon />}
            >
                <span className="menu-text">Meny</span>
            </Button>

            <PopoverCustomized
                open={open}
                onClose={() => setOpen(!open)}
                anchorEl={buttonRef.current}
                placement="bottom"
            >
                <PopoverContent />
            </PopoverCustomized>
        </BurgerMenuContainer>
    )
}

/*------------ Helpers below ------------*/

const PopoverContent = () => {
    const user = useContext<UserData>(UserStateContext)

    return (
        <div>
            <ul>
                {user.navIdent && (
                    <>
                        <li>
                            <Link href={RouterInternt.PATH} legacyBehavior>
                                {RouterInternt.NAME +
                                    " (Kun for innloggede nav brukere)"}
                            </Link>
                        </li>
                        <li>
                            <Link href={RouterUUStatus.PATH} legacyBehavior>
                                {RouterUUStatus.NAME}
                            </Link>
                        </li>
                        <li>
                            <Link href={RouterOpsMeldinger.PATH} legacyBehavior>
                                {RouterOpsMeldinger.NAME}
                            </Link>
                        </li>
                    </>
                )}
                <li>
                    <Link href={RouterPrivatperson.PATH} legacyBehavior>
                        {RouterPrivatperson.NAME}
                    </Link>
                </li>
                <li>
                    <Link href={RouterArbeidsgiver.PATH} legacyBehavior>
                        {RouterArbeidsgiver.NAME}
                    </Link>
                </li>
                <li>
                    <Link href={RouterSamarbeidspartner.PATH} legacyBehavior>
                        {RouterSamarbeidspartner.NAME}
                    </Link>
                </li>
            </ul>

            <ul>
                {user.navIdent && (
                    <>
                        <li>
                            <Link href={RouterAdmin.PATH}>
                                <Buildings2Icon className="popover-link-ikon" />
                                {RouterAdmin.NAME}
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default BurgerMenu
