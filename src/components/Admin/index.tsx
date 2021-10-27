import 'react-dropdown/style.css';
import styled from 'styled-components'
import { useState } from "react";

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';
import { Select } from 'nav-frontend-skjema';
import DashboardConfig from './DashboardConfig';
import { adminMenu, useFindCurrentTab } from './MenuSelector';




const AdminDashboardContainer = styled.div`
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    th {
        span {
            display: flex;
            justify-content: center;
        }
    }
    tr {
        td:nth-child(2) {
            span {
                text-align: left;
                display: block;
            }
        }
        td:nth-child(3) {
            span {
                text-align: left;
                display: block;
            }
        }
    }
	td {
		height: 75px;
        span {
            display: flex;
            justify-content: center;
        }
	}
    @media(min-width: 500px){
    	padding: 0 0 3rem 0;
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

const AreaTableContainer = styled.div`
    width: 100%;
    /* overflow-x: auto; */
`

const CustomSelect = styled(Select)`
    min-width: 100px;
    max-width: 200px;
`

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
                    <AreaTableContainer>
                        <AreaTable />
                    </AreaTableContainer>
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