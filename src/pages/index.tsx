// import NavDashboard from './NavDashboard' Fjern hele siden under /pages når vi er ferdige med nytt oppsett for dashbordene

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import DashboardFromId from './Dashboard/[dashboardId]';

export default function Home() {
    const router = useRouter()
    const [atHomePage] = useState(false)

    useEffect(() => {
        if(router.asPath == "/") {
            router.push("/Dashboard/Privatperson")
        }
    },[router])


    return (
        <>
            {atHomePage &&
                <>
                    <DashboardFromId/>
                </>
            }
        </>
    )
}

