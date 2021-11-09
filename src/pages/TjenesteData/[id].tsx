import Head from 'next/head'

import Layout from 'components/Layout'
import TjenesteData from './TjenesteData'
import CustomNavSpinner from 'components/CustomNavSpinner'

import { useLoader } from 'utils/useLoader'
import { useRenderComponentOnQuery } from 'utils/routerHelpers'
import { fetchServiceFromId } from 'utils/fetchServiceFromId'




const TjenesteDataContainer: React.FC = () => useRenderComponentOnQuery("id", (id) => <ServiceDataComponent idOfService={id} />)




const ServiceDataComponent: React.FC<{idOfService: string}> = ({idOfService}) => {
    const { data: service, isLoading } = useLoader(() => fetchServiceFromId(idOfService),[]);

    if(isLoading) {
        return (
            <>
                <CustomNavSpinner />
            </>
        )
    }

    return (
        <Layout>
            <Head><title>Tjeneste: {service.name}</title></Head>
            <TjenesteData service={service}/>
        </Layout>
    )
}




export default TjenesteDataContainer