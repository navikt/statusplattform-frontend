import 'react-dropdown/style.css';
import styled from 'styled-components'
import { useEffect, useState } from "react";

import { fetchDashboard } from 'utils/fetchDashboard'
import { Service, Tile, Dashboard, Area } from 'types/navServices';

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';
import { fetchServices } from 'utils/fetchServices';
import { fetchDashboardsList } from 'utils/fetchDashboardsList';
import { Select } from 'nav-frontend-skjema';
import DashboardConfig from './DashboardConfig';
import CustomNavSpinner from 'components/CustomNavSpinner';
import { fetchTypes } from 'utils/fetchTypes';




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
    overflow-x: auto;
`

const CustomSelect = styled(Select)`
    min-width: 100px;
    max-width: 200px;
`

export interface Props {
    selectedMenu: string
    adminMenu: string[]
}

const AdminDashboard = ({selectedMenu, adminMenu}: Props) => {
    const [dashboards, setDashboards] = useState<Dashboard[]>()
    const [dashboardAreas, setDashboardAreas] = useState<Area[]>([])
    const [services, setServices] = useState<Service[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [tileOrderIsDynamic, changeTileOrderIsDynamic] = useState(true) //DENNE MÅ ENDRES. Skal komme default fra rest

    const fetchData = async () => {
        setIsLoading(true)
        const dashboards: Dashboard[] = await fetchDashboardsList()
        setDashboards(dashboards)

        const dashboard: Dashboard = await fetchDashboard(dashboards[0].id)
        const allServices: Service[] = await fetchServices()
        setServices(allServices)

        setDashboardAreas(dashboard.areas)
        setIsLoading(false)
    };

    useEffect(() => {
        fetchData()
    }, [])

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }
    


    const changeTileOrdering = () => {
        changeTileOrderIsDynamic(!tileOrderIsDynamic)
    }
    
	return (
        <AdminDashboardContainer>
                <AdminConfigsContainer>
                    <h2>{selectedMenu}</h2>
                    {selectedMenu === "Områder" && 
                        <AreaTableContainer>
                            {/* <CustomSelect value={selectedDashboard} onChange={event => updateSelectedDashboard(event.target.value)} label="Velg Dashbord">
                                {dashboards.map((dashboard, index) => (
                                    <option key={index} value={dashboard.name} label={dashboard.name}/>
                                ))}
                                
                            </CustomSelect> */}
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