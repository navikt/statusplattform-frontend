import { GetServerSideProps } from "next"
import Layout from "../../components/LayoutExternal"
import { Dashboard } from "../../types/types"
import { PortalDashboardTile } from "./PortalDashboardTile"

export const getServerSideProps: GetServerSideProps = async () => {
    const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH
    const res = await fetch(backendPath + '/rest/Dashboards/external')
    const dashboards = await res.json()
    return {
        props: {
            dashboards,
        },
    }
}

interface DashboardsOverviewProps {
    dashboards: Dashboard[]
}

const DashboardsOverview = ({ dashboards }: DashboardsOverviewProps) => {
    return (
        <Layout>
            <PortalDashboardTile dashboards={dashboards}  />
        </Layout>
    )
}


export default DashboardsOverview