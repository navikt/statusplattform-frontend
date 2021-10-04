import { Hovedknapp } from 'nav-frontend-knapper'
import { Input } from 'nav-frontend-skjema'
import NavFrontendSpinner from 'nav-frontend-spinner'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { Dashboard } from 'types/navServices'
import { fetchDashboards } from 'utils/fetchDashboards'
import { postDashboards } from 'utils/postDashboard'
import { useLoader } from 'utils/useLoader'

const DashboardConfigContainer = styled.div`

`

const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
`


const DashboardConfig = () => {
    const { data: dashboards, isLoading, reload } = useLoader(fetchDashboards,[]);


    if (isLoading) {
        return (
            <LoaderSpinner/>
        ) 
    }

    return (
        <DashboardConfigContainer>
            <DashboardTable dashboards={dashboards} />
            <AddNewDashboard />
        </DashboardConfigContainer>
    )
}


/* Helpers below */

const LoaderSpinner = () => {
    return (
        <SpinnerCentered>
            <NavFrontendSpinner type="XXL" />
        </SpinnerCentered>
    )
}

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


const AddNewDashboard = () => {
    const [newDashboard, updateNewDashboard] = useState<Dashboard>({
        name: "",
        areaIds: [""]
    })


    const handleChangeDashboardName = (event) => {
        const changedDashboard = {
            name: event.target.value,
            areaIds: [""]
        }
        updateNewDashboard(changedDashboard)
    }
    

    const handlePostNewDashboard = () => {
        // postDashboards(newDashboard)
        toast.info("Kan ikke laste opp enda")
    }

    const { name } = newDashboard

    return (
        <table className="tabell tabell--stripet add-new-dashboard">
            <tbody>
                <tr>
                    <td colSpan={2}>
                        <Input type="text" required value={name} onChange={(event) => handleChangeDashboardName(event)} placeholder="Navn*" />
                    </td>
                    <td>
                        <Hovedknapp disabled={!name} value="Legg til dashbord" onClick={() => handlePostNewDashboard()}>Legg til</Hovedknapp>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default DashboardConfig