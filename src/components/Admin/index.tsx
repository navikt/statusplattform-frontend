import 'react-dropdown/style.css';
import styled from 'styled-components'

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';
import DashboardTable from './DashboardTable';
import { adminMenu, useFindCurrentTab } from './MenuSelector';
import { Close } from '@navikt/ds-icons';
import KomponentTable from './KomponentTable';




const AdminDashboardContainer = styled.div`
    width: 100%;
    padding: 0 0 3rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .button-container {
        padding-right: 2px;

        display: flex;
        flex-direction: row;

        .option {
            background-color: transparent;
            border: none;
            padding: 0 16px;

            max-width: 100px;
            
            display: flex;
            align-items: center;
            justify-content: center;

            :hover {
                cursor: pointer;
                color: grey;
                border-radius: 2pt;
                box-shadow: 0 0 0 1pt grey;
            }

            .not-expanded {
                transition: ease 0.5s;
                transform: rotate(0deg);
            }

            .expanded {
                transition: ease 0.5s;
                transform: rotate(-180deg);
            }
        }
    }
`;



const AdminConfigsContainer = styled.div`
    border-radius: 0 0 20px 20px;
    background-color: white; 
       
    width: 100%;
    padding: 0 1rem;
    h2 {
        margin: 0 0 .5rem;
        display: flex;
        justify-content: space-between;
    }
`;


export const NoContentContainer = styled.div`
    height: 100px;
    
    display: flex;
    justify-content: center;
    align-items: center;
`


export const ModalInner = styled.div`
    padding: 2rem 2.5rem;
    display: flex;
    flex-direction: column;
    
    button {
        margin: 1rem;
    }
`

export interface Props {
    selectedMenu?: string
}

const AdminDashboard = () => {
    const selectedMenu = useFindCurrentTab(adminMenu)
    
	return (
        <AdminDashboardContainer>
            <AdminConfigsContainer>
                {selectedMenu === "Områder" && 
                    <AreaTable />
                }
                {selectedMenu === "Tjenester" && 
                    <TjenesteTable />
                }
                {selectedMenu === "Dashbord" &&
                    <DashboardTable />
                }
                {selectedMenu === "Komponenter" &&
                    <KomponentTable />
                }
            </AdminConfigsContainer>
        </AdminDashboardContainer>
    )
}





/* ----------------------------- HELPER BELOW ----------------------------- */

export const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`



export default AdminDashboard