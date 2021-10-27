import InterntDashboard from 'components/Dashboards/Internt'
import Layout from 'components/Layout'

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function DashboardInternt() {
    return (
        <Layout>
            <InterntDashboard />
            <ToastContainer/>
        </Layout>
    )
}

