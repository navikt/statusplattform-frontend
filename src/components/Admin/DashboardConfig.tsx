import { Close } from '@navikt/ds-icons'
import CustomNavSpinner from 'components/CustomNavSpinner'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import { Input } from 'nav-frontend-skjema'
import { useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { Dashboard } from 'types/navServices'
import { deleteDashboard } from 'utils/deleteDashboard'
import { fetchDashboardsList } from 'utils/fetchDashboardsList'
import { postDashboard } from 'utils/postDashboard'
import { useLoader } from 'utils/useLoader'

const DashboardConfigContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    .knapp {
        text-transform: none;
    }
`


const DashboardConfig = () => {
    const [editNewDashboard, updateEditNewDashboard] = useState(false)
    const { data: dashboards, isLoading, reload } = useLoader(fetchDashboardsList,[]);


    if (isLoading) {
        return (
            <CustomNavSpinner/>
        ) 
    }

    return (
        <DashboardConfigContainer>
            <p>
                <Knapp kompakt onClick={() => updateEditNewDashboard(!editNewDashboard)}>{!editNewDashboard ? "Legg til nytt dashbord" : "Avbryt nytt dashbord"}</Knapp>
            </p>
            {editNewDashboard &&
                <AddNewDashboard reload={reload}/>
            }
            <DashboardTable dashboards={dashboards} />
        </DashboardConfigContainer>
    )
}





const CloseCustomized = styled(Close)`
    color: red;
    :hover {
        color: grey;
        border: 1px solid;
        cursor: pointer;
    }
`

/* Helpers below */

const DashboardTable: React.FC<{dashboards: Dashboard[]}> = ({dashboards}) => {

    const handleDeleteDashboard = (dashboard: Dashboard) => {
        deleteDashboard(dashboard).then(() => {
            toast.info("Dashbordet ble slettet")
        }).catch(() => {
            toast.error("Kunne ikke slette dashbord")
        })
    }

    return (
        <table className="tabell tabell--stripet">
            <thead>
                <tr>
                    <th>Navn på Dashbord</th>
                    <th>Slett</th>
                </tr>
            </thead>
            <tbody>
                {dashboards.map((dashboard) => {
                    return (
                        <tr key={dashboard.name}>
                            <td>
                                {dashboard.name}
                            </td>
                            <td>
                                <CloseCustomized aria-label="Fjern tjenesten fra område"
                                    onClick={() => handleDeleteDashboard(dashboard)}
                                />
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}




const AddNewDashboardContainer = styled.div`
    max-width: 500px;
    input {
        margin-bottom: 1rem;
    }
`

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
    

    const handlePostNewDashboard = () => {
        postDashboard(newDashboard).then(() => {
            toast.success("Dashbord lastet opp")
        }).catch(() => {
            toast.error("Klarte ikke å laste opp dashbord")
        })
        reload()
    }

    const { name } = newDashboard

    return (
        <form onSubmit={handlePostNewDashboard} id="form">
            <AddNewDashboardContainer>
                <Input type="text" required label="Navn på dashbord" value={name} onChange={(event) => handleChangeDashboardName(event)} placeholder="Navn*" />
                <Hovedknapp kompakt htmlType="submit" value="Legg til dashbord">Legg til dashbord</Hovedknapp>
            </AddNewDashboardContainer>
        </form>
    )
}

export default DashboardConfig