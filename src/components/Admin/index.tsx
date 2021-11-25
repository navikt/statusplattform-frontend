import 'react-dropdown/style.css';
import styled from 'styled-components'

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';
import DashboardConfig from './DashboardConfig';
import { adminMenu, useFindCurrentTab } from './MenuSelector';




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
            padding: 0 1rem;

            max-width: 75px;
            
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
    padding: 2rem 1rem;
    h2 {
        margin: 0 0 .5rem;
        display: flex;
        justify-content: space-between;
    }
`;

export interface Props {
    selectedMenu?: string
}

const AdminDashboard = () => {
    const selectedMenu = useFindCurrentTab(adminMenu)
    
	return (
        <AdminDashboardContainer>
            <AdminConfigsContainer>
                <h2>{selectedMenu}</h2>
                {selectedMenu === "Områder" && 
                    <AreaTable />
                }
                {selectedMenu === "Tjenester" && 
                    <TjenesteTable />
                }
                {selectedMenu === "Dashbord" &&
                    <DashboardConfig />
                }
            </AdminConfigsContainer>
        </AdminDashboardContainer>
    )
}




export default AdminDashboard