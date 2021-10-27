import ArbeidsgiverDashboard from 'components/Dashboards/Arbeidsgiver';
import Layout from 'components/Layout'

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function DashboardArbeidsgiver() {
    return (
        <Layout>
            <ArbeidsgiverDashboard />
            <ToastContainer/>
        </Layout>
    )
}

