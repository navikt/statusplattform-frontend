import { useEffect, useState } from "react"

import CustomNavSpinner from "components/CustomNavSpinner"
import { Dashboard } from "types/navServices"
import { fetchDashboardsList } from "utils/fetchDashboardsList"
import DashboardTemplate from "../DashboardTemplate"

const SamarbeidspartnerDashboard = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [retrievedDashboard, setRetrievedDashboard] = useState<Dashboard | undefined>()

    useEffect(() => {
        (async function () {
            setIsLoading(true)
            const dashboards: Dashboard[] = await fetchDashboardsList()
            const arbeidsGiverDashboard: Dashboard | undefined = (dashboards.find(dashboard => dashboard.name == "Samarbeidspartner" ? dashboard : undefined))
            setRetrievedDashboard(arbeidsGiverDashboard)
            setIsLoading(false)
        })()
    }, [])

    if(isLoading) {
        return (
            <CustomNavSpinner />
        )
    }

    return (
        <DashboardTemplate dashboard={retrievedDashboard}/>
    )
}

export default SamarbeidspartnerDashboard