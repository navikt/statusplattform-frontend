import Head from 'next/head'

import Layout from '../../components/Layout'

import CustomNavSpinner from '../../components/CustomNavSpinner'
import { useLoader } from '../../utils/useLoader'
import { useRenderComponentOnQuery } from '../../utils/routerHelpers'
import TjenestedataContent from './TjenestedataComponent'
import { fetchServiceFromId } from '../../utils/servicesAPI'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Service } from '../../types/navServices'
import { RouterError, RouterPrivatperson } from '../../types/routes'
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext'
import { UserData } from '../../types/userData'





const TjenestedataContainer = () => {
    // const { data: service, isLoading, reload } = useLoader(() => fetchServiceFromId(idOfService),[]);
    const [isLoading, setIsLoading] = useState(false)
    const [service, setService] = useState<Service>()
    const router = useRouter()

    const user = useContext<UserData>(UserStateContext)


    useEffect(() => {

    },[])

    useEffect(() => {
        (async function () {
            setIsLoading(true)
            if(router.isReady) {
                const id: string = await router.asPath.split("/").pop()
                try {
                    const retrievedService = await fetchServiceFromId(id)
                    setService(retrievedService)
                } catch (error) {
                    router.push(RouterError.PATH)   
                } finally {
                    setIsLoading(false)
                }
            }
        })()
    }, [router])

    if(isLoading || !service) {
        return (
            <>
                <CustomNavSpinner />
            </>
        )
    }

    if(!user.navIdent) {
        router.push(RouterPrivatperson.PATH)
    }

    return (
        <Layout>
            <Head><title>Tjeneste: {service.name}</title></Head>
            <TjenestedataContent service={service}/>
        </Layout>
    )
}




const ServiceDataComponent: React.FC<{idOfService: string}> = ({idOfService}) => {
    const { data: service, isLoading, reload } = useLoader(() => fetchServiceFromId(idOfService),[]);

    if(isLoading) {
        return (
            <>
                <CustomNavSpinner />
            </>
        )
    }

    console.log(service.name)

    return (
        <Layout>
            <Head><title>Tjeneste: {service.name}</title></Head>
            <TjenestedataContent service={service}/>
        </Layout>
    )
}




export default TjenestedataContainer