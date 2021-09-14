import 'react-dropdown/style.css';
import styled from 'styled-components'
import { useEffect, useState } from "react";

import NavFrontendSpinner from "nav-frontend-spinner";
import Knapp from 'nav-frontend-knapper'


import { fetchData } from 'utils/fetchAreas'
import { Area } from 'types/navServices';

import AreaTable from './AreaTable';
import TjenesteTable from './TjenesteTable';




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

const KnappCustomized = styled(Knapp)`
    width: 200px;
`

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

export interface Props {
    selectedMenu: string
}

const AdminDashboard = ({selectedMenu}: Props) => {
    const [adminAreas, setAdminAreas] = useState<Area[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [tileOrderIsDynamic, changeTileOrderIsDynamic] = useState(true) //DENNE MÅ ENDRES. Skal komme default fra rest

    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const adminAreas: Area[] = await fetchData()
            setAdminAreas(adminAreas)
            setIsLoading(false)
        })()
    }, [])

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
                        <h2>Områder <KnappCustomized style={{"font-size": "16px"}} kompakt onClick={changeTileOrdering}>{
                            tileOrderIsDynamic ? "Dynamisk sortering" : "Fiksert sortering"}
                            </KnappCustomized>
                        </h2>
                        {selectedMenu === "Områdemeny" ? (
                            <AreaTable adminAreas={adminAreas} setAdminAreas={setAdminAreas} isLoading={isLoading}/>
                            ) : (
                                <TjenesteTable adminAreas={adminAreas} />
                            )
                        }
                    </div>
                </AreasContainer>
        </AdminDashboardContainer>
    )
}

export default AdminDashboard