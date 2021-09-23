import styled from 'styled-components'

import { useEffect, useState } from 'react'
import Layout from 'components/Layout'
import Incidents from 'components/Incidents'
import { Dashboard, Tile } from 'types/navServices'

import NavFrontendSpinner from "nav-frontend-spinner"
import { fetchTiles } from 'utils/fetchTiles'
import { fetchDashboards } from 'utils/fetchDashboards'


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
    const [tiles, setAreas] = useState<Tile[]>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async function () {
            const dashboards: Dashboard[] = await fetchDashboards()
            const newAreas: Tile[] = await fetchTiles(dashboards[0])
            setAreas(newAreas)
            setIsLoading(false)
        })()
    }, [])



    if (!tiles) {
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
            <Incidents tiles={tiles}/>
        </Layout>
    )
}

export default IncidentsPage