import styled from 'styled-components'

import Layout from '../../components/Layout';
import Admin from '../../components/Admin';
import MenuSelector from '../../components/Admin/MenuSelector';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const AdminContainer = styled.div`
    width: 100%;
`

 const AdminPage = () => {

    return (
        <Layout>
            <AdminContainer>
                <MenuSelector />
                <Admin />
            </AdminContainer>
            <ToastContainer/>
        </Layout>
    )
}

export default AdminPage