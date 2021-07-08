import styled from 'styled-components'

import Tabs from 'nav-frontend-tabs';
import Panel from 'nav-frontend-paneler'

const DashboardTabMenu = styled.header`
    width: 100%;
    background-color: var(--navBakgrunn);
    border-radius: 20px 20px 0 0;
    height: 50px;
`

const TabsCustomized = styled(Tabs)`
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    display: flex;
    justify-content: center;
    
`


const DashboardSelector = () => {

    return (
        <DashboardTabMenu>
            <TabsCustomized
                tabs={[
                    {"label": "Privatperson"},
                    {"label": "Samarbeidspartner"},
                    {"label": "Intern"}
                ]}
                onChange={() => {}}
            />
            {/* <PanelCustomized border>
                Innhold her.
            </PanelCustomized> */}


        </DashboardTabMenu>
    )
}
            
export default DashboardSelector