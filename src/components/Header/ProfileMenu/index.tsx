import styled from "styled-components"
import { useState } from "react"
import { useRouter } from "next/router"
import { Logout, PeopleFilled } from "@navikt/ds-icons"
import { BodyShort, Button, Popover } from "@navikt/ds-react"
import { RouterLogin, RouterLogout } from "../../../types/routes"

const ProfileButton = styled(Button)`
    border-radius: 50px;
    min-width: 148px;
    color: black;
    box-shadow: inset 0 0 0 2px black;

    :hover {
        background: black;
    }
`

const LoginButton = styled(Button)`
    border-radius: 50px;
    min-width: 148px;
    color: black;
    box-shadow: inset 0 0 0 2px black;

    :hover {
        background: black;
    }
`

const PopoverCustomized = styled(Popover)`
    position: absolute;
    width: max-content;
    margin: 4rem 0 0 7rem;

    ul {
        padding: 0;
        margin: 1rem;
    }

    ul > li {
        color: black;
        list-style: none;
        text-align: left;
    }

    li {
        padding: 1rem 0;
    }

    .navds-link,
    svg {
        color: var(--a-blue-500);
        cursor: pointer;
    }
    .content {
        display: flex;
        flex-direction: column;
    }
`

const ProfileMenu: React.FC<{ name: string; navIdent: string }> = ({
    name,
    navIdent,
}) => {
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(undefined)

    const handleSetOpen = (event) => {
        setOpen(!open)
        if (anchorEl) {
            setAnchorEl(undefined)
            return
        }
        setAnchorEl(event)
    }

    const closePopover = () => {
        setOpen(!open)
        if (anchorEl) {
            setAnchorEl(undefined)
        }
    }

    return (
        <>
            {name && navIdent ? (
                <>
                    <ProfileButton
                        variant="secondary"
                        onClick={(event) => handleSetOpen(event.currentTarget)}
                        aria-expanded={!!anchorEl}
                        icon={<PeopleFilled />}
                    />
                    <PopoverCustomized
                        open={open}
                        onClose={closePopover}
                        anchorEl={anchorEl}
                        placement="bottom-end"
                    >
                        <PopoverCustomized.Content>
                            <div className="content">
                                <strong>{name}</strong>

                                <a
                                    className="navds-link"
                                    href={RouterLogout.PATH}
                                >
                                    {" "}
                                    <Logout /> Logg ut
                                </a>
                            </div>
                        </PopoverCustomized.Content>
                    </PopoverCustomized>
                </>
            ) : (
                <LoginButton
                    variant="secondary"
                    onClick={() => router.push(RouterLogin.PATH)}
                >
                    <BodyShort>
                        <b>Logg inn</b>
                    </BodyShort>
                </LoginButton>
            )}
        </>
    )
}

export default ProfileMenu
