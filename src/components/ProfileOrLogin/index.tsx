import Link from 'next/link'
import { useRouter } from 'next/router'

import { Logout, People, Settings } from '@navikt/ds-icons'
import Popover, {PopoverOrientering} from 'nav-frontend-popover';

import { useState } from "react";
import styled from 'styled-components'
import { Normaltekst } from 'nav-frontend-typografi';

const ProfileOrLoginContainer = styled.div`
    margin: 0 20px;
    z-index: 10;
`

const SignIn = styled.button`
    min-height: 75px;
    min-width: 75px;
    border-radius: 50%;
    border: 1px solid var(--navGra40);
    transition: 0.2s ease-in-out;
    background-color: transparent;
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
    cursor: default;
    ul {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        list-style: none;
        padding: 0 1.5rem;
        li {
            margin: 0.5rem;
            padding: 0.5rem;
        }
    }
    
    p {
        margin: 0;
        :hover {
            cursor: pointer;
            text-decoration: underline;
        }
    }
`

const Menu = styled.button`
    min-height: 75px;
    min-width: 75px;
    border-radius: 50%;
    border: 1px solid var(--navGra40);
    transition: 0.2s ease-in-out;
    background-color: transparent;
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

const Configurations = styled.div`
    max-width: 125px;
    padding-left: 0.5rem;
`


const ProfileOrLogin = () => {
	useRouter()

    const [isLoggedIn, changeLoginState] = useState(false)
    const [anker, setAnker] = useState(undefined)
    const [isSettingsToggled, changeSettingsState] = useState(false)
    /* Denne skal brukes når vi får mer forståelse av SSO-løsningen.
    const [maxNumberOfTiles, changeMaxNumberOfTiles] = useState()
    */

    const toggleSettings = () => {
        changeSettingsState(!isSettingsToggled)
    }

    const togglePopover = (event) => {
        if(anker) {
            setAnker(undefined)
            return
        }
        setAnker(event)
    }

    const DropdownMenuContainer = () => {
        if(isLoggedIn) {
            return (
                <>
                    <PopoverCustomized
                        ankerEl={anker}
                        orientering={PopoverOrientering.Under}
                        onRequestClose={togglePopover}
                    >
                        <ul>
                            <strong>Navn: Nordmann, Ola</strong>
                            <li><a href="#0"><p>Min side</p></a></li>
                            <li><a href="#0"><p>Mine varsler</p></a></li>
                            <li><p onClick={() => toggleSettings()}><Settings /> Konfigureringer</p>
                                {isSettingsToggled &&
                                    <Configurations>
                                        <span>
                                            {/* Dette skal lages ferdig når vi har bedre forståelse av SSO */}
                                            Maks elementer per rad: <select name="amountOfTiles" id="">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                            </select>
                                        </span>
                                    </Configurations>
                                }
                            </li>
                            <li>
                                <Link href="/admin">
                                    <Normaltekst>Admin</Normaltekst>
                                </Link>
                            </li>
                            <li onClick={() => changeLoginState(false)}><p><Logout /> Logg ut</p></li>
                        </ul>
                    </PopoverCustomized>
                </>
            )
        }
        return null
    }
    return (
        <ProfileOrLoginContainer onClick={(event) => togglePopover(event.currentTarget)}>
            {!isLoggedIn && 
                <>
                    <SignIn onClick={() => changeLoginState(true)}>Logg in</SignIn>
                </>
            }
            {isLoggedIn && 
                <Menu aria-expanded={!!anker} onClick={togglePopover}>
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