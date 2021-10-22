import Link from 'next/link'
import { useRouter } from 'next/router'

import { Hamburger, Login, Settings } from '@navikt/ds-icons'
import Popover, {PopoverOrientering} from 'nav-frontend-popover';

import { useState } from "react";
import styled from 'styled-components'
import { toast } from 'react-toastify';
import Lenke from 'nav-frontend-lenker';

const BurgerMenuContainer = styled.div`
    margin: 0 20px;
    z-index: 10;
`

const PopoverCustomized = styled(Popover)`
    ul {
        padding: 0 2rem;
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        li {
            padding: 1rem 0;
        }
        .popover-link-ikon {
            margin-right: 0.5rem;
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
    .hamburger-ikon {
        width: 28px;
        height: 24px;
        padding: 0;
        position: relative;
        margin-right: 0.5em;
        display: block;
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
            <Menu aria-expanded={!!anker} onClick={togglePopover}>
                <span><Hamburger className={!!anker ? "hamburger-ikon open" : "hamburger-ikon"}/></span>
                <span className="menu-text">Meny</span>
            </Menu>
            <DropdownMenuContainer />
        </BurgerMenuContainer>
    )
}



/*------------ Helpers below ------------*/



const PopoverContent = () => {
    return (
        <ul>
            <strong>Navn: Nordmann, Ola</strong>
            <li><a href="#0"><Lenke href="#0">Min side</Lenke></a></li>
            <li><a href="#0"><Lenke href="#0">Mine varsler</Lenke></a></li>
            <li onClick={() => toast.info("Ikke implementert innlogging")}>
                <Lenke href="#0">   
                    <Login className="popover-link-ikon" />
                    Logg inn
                </Lenke>
            </li>
        </ul>
    )
}


export default BurgerMenu