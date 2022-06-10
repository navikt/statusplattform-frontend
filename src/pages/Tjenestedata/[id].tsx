import Head from 'next/head'

import Layout from '../../components/Layout'

import CustomNavSpinner from '../../components/CustomNavSpinner'
import TjenestedataContent from './TjenestedataComponent'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Area, Service } from '../../types/navServices'
import { RouterPrivatperson } from '../../types/routes'
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext'
import { UserData } from '../../types/userData'
import { backendPath } from '..'
import { EndPathAreaContainingServices, EndPathServiceHistory, EndPathSpecificService } from '../../utils/apiHelper'




export const getServerSideProps = async (context) => {
    const { id } = context.query
    
    const [resService, resAreasContainingService, resServiceIncidentHistory] = await Promise.all([
        
        fetch(backendPath + EndPathSpecificService(id)),
        fetch(backendPath + EndPathAreaContainingServices(id)),
        fetch(backendPath + EndPathServiceHistory(id))
    ])

    const retrievedService: Service = await resService.json()
    const retrievedAreaContainingService: Area[] = await resAreasContainingService.json()
    const retrievedServiceIncidentHistory = await resServiceIncidentHistory.json()

    return {    
        props: {
            retrievedService: retrievedService,
            retrievedAreaContainingService: retrievedAreaContainingService,
            retrievedServiceIncidentHistory: retrievedServiceIncidentHistory
        }
    }
}


const TjenestedataContainer = ({retrievedService, retrievedAreaContainingService, retrievedServiceIncidentHistory}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [service, setService] = useState<Service>(retrievedService)

    const router = useRouter()

    const user = useContext<UserData>(UserStateContext)


    useEffect(() => {
        setIsLoading(false)
    },[])

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
            <Head><title>Tjeneste: {service.name} - status.nav.no</title></Head>
            <TjenestedataContent service={retrievedService} areasContainingThisService={retrievedAreaContainingService} retrievedServiceIncidentHistory={retrievedServiceIncidentHistory}/>
        </Layout>
    )
}



export default TjenestedataContainer