import styled from 'styled-components'
import { useContext, useEffect, useState } from 'react'

import Layout from '../../components/Layout'
import Incidents from '../../components/Incidents'
import { Area, Dashboard } from '../../types/navServices'
import CustomNavSpinner from '../../components/CustomNavSpinner'
import { fetchDashboard, fetchDashboardsList } from '../../utils/dashboardsAPI'
import { TitleContext } from '../../components/ContextProviders/TitleContext'



const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;


const IncidentsPage = () => {
    const [areas, setAreas] = useState<Area[]>()
    const [isLoading, setIsLoading] = useState(true)

    const { changeTitle } = useContext(TitleContext)

    useEffect(() => {
        (async function () {
            const dashboards: Dashboard[] = await fetchDashboardsList()
            const retrievedDashboard: Dashboard = await fetchDashboard(dashboards[0].id)
            setAreas(retrievedDashboard.areas)
            setIsLoading(false)
        })()
    }, [])



    
    if (isLoading) {
        return (
            <CustomNavSpinner />
            ) 
        }
        
    if (!areas) {
        changeTitle("Feil oppstått!")
        return (
            <Layout>
                <ErrorParagraph>Kunne ikke hente de digitale tjenestene. Hvis problemet vedvarer, kontakt support.</ErrorParagraph>
            </Layout>
        )
    }

    return (
        <Layout>
            <Incidents />
        </Layout>
    )
}

export default IncidentsPage