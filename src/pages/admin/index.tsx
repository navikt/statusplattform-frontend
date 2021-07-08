import styled from 'styled-components'

import Layout from 'components/Layout';
import Admin from 'components/Admin';
import DashboardSelector from 'components/Admin/DashboardSelector';

const AdminContainer = styled.div`
    max-width: 1080px;
`

export default function Home() {
    return (
        <Layout>
            <AdminContainer>
                <DashboardSelector />
                <Admin />
            </AdminContainer>
        </Layout>
    )
}

