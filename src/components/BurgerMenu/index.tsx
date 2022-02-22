import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useRef, useState } from "react";
import styled from 'styled-components'

import { Close, Employer, Hamburger } from '@navikt/ds-icons'
import { Button, Popover } from '@navikt/ds-react';

import { UserStateContext } from '../../components/ContextProviders/UserStatusContext';
import { UserData } from '../../types/userData';
import { RouterAdmin, RouterArbeidsgiver, RouterInternt, RouterPrivatperson, RouterSamarbeidspartner } from '../../types/routes';

const BurgerMenuContainer = styled.div`
    .hamburger-ikon, .close-ikon {
        width: 28px;
        height: 24px;

        position: relative;
        display: block;
    }

    .closed-burger {
        display: none;
    }
`

const PopoverCustomized = styled(Popover)`
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
    }
`


const BurgerMenu = () => {
    const buttonRef = useRef(null);
    const [open, setOpen] = useState(false)
	
    useRouter()

    return (
        <BurgerMenuContainer>

            <Button variant="secondary" id="menu-container" aria-expanded={open} ref={buttonRef} onClick={() => setOpen(!open)}>
                <span><Hamburger className={!open ? "hamburger-ikon" : "closed-burger"}/></span>
                <span><Close className={open ? "close-ikon" : "closed-burger"}/></span>
                <span className="menu-text">Meny</span>
            </Button>

            <PopoverCustomized
                open={open}
                onClose={() => setOpen(!open)}
                anchorEl={buttonRef.current}
                placement="bottom"
            >
                <Popover.Content>
                    <PopoverContent />
                </Popover.Content>
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
                <li><Link href={RouterPrivatperson.PATH}>{RouterPrivatperson.NAME}</Link></li>
                <li><Link href={RouterArbeidsgiver.PATH}>{RouterArbeidsgiver.NAME}</Link></li>
                <li><Link href={RouterSamarbeidspartner.PATH}>{RouterSamarbeidspartner.NAME}</Link></li>
                {user.navIdent &&
                    <li><Link href={RouterInternt.PATH}>{RouterInternt.NAME + " (Kun for innloggede nav brukere)"}</Link></li>
                }
            </ul>
        
            <ul>
                {user.navIdent &&
                    <>
                        <li>
                            <Link href={RouterAdmin.PATH}>
                                <a><Employer className="popover-link-ikon" />{RouterAdmin.NAME}</a>
                            </Link>
                        </li>
                    </>
                }
            </ul>
        </div>                
    )
}


export default BurgerMenu