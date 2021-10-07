import 'react-dropdown/style.css';
import styled from 'styled-components'
import { useEffect, useState } from "react";

import { fetchTiles } from 'utils/fetchTiles'
import { Service, Tile, Dashboard } from 'types/navServices';

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';
import { fetchServices } from 'utils/fetchServices';
import { fetchDashboards } from 'utils/fetchDashboards';
import { Select } from 'nav-frontend-skjema';
import DashboardConfig from './DashboardConfig';
import NavFrontendSpinner from 'nav-frontend-spinner';
import CustomNavSpinner from 'components/CustomNavSpinner';




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
    const [selectedDashboard, updateSelectedDashboard] = useState<Dashboard>() //Dette må ikke være type any i lengden. Kan potensielt fjernes også
    const [adminTiles, setAdminTiles] = useState<Tile[]>([])
    const [services, setServices] = useState<Service[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [tileOrderIsDynamic, changeTileOrderIsDynamic] = useState(true) //DENNE MÅ ENDRES. Skal komme default fra rest

    const fetchData = async () => {
        setIsLoading(true)
        const dashboards: Dashboard[] = await fetchDashboards()
        setDashboards(dashboards)
        updateSelectedDashboard(dashboards[0])
        const tiles: Tile[] = await fetchTiles(dashboards[0])
        const allServices: Service[] = await fetchServices()
        setAdminTiles(tiles)
        setServices(allServices)
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
                            <CustomSelect value={selectedDashboard} onChange={event => updateSelectedDashboard(event.target.value)} label="Velg Dashbord">
                                {dashboards.map((dashboard, index) => (
                                    <option key={index} value={dashboard.name} label={dashboard.name}/>
                                ))}
                                
                            </CustomSelect>
                            <AreaTable selectedDashboard={selectedDashboard}/>
                        </AreaTableContainer>
                    }
                    {selectedMenu === "Tjenester" && 
                        <TjenesteTable />
                    }
                    {selectedMenu === "Dashbord" &&
                        <DashboardConfig />
                    }
                    <p>Felter markert med * er obligatoriske</p>
                </AdminConfigsContainer>
        </AdminDashboardContainer>
    )
}




export default AdminDashboard