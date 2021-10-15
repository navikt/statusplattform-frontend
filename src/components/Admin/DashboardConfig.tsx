import CustomNavSpinner from 'components/CustomNavSpinner'
import { Hovedknapp } from 'nav-frontend-knapper'
import { Input } from 'nav-frontend-skjema'
import { useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { Dashboard } from 'types/navServices'
import { fetchDashboardsList } from 'utils/fetchDashboardsList'
import { useLoader } from 'utils/useLoader'

const DashboardConfigContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    .add-new-dashboard {
        td:nth-child(2) {
            vertical-align: bottom;
            .knapp {
                width: 100%;
            }
        }
    }
`


const DashboardConfig = () => {
    const { data: dashboards, isLoading, reload } = useLoader(fetchDashboardsList,[]);


    if (isLoading) {
        return (
            <CustomNavSpinner/>
        ) 
    }

    return (
        <DashboardConfigContainer>
            <DashboardTable dashboards={dashboards} />
            <AddNewDashboard reload={reload}/>
        </DashboardConfigContainer>
    )
}


/* Helpers below */

const DashboardTable: React.FC<{dashboards: Dashboard[]}> = ({dashboards}) => {
    return (
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th>Navn på Dashbord</th>
                </tr>
            </thead>
            <tbody>
                {dashboards.map((dashboard) => {
                    return (
                        <tr key={dashboard.name}>
                            <td>
                                {dashboard.name}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}


const AddNewDashboard: React.FC<{reload: Function}> = ({reload}) => {
    const [newDashboard, updateNewDashboard] = useState<Dashboard>({
        name: "",
        areas: []
    })


    const handleChangeDashboardName = (event) => {
        const changedDashboard = {
            name: event.target.value,
            areas: []
        }
        updateNewDashboard(changedDashboard)
    }
    

    const handlePostNewDashboard = (event) => {
        // postDashboards(newDashboard)
        event.preventDefault()
        toast.info("Kan ikke laste opp enda")
        reload()
    }

    const { name } = newDashboard

    return (
        <table className="tabell tabell--stripet add-new-dashboard">
            <tbody>
                <tr>
                    <td colSpan={2}>
                        <form onSubmit={(event) => handlePostNewDashboard(event)} id="form">
                            <Input type="text" required label="Navn" value={name} onChange={(event) => handleChangeDashboardName(event)} placeholder="Navn*" />
                        </form>
                    </td>
                    <td>
                        <Hovedknapp form="form" htmlType="submit" disabled={!name} value="Legg til dashbord">Legg til</Hovedknapp>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default DashboardConfig