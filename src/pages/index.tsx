import Layout from 'components/Layout'
// import NavDashboard from './NavDashboard' Fjern hele siden under /pages når vi er ferdige med nytt oppsett for dashbordene

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Privatperson from 'components/Dashboards/Privatperson';

export default function Home() {

    return (
        <Layout>
            <Privatperson />
            <ToastContainer/>
        </Layout>
    )
}

