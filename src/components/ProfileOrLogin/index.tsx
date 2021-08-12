import { Logout, People, Settings } from '@navikt/ds-icons'
import { Knapp } from 'nav-frontend-knapper';
import Popover, {PopoverOrientering} from 'nav-frontend-popover';


import { useState } from "react";
import styled from 'styled-components'

const ProfileOrLoginContainer = styled.div`
    margin: 0 20px;
    z-index: 10;
`

const SignIn = styled.div`
    min-height: 75px;
    min-width: 75px;
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
    min-height: 75px;
    min-width: 75px;
    border-radius: 50%;
    border: 1px solid var(--navGra40);
    transition: 0.2s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    .profil-bilde {
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
                    <People className="profil-bilde"/>
                    {/* TODO: Dette er bare skallet. Mer skal legges til */}
                    
                    <DropdownMenuContainer />
                </Menu>
            }
            {/* {isLoggedIn && 
            } */}
        </ProfileOrLoginContainer>
    )
}

export default ProfileOrLogin