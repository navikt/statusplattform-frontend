import styled from 'styled-components'
import { useRouter } from 'next/router'

import Tabs from 'nav-frontend-tabs';



const DashboardTabMenu = styled.header`
    width: 100%;
    background-color: var(--navds-semantic-color-canvas-background-light);
    height: 50px;
`

const TabsCustomized = styled(Tabs)`
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    display: flex;
    justify-content: center;
    
`

export const adminMenu = ["Dashbord", "Områder", "Tjenester", "Komponenter"]
const defaultAdminMenu = adminMenu[1]


export const useFindCurrentTab = (adminMenu: string[]) => {
    const router = useRouter()
    const tab = router.query.tab || ""
    
    let selected = adminMenu.indexOf(Array.isArray(tab) ? tab[0] : tab)
    return selected >= 0 ? adminMenu[selected] : defaultAdminMenu
}


const MenuSelector: React.FC<{user}> = ({user}) => {
    const router = useRouter()

    const currentSelectedTab = useFindCurrentTab(adminMenu)



    const approvedUsers = process.env.NEXT_PUBLIC_APPROVED_USERS.split(",")
    let adminMenuWithAccessControl = adminMenu

    if(!approvedUsers.includes(user.navIdent)) {
        adminMenuWithAccessControl = adminMenu.filter(menu => menu !== "Dashbord" && menu !== "Områder")
    }


    return (
        <DashboardTabMenu>
            <TabsCustomized
                tabs={adminMenuWithAccessControl.map(path => { 
                    return {
                        "aktiv": path === currentSelectedTab,
                        "label": path}
                    })
                }
                onChange={(_, index) =>
                    router.push(router.pathname + "?tab=" + adminMenuWithAccessControl[index])
                }

            />
        </DashboardTabMenu>
    )
}
            
export default MenuSelector