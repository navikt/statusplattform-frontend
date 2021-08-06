import { People } from '@navikt/ds-icons'


import { useState } from "react";
import styled from 'styled-components'

const ProfileOrLoginContainer = styled.div`
    width: 125px;
    height: 75px;
    margin: 0 20px;
    border-radius: 50%;
    border: 1px solid var(--navGra40);
    background-color: var(--navBakgrunn);
    transition: 0.2s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    ul {
        overflow: hidden;
        /* position: absolute; */
        .not-expanded {
            display: none;
        }
        .expanded {
            display: block;
            position: relative;
            z-index: 10;
        }
    }

    :hover {
        border: 1px solid transparent;
        background-color: var(--navGraBakgrunn);
        cursor: pointer;
        transition: 0.2s ease-in-out;
    }
`

const SignIn = styled.div`

`

const Menu = styled.span`
    svg:first-child {
        width: 50px;
        height: 50px;
        color: var(--navGra80);
    }
`


const ProfileOrLogin = () => {
    const [isMenuExpanded, changeMenuState] = useState(false)

    let isLoggedIn: boolean = true;

    const toggleMenu = () => {
        changeMenuState(!isMenuExpanded)
    }
    return (
        <ProfileOrLoginContainer>
            {!isLoggedIn && 
                <SignIn>Logg in</SignIn>
            }
            {isLoggedIn && 
                <Menu onClick={() => toggleMenu()}>
                    <People />
                    {/* TODO: Dette er bare skallet. Mer skal legges til */}
                    
                </Menu>
            }
            {isLoggedIn && isMenuExpanded && 
            <ul className={isMenuExpanded ? "expanded" : "not-expanded"}>
                <li>Profilinnstillinger</li>
                <li>Konfigureringer</li>
            </ul>
            }
        </ProfileOrLoginContainer>
    )
}

export default ProfileOrLogin