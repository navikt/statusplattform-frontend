import { Logout, People, Settings } from '@navikt/ds-icons'
import { Knapp } from 'nav-frontend-knapper';
import Popover, {PopoverOrientering} from 'nav-frontend-popover';


import { useState } from "react";
import styled from 'styled-components'

const ProfileOrLoginContainer = styled.div`
    width: 125px;
    height: 75px;
    margin: 0 20px;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const SignIn = styled.div`
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: 1px solid var(--navGra40);
    transition: 0.2s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
        border: 1px solid transparent;
        background-color: var(--navGraBakgrunn);
        transition: 0.2s ease-in-out;
        cursor: pointer;
    }
`
const DropdownLogin = styled.div `
    height: auto;
    width: auto;
    top: 0;
    right: 0;
    border: 1px solid black;
    border-radius: 10px;
    z-index: 100;
    position: absolute;
`
const PopoverCustomized = styled(Popover)`
    ul {
        list-style: none;
        padding: 0 1.5rem;
        li {
            margin: 1rem;
            padding: 0.5rem;
            :hover {
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
`

const Menu = styled.span`
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: 1px solid var(--navGra40);
    transition: 0.2s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    svg:first-child {
        width: 50px;
        height: 50px;
        color: var(--navGra80);
    }
    :hover {
        border: 1px solid transparent;
        background-color: var(--navGraBakgrunn);
        transition: 0.2s ease-in-out;
        cursor: pointer;
    }
`


const ProfileOrLogin = () => {
    const [isDropdownMenuExpanded, changeMenuState] = useState(false)
    const [isLoggedIn, changeLoginState] = useState(false)
    const [anker, setAnker] = useState(undefined)

    const toggleMenu = () => {
        changeMenuState(!isDropdownMenuExpanded)
    }

    const DropdownMenuContainer = () => {
        if(isLoggedIn) {
            return (
                <>
                    <PopoverCustomized
                        ankerEl={anker}
                        orientering={PopoverOrientering.Under}
                        onRequestClose={() => setAnker(undefined)}
                    >
                        <ul>
                            <strong>Navn: Nordmann, Ola</strong>
                            <li>Min side</li>
                            <li>Mine varsler</li>
                            <li><Settings /> Konfigureringer</li>
                            <li onClick={() => changeLoginState(false)}><Logout /> Logg ut</li>
                        </ul>
                    </PopoverCustomized>
                </>
            )
        }
        return null
    }
    return (
        <ProfileOrLoginContainer onClick={(e) => setAnker(e.currentTarget)}>
            {!isLoggedIn && 
                <>
                    <SignIn onClick={() => changeLoginState(true)}>Logg in</SignIn>
                </>
            }
            {isLoggedIn && 
                <Menu onClick={() => toggleMenu()}>
                    <People />
                    {/* TODO: Dette er bare skallet. Mer skal legges til */}
                    
                </Menu>
            }
            {isLoggedIn && 
                <DropdownMenuContainer />
            }
        </ProfileOrLoginContainer>
    )
}

export default ProfileOrLogin