import styled from 'styled-components'

import Tabs from 'nav-frontend-tabs';
import Panel from 'nav-frontend-paneler'
import { SyntheticEvent } from 'react';

const DashboardTabMenu = styled.header`
    width: 100%;
    background-color: var(--navBakgrunn);
    height: 50px;
`

const TabsCustomized = styled(Tabs)`
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    display: flex;
    justify-content: center;
    
`

export interface Props {
    currentSelectedMenu: string
    onClickSelectedMenu: Function
    adminMenu: string[]
}


const MenuSelector = ({currentSelectedMenu, onClickSelectedMenu, adminMenu}: Props) => {

    return (
        <DashboardTabMenu>
            <TabsCustomized
                defaultAktiv={1}
                tabs={[
                    {"label": "Dashbord"},
                    {"label": "Områder"},
                    {"label": "Tjenester"}
                ]}
                onChange={(_, index) =>
                    onClickSelectedMenu(adminMenu[index])
                }

            />
        </DashboardTabMenu>
    )
}
            
export default MenuSelector