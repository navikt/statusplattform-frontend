import Layout from 'components/Layout'
import NavDashboard from './NavDashboard'

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    return (
        <Layout>
            <NavDashboard />
            <ToastContainer/>
        </Layout>
    )
}

