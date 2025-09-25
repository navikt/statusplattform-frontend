import styled from 'styled-components'
import { useContext, useEffect, useState } from 'react'

import Layout from '@/components/Layout'
import Incidents from '@/components/Incidents'
import { Area, Dashboard } from '@/types/types'
import CustomNavSpinner from '@/components/CustomNavSpinner'
import { fetchDashboard, fetchDashboardsList } from '@/utils/dashboardsAPI'
import { TitleContext } from '@/components/ContextProviders/TitleContext'
import { backendPath } from '..'
import { EndPathOps, EndPathServices } from '@/utils/apiHelper'
import Head from 'next/head'



const ErrorParagraph = styled.p`
    color: #ff4a4a;
    font-weight: bold;
    padding: 10px;
    border-radius: 5px;
`;

export async function getServerSideProps() {
    const [resOpsMessages] = await Promise.all([
        fetch(backendPath + EndPathOps()),
    ])
    
    const allOpsMessages = await resOpsMessages.json()

    return {
        props: {
            allOpsMessages,
        }
    }
}


const IncidentsPage = ({allOpsMessages}) => {
    return (
        <Layout>
            <Head>
                <title>Avvikshistorikk - status.nav.no</title>
            </Head>
            <Incidents allOpsMessages={allOpsMessages} />
        </Layout>
    )
}

export default IncidentsPage