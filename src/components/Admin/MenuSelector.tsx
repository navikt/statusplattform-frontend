import styled from "styled-components"
import { useRouter } from "next/router"
import { Tabs } from "@navikt/ds-react"
import { useState } from "react"

const DashboardTabMenu = styled.header`
    width: 100%;
    background-color: var(--a-gray-100);
    height: 50px;

    display: flex;
    justify-content: center;
`

const TabsCustomized = styled(Tabs)`
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
`

export const adminMenu = ["Dashbord", "Områder", "Tjenester", "Komponenter"]
const defaultAdminMenu = adminMenu[2]

export const useFindCurrentTab = (adminMenu: string[]) => {
    const router = useRouter()
    const tab = router.query.tab || ""

    let selected = adminMenu.indexOf(Array.isArray(tab) ? tab[0] : tab)
    return selected >= 0 ? adminMenu[selected] : defaultAdminMenu
}

const MenuSelector: React.FC<{ user }> = ({ user }) => {
    const router = useRouter()

    const [selectedTab, setSelectedTab] = useState<string>(
        useFindCurrentTab(adminMenu)
    )

    const handleNewSelectedTab = (newTab) => {
        router.push(router.pathname + "?tab=" + newTab, undefined, {
            shallow: true,
        })
        setSelectedTab(newTab)
    }

    const usersWithAccess = process.env.NEXT_PUBLIC_APPROVED_USERS?.split(",")

    let adminMenuWithAccessControl = adminMenu

    if (!usersWithAccess.includes(user.navIdent)) {
        adminMenuWithAccessControl = adminMenu.filter(
            (menu) => menu !== "Dashbord" && menu !== "Områder"
        )
    }

    return (
        <DashboardTabMenu>
            <TabsCustomized defaultValue="Tjenester" value={selectedTab}>
                <Tabs.List>
                    {adminMenuWithAccessControl.map((tab, index) => {
                        return (
                            <Tabs.Tab
                                key={index}
                                value={tab}
                                label={tab}
                                onClick={() => handleNewSelectedTab(tab)}
                            />
                        )
                    })}
                </Tabs.List>
            </TabsCustomized>
        </DashboardTabMenu>
    )
}

export default MenuSelector
