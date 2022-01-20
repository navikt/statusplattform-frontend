import { useContext, useEffect } from 'react'

import Layout from '../../components/Layout'
import CreateNotifications from '../../components/SetupNotifications'
import { TitleContext } from 'src/components/ContextProviders/TitleContext'

const Varsling = () => {
    const { changeTitle } = useContext(TitleContext)
    
    useEffect(() => {
        changeTitle("Opprett varsling for digitale tjenester")
    })

    return (
        <Layout>
            <CreateNotifications />
        </Layout>
    )
}


export default Varsling