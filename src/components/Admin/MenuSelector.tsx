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
}


const MenuSelector = ({currentSelectedMenu, onClickSelectedMenu}: Props) => {

    const menues = ["Områdemeny", "Tjenestemeny"]

    return (
        <DashboardTabMenu>
            <TabsCustomized
                tabs={[
                    {"label": "Områdemeny"},
                    {"label": "Tjenestemeny"}
                ]}
                onChange={(_, index) =>
                    onClickSelectedMenu(menues[index])
                }

            />
        </DashboardTabMenu>
    )
}
            
export default MenuSelector