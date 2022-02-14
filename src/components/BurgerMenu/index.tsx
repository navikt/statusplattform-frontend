import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from "react";
import styled from 'styled-components'

import { Close, Employer, Hamburger, Login, Logout } from '@navikt/ds-icons'
import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import Lenke from 'nav-frontend-lenker';
import { Button } from '@navikt/ds-react';

import { UserStateContext } from '../../components/ContextProviders/UserStatusContext';
import { UserData } from '../../types/userData';
import { RouterAdmin, RouterArbeidsgiver, RouterInternt, RouterLogin, RouterLogout, RouterPrivatperson, RouterSamarbeidspartner } from '../../types/routes';

const BurgerMenuContainer = styled.div`
    z-index: 10;

    transition: 0.2s ease-in-out;

    background-color: transparent;
    color: #0067c5;

    .hamburger-ikon, .close-ikon {
        width: 28px;
        height: 24px;

        position: relative;
        display: block;
    }

    .closed-burger {
        display: none;
    }
    
    .open {
        font-weight: bold;
    }
`

const PopoverCustomized = styled(Popover)`
    .popover-container {
        padding: 1rem 2rem;   
    }
    .popover-content {
        display: flex;
        flex-direction: row;
    }
    section {
        ul {
            list-style: none;
            padding: 0;
            margin: 1rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            a {
                color: #0067c5;
                background: none;
                text-decoration: underline;
                cursor: pointer;
                :hover {
                    text-decoration: none;
                }
            }
            li {
                padding: 1rem 0;
            }
            .popover-link-ikon {
                margin-right: 0.5rem;
            }
        }
    }
`

const Menu = styled.button`
    
`


const BurgerMenu = () => {
	useRouter()

    const [isLoggedIn, changeLoginState] = useState(true)
    const [anker, setAnker] = useState(undefined)
    /* Denne skal brukes når vi får mer forståelse av SSO-løsningen:
    const [maxNumberOfTiles, changeMaxNumberOfTiles] = useState()
    */

    const togglePopover = (event) => {
        if(anker) {
            setAnker(undefined)
            return
        }
        setAnker(event)
    }

    const closePopover = () => {
        if(anker) {
            setAnker(undefined)
        }
    }

    const DropdownMenuContainer = () => {
        return (
            <>
                <PopoverCustomized
                    ankerEl={anker}
                    orientering={PopoverOrientering.Under}
                    onRequestClose={closePopover}
                >
                    <PopoverContent />
                </PopoverCustomized>
            </>
        )
    }
    
    return (
        <BurgerMenuContainer onClick={(event) => togglePopover(event.currentTarget)}>
            <Button variant="secondary" id="menu-container" aria-expanded={!!anker} onClick={togglePopover}>
                <span><Hamburger className={!anker ? "hamburger-ikon" : "closed-burger"}/></span>
                <span><Close className={!!anker ? "close-ikon" : "closed-burger"}/></span>
                <span className="menu-text">Meny</span>
            </Button>
            <DropdownMenuContainer />
        </BurgerMenuContainer>
    )
}






/*------------ Helpers below ------------*/






const PopoverContent = () => {
    const user = useContext<UserData>(UserStateContext)



    return (
        <div className="popover-container">
            <div className="popover-content">
                <section>
                    <ul>
                        <li><Link href={RouterPrivatperson.PATH}>{RouterPrivatperson.NAME}</Link></li>
                        <li><Link href={RouterArbeidsgiver.PATH}>{RouterArbeidsgiver.NAME}</Link></li>
                        <li><Link href={RouterSamarbeidspartner.PATH}>{RouterSamarbeidspartner.NAME}</Link></li>
                        {user.navIdent &&
                            <li><Link href={RouterInternt.PATH}>{RouterInternt.NAME + " (Kun for innloggede nav brukere)"}</Link></li>
                        }
                    </ul>
                </section>
                
                <section>
                    <ul>
                        {user.navIdent &&
                            <>
                                <li>
                                    <Lenke href={RouterAdmin.PATH}>
                                        <Employer className="popover-link-ikon" />
                                        {RouterAdmin.NAME}
                                    </Lenke>
                                </li>
                            </>
                        }
                    </ul>
                </section>
            </div>
        </div>
                
    )
}


export default BurgerMenu