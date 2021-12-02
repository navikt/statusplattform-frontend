import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from "react";
import styled from 'styled-components'

import { Close, Employer, Hamburger, Login } from '@navikt/ds-icons'
import Popover, {PopoverOrientering} from 'nav-frontend-popover';
import Lenke from 'nav-frontend-lenker';

import { UserStateContext } from 'components/ContextProviders/UserStatusContext';
import { UserData } from 'types/userData';

const BurgerMenuContainer = styled.div`
    margin: 0 20px;
    z-index: 10;
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
    height: 45px;
    transition: 0.2s ease-in-out;
    border: 1px solid transparent;
    border-radius: 2px;
    background-color: transparent;
    color: #0067c5;
    padding: 4px 12px;
    display: flex;
    align-items: center;
    .hamburger-ikon, .close-ikon {
        width: 28px;
        height: 24px;
        padding: 0;
        margin-right: 0.5em;
        position: relative;
        display: block;
    }
    .closed-burger {
        display: none;
    }
    .open {
        font-weight: bold;    
    }
    .menu-text {
        margin: 0;
        font-family: "Source Sans Pro", Arial, sans-serif;
        font-size: 1.25rem;
        line-height: 1.5625rem;
        font-weight: 600;
    }
    :hover {
        border: 1px solid;
        transition: 0.2s ease-in-out;
        cursor: pointer;
    }
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

    const DropdownMenuContainer = () => {
        return (
            <>
                <PopoverCustomized
                    ankerEl={anker}
                    orientering={PopoverOrientering.Under}
                    onRequestClose={togglePopover}
                >
                    <PopoverContent />
                </PopoverCustomized>
            </>
        )
    }
    
    return (
        <BurgerMenuContainer onClick={(event) => togglePopover(event.currentTarget)}>
            <Menu id="menu-container" aria-expanded={!!anker} onClick={togglePopover}>
                <span><Hamburger className={!anker ? "hamburger-ikon" : "closed-burger"}/></span>
                <span><Close className={!!anker ? "close-ikon" : "closed-burger"}/></span>
                <span className="menu-text">Meny</span>
            </Menu>
            <DropdownMenuContainer />
        </BurgerMenuContainer>
    )
}






/*------------ Helpers below ------------*/






const PopoverContent = () => {
    const user = useContext<UserData>(UserStateContext)



    return (
        <div className="popover-container">
            <strong>{user.name}</strong>
            <div className="popover-content">
                <section>
                    <ul>
                        <li><Link href="/Dashboard/Privatperson">Privatperson</Link></li>
                        <li><Link href="/Dashboard/Arbeidsgiver">Arbeidsgiver</Link></li>
                        <li><Link href="/Dashboard/Samarbeidspartner">Samarbeidspartner</Link></li>
                        <li><Link href="/Dashboard/Internt">Internt (Kun for innloggede nav brukere)</Link></li>
                    </ul>
                </section>
                
                <section>
                    <ul>
                        <li><Lenke href="#0">Min side</Lenke></li>
                        <li><Lenke href="#0">Mine varsler</Lenke></li>
                        {user.navIdent &&
                            <>
                                <li>
                                    <Lenke href="/Admin">
                                        <Employer className="popover-link-ikon" />
                                        Adminside
                                    </Lenke>
                                </li>
                                <li>
                                    <Lenke href="/oauth2/Logout">
                                        <Login className="popover-link-ikon" />
                                        Logg ut
                                    </Lenke>
                                </li>
                            </>
                        }
                        {!user.name &&
                            <li>
                                <Lenke href="/Login">
                                    <Login className="popover-link-ikon" />
                                    Logg inn
                                </Lenke>
                            </li>
                        }
                    </ul>
                </section>
            </div>
        </div>
                
    )
}


export default BurgerMenu