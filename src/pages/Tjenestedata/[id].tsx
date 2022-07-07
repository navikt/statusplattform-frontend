import Head from 'next/head'

import Layout from '../../components/Layout'

import CustomNavSpinner from '../../components/CustomNavSpinner'
import TjenestedataContent from './TjenestedataComponent'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Area, Component, Service } from '../../types/types'
import { RouterPrivatperson } from '../../types/routes'
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext'
import { UserData } from '../../types/userData'
import { backendPath } from '..'
import { EndPathAreaContainingServices, EndPathServiceHistory, EndPathSpecificComponent, EndPathSpecificService } from '../../utils/apiHelper'




export const getServerSideProps = async (context) => {
    const { id } = context.query
    
    const [resService, resComponent, resAreasContainingService] = await Promise.all([
        fetch(backendPath + EndPathSpecificService(id)),
        fetch(backendPath + EndPathSpecificComponent(id)),
        fetch(backendPath + EndPathAreaContainingServices(id)),
    ])

    let retrievedService: Service
    let retrievedComponent: Component
    let retrievedAreaContainingService: Area[]

    // Handle fetched data
    await resService.json().then((response) => {
        retrievedService = response
    }).catch(() => {retrievedService = null})
    await resComponent.json().then((response) => {
        retrievedComponent = response
    }).catch(() => {retrievedComponent = null})
    await resAreasContainingService.json().then((response) => {
        retrievedAreaContainingService = response
    }).catch(() => {retrievedAreaContainingService=[]})

    return {
        props: {
            retrievedService: retrievedService,
            retrievedComponent: retrievedComponent,
            retrievedAreaContainingService: retrievedAreaContainingService,
        }
    }
}


const TjenestedataContainer = ({retrievedService, retrievedComponent, retrievedAreaContainingService}) => {
    const [isLoading, setIsLoading] = useState(false)
    const service: Service = retrievedService
    const component: Component = retrievedComponent

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

    if(service && !component) {
        return (
            <Layout>
                <Head><title>Tjeneste: {service.name} - status.nav.no</title></Head>
                <TjenestedataContent service={service} areasContainingThisService={retrievedAreaContainingService} />
            </Layout>
        )
    }

    return (
        <Layout>
            <Head><title>Tjeneste: {component.name} - status.nav.no</title></Head>
            <TjenestedataContent component={component} areasContainingThisService={retrievedAreaContainingService} />
        </Layout>
    )
}



export default TjenestedataContainer