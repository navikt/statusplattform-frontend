import 'react-dropdown/style.css';
import styled from 'styled-components'
import { useEffect, useState } from "react";

import NavFrontendSpinner from "nav-frontend-spinner";
import Knapp from 'nav-frontend-knapper'


import { fetchTiles } from 'utils/fetchTiles'
import { Area, Service, Tile, Dashboard } from 'types/navServices';

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';
import { fetchServices } from 'utils/fetchServices';
import { fetchDashboards } from 'utils/fetchDashboards';
import { Select } from 'nav-frontend-skjema';
import DashboardConfig from './DashboardConfig';




const AdminDashboardContainer = styled.div`
    padding: 0;
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

const AreasContainer = styled.div`
    border-radius: 0 0 20px 20px;
    background-color: white;    
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    @media (min-width: 45rem) {
        justify-content: space-between;
        flex-direction: row;
    }
    h2 {
        margin: 0 0 .5rem;
        display: flex;
        justify-content: space-between;
    }
`;

const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
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



    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const dashboards: Dashboard[] = await fetchDashboards()
            setDashboards(dashboards)
            updateSelectedDashboard(dashboards[0])
            const tiles: Tile[] = await fetchTiles(dashboards[0])
            const allServices: Service[] = await fetchServices()
            setAdminTiles(tiles)
            setServices(allServices)
            setIsLoading(false)
        })()
    }, [])

    const changeSelectedDashboard = (event) => {
        const dashboardId: string = event.target.value
        // console.log(dashboardId)
        // Kommentert ut det under. Skal her fetche nytt dashboard
        // useEffect(() => {
        //     (async function () {
        //         setIsLoading(true)
        //         const dashboard: any[] = await fetchDashboard(dashboardId)
        //         updateSelectedDashboard(dashboard)
        //         setIsLoading(false)
        //     })()
        // }, [])
    }

    const reFetchAdminTiles = () => {
        // useEffect(() => {
        //     (async function () {
        //         const tiles: Tile[] = await fetchTiles()
        //         setAdminTiles(tiles)
        //     })()
        // }, [])
    }

    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }


    const changeTileOrdering = () => {
        changeTileOrderIsDynamic(!tileOrderIsDynamic)
    }
    
	return (
        <AdminDashboardContainer>

                <AreasContainer>
                    <div>
                        <h2>{selectedMenu}</h2>
                        <p>Felter markert med * er obligatoriske</p>
                        {selectedMenu === "Områder" && 
                            <>
                                <CustomSelect onChange={changeSelectedDashboard} label="Velg Dashbord">
                                    {dashboards.map((dashboard, index) => (
                                        <option key={index} value={dashboard.name} label={dashboard.name}/>
                                    ))}
                                    
                                </CustomSelect>
                                <AreaTable allServices={services} adminTiles={adminTiles} setAdminTiles={setAdminTiles}
                                    isLoading={isLoading} setIsLoading={setIsLoading} 
                                    reFetchAdminTiles={reFetchAdminTiles} selectedDashboard={selectedDashboard}/>
                            </>
                        }
                        {selectedMenu === "Tjenester" && 
                            <TjenesteTable services={services} setServices={setServices} setIsLoading={setIsLoading} />
                        }
                        {selectedMenu === "Dashbord" &&
                                <DashboardConfig />
                        }

                        )
                    </div>
                </AreasContainer>
        </AdminDashboardContainer>
    )
}

export default AdminDashboard