import styled from 'styled-components'

import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Incidents from '../../components/Incidents'
import { Area, Dashboard } from '../../types/navServices'

import NavFrontendSpinner from "nav-frontend-spinner"
import { fetchDashboard } from '../../utils/fetchDashboard'
import { fetchDashboardsList } from '../../utils/fetchDashboardsList'


const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;
const SpinnerCentered = styled.div`
    position: absolute;
    top: 40%;
`

const IncidentsPage = () => {
    const [areas, setAreas] = useState<Area[]>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            const dashboards: Dashboard[] = await fetchDashboardsList()
            const retrievedDashboard: Dashboard = await fetchDashboard(dashboards[0].id)
            setAreas(retrievedDashboard.areas)
            setIsLoading(false)
        })()
    }, [])



    if (!areas) {
        return <ErrorParagraph>Kunne ikke hente de digitale tjenestene. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
    }

    if (isLoading) {
        return (
            <SpinnerCentered>
                <NavFrontendSpinner type="XXL" />
            </SpinnerCentered>
        ) 
    }

    return (
        <Layout>
            <Incidents areas={areas}/>
        </Layout>
    )
}

export default IncidentsPage