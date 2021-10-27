import SamarbeidspartnerDashboard from 'components/Dashboards/Samarbeidspartner';
import Layout from 'components/Layout'

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function DashboardSamarbeidspartner() {
    return (
        <Layout>
            <SamarbeidspartnerDashboard />
            <ToastContainer/>
        </Layout>
    )
}

