import styled from 'styled-components'

import Layout from 'components/Layout';
import Admin from 'components/Admin';
import DashboardSelector from 'components/Admin/DashboardSelector';
import { useState } from 'react';

const AdminContainer = styled.div`
    max-width: 1080px;
`

 const AdminPage = () => {
    // [selectedDashboard, changeSelectedDashboard] = useState(0)


    return (
        <Layout>
            <AdminContainer>
                <DashboardSelector />
                <Admin />
            </AdminContainer>
        </Layout>
    )
}

export default AdminPage