import Privatperson from 'components/Dashboards/Privatperson';
import Layout from 'components/Layout'

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function DashboardPrivatperson() {
    return (
        <Layout>
            <Privatperson />
            <ToastContainer/>
        </Layout>
    )
}

