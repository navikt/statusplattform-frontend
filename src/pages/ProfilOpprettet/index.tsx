import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { TitleContext } from '../../components/ContextProviders/TitleContext'
import CustomNavSpinner from '../../components/CustomNavSpinner'
import Layout from '../../components/Layout'
import { RouterHomePage } from '../../types/routes'

const ProfileCreated = () => {
    const { changeTitle } = useContext(TitleContext)
    const router = useRouter()

    useEffect(() => {
        toast.info("Ikke implementert")
        changeTitle("Bruker opprettet")
    },[])
    
    
    setTimeout(() => router.push(RouterHomePage.PATH), 6000)

    return (
        <Layout>
            Ikke implementert. Sender deg tilbake til Privatperson-dashbordet...
            <CustomNavSpinner />
        </Layout>
    )
}

export default ProfileCreated