import { ChatExclamationmarkIcon } from "@navikt/aksel-icons"
import { Employer, Logout, People } from "@navikt/ds-icons"
import { Button, Link, Popover } from "@navikt/ds-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { CustomPopoverContent } from "src/styles/styles"

import styled from "styled-components"
import {
    RouterAdmin,
    RouterLogin,
    RouterLogout,
    RouterOpsMeldinger,
} from "../../../types/routes"

const ProfileButton = styled(Button)`
    min-width: 148px;
    color: black;
    box-shadow: none;
    border: none;
`

const PopoverCustomized = styled(Popover)`
    width: max-content;

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
const SubMenuDivider = styled.div`
    width: 15rem;
    height: 1px;
    margin: 0.5rem 0 0.6rem;
    background-color: var(--a-gray-300);
`

const UserName = styled.div`
    width: 15rem;
`

const ProfileMenu: React.FC<{
    name: string
    navIdent: string
}> = ({ name, navIdent }) => {
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(undefined)
    const [anchor, setAnchor] = useState<HTMLSelectElement>(null)

    const usersWithAccess = process.env.NEXT_PUBLIC_APPROVED_USERS?.split(",")
    const usersWithOpsAccess = process.env.NEXT_PUBLIC_OPS_ACCESS?.split(",")

    const handleSetOpen = (event) => {
        setOpen(!open)
        if (anchorEl) {
            setAnchorEl(undefined)
            return
        }
        setAnchorEl(event)
        console.log(
            "Adminaccess: " +
                usersWithAccess +
                " ||| OpsAccess: " +
                usersWithOpsAccess
        )
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
                        ref={setAnchor}
                        icon={<People />}
                        iconPosition="right"
                    >
                        {navIdent}
                    </ProfileButton>
                    <Popover
                        open={open}
                        onClose={closePopover}
                        anchorEl={anchor}
                        placement="bottom-end"
                    >
                        <Popover.Content>
                            <CustomPopoverContent>
                                <UserName>
                                    <b>̧{name}</b>
                                </UserName>
                                {usersWithOpsAccess.includes(navIdent) && (
                                    <div>
                                        <SubMenuDivider />

                                        <a
                                            onClick={() =>
                                                router.push(
                                                    RouterOpsMeldinger.PATH +
                                                        "/OpprettMelding"
                                                )
                                            }
                                            className="internalLinks"
                                        >
                                            <ChatExclamationmarkIcon className="subMenuIcon" />{" "}
                                            {"Opprett driftsmelding"}
                                        </a>
                                    </div>
                                )}
                                {usersWithAccess.includes(navIdent) && (
                                    <div>
                                        <SubMenuDivider />
                                        <a
                                            onClick={() =>
                                                router.push(RouterAdmin.PATH)
                                            }
                                            className="internalLinks"
                                        >
                                            <Employer className="adminIcon" />{" "}
                                            {RouterAdmin.NAME}
                                        </a>
                                    </div>
                                )}

                                <SubMenuDivider />
                                <div>
                                    <a
                                        href={RouterLogout.PATH}
                                        className="internalLinks"
                                    >
                                        <Logout className="logOutIcon" /> Logg
                                        ut
                                    </a>
                                </div>
                            </CustomPopoverContent>{" "}
                        </Popover.Content>
                    </Popover>
                </>
            ) : (
                <ProfileButton
                    variant="secondary"
                    onClick={() => router.push(RouterLogin.PATH)}
                    aria-expanded={!!anchorEl}
                    icon={<People />}
                    iconPosition="right"
                >
                    Logg inn
                </ProfileButton>
            )}
        </>
    )
}

export default ProfileMenu
