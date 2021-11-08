import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from 'next/head'

import CustomNavSpinner from "components/CustomNavSpinner"
import DashboardTemplate from "./DashboardTemplate"
import Layout from 'components/Layout'

import { Dashboard } from "types/navServices"
import { fetchDashboardsList } from "utils/fetchDashboardsList"
import Custom404 from "pages/404"


const DashboardFromId = () => {
    const router = useRouter()
    let dashboardTarget: Object = router.query.dashboardId

    const [isLoading, setIsLoading] = useState(true)
    const [retrievedDashboard, setRetrievedDashboard] = useState<Dashboard | undefined>()


    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const dashboards: Dashboard[] = await fetchDashboardsList()
            const arbeidsGiverDashboard: Dashboard | undefined = (dashboards.find(dashboard => dashboard.name == dashboardTarget ? dashboard : undefined))
            setRetrievedDashboard(arbeidsGiverDashboard)
            setIsLoading(false)
        })()
    }, [dashboardTarget])

    

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    

    if(!retrievedDashboard) {
        return (
            <Custom404 />
        )
    }

    

    return (
        <Layout>
            <Head>
                <title>{retrievedDashboard.name}</title>
            </Head>
            <DashboardTemplate dashboard={retrievedDashboard}/>
        </Layout>
    )
}

export default DashboardFromId