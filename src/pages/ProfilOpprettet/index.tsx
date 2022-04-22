import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { TitleContext } from '../../components/ContextProviders/TitleContext'
import { UserStateContext } from '../../components/ContextProviders/UserStatusContext'
import CustomNavSpinner from '../../components/CustomNavSpinner'
import Layout from '../../components/Layout'
import { RouterHomePage, RouterInternt } from '../../types/routes'
import { UserData } from '../../types/userData'
import { checkLoginInfoAndState } from '../../utils/checkLoginInfoAndState'

const ProfileCreated = () => {
    const router = useRouter()
    const { changeTitle } = useContext(TitleContext)
    const user  = useContext(UserStateContext)

    useEffect(() => {
        toast.info("Ikke implementert")
        changeTitle("Bruker opprettet")
    },[router])

    const conditionalReroute = (): void => {
        if(user.navIdent) {
            router.push(RouterInternt.PATH)
        }
        else {
            router.push(RouterHomePage.PATH)
        }
    }
    
    
    setTimeout(
        () => conditionalReroute(),
        6000
    )

    return (
        <Layout>
            Ikke implementert. Sender deg tilbake til Privatperson-dashbordet...
            <CustomNavSpinner />
        </Layout>
    )
}

export default ProfileCreated