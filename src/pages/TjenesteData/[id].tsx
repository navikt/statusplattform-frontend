import Head from 'next/head'

import Layout from '../../components/Layout'

import CustomNavSpinner from '../../components/CustomNavSpinner'

import { useLoader } from '../../utils/useLoader'
import { useRenderComponentOnQuery } from '../../utils/routerHelpers'
import { fetchServiceFromId } from '../../utils/fetchServiceFromId'
import TjenestedataContent from './TjenestedataComponent'





const TjenestedataContainer: React.FC = () => useRenderComponentOnQuery("id", (id) => <ServiceDataComponent idOfService={id} />)




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
            <TjenestedataContent service={service}/>
        </Layout>
    )
}




export default TjenestedataContainer