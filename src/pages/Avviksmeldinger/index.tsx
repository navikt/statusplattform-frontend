import { Button, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup, Textarea, TextField } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import styled from 'styled-components'
import { TitleContext } from "../../components/ContextProviders/TitleContext"
import CustomNavSpinner from "../../components/CustomNavSpinner"

import Layout from '../../components/Layout'
import OpsMessageCard from "../../components/OpsMessageCard"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterError, RouterOpprettOpsMelding } from "../../types/routes"
import { fetchOpsMessages } from "../../utils/opsAPI"


const CreateAvvikButtonWrapper = styled.div`
    margin-bottom: 2rem;
`


const OpsMessages = () => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [opsMessages, setOpsMessages] = useState<OpsMessageI[]>()
    
    useEffect(() => {
        (async function () {
            setIsLoading(true)

            if(router.isReady) {
                await fetchOpsMessages().then((response) => {
                    setOpsMessages(response)
                    setIsLoading(false)
                }).catch(()=> {
                    router.push(RouterError.PATH)   
                })
            }

        })()
    },[router])
    
    if(isLoading) {
        return <CustomNavSpinner />
    }
    
    

    return (
        <Layout>
            <Head>
                <title>Operasjonsmeldinger - status.nav.no</title>
            </Head>
            <CreateAvvikButtonWrapper>
                <Button onClick={() => router.push(RouterOpprettOpsMelding.PATH)}>Opprett ny avviksmelding</Button>
            </CreateAvvikButtonWrapper>

            <ListOfOpsMessages opsMessages={opsMessages} />
            <ToastContainer />
        </Layout>
    )

}



const OpsMessagesList = styled.div`
    display: flex;
    flex-flow: row wrap;
    gap: 32px;
`

const ListOfOpsMessages: React.FC<{opsMessages: OpsMessageI[]}> = ({opsMessages}) => {
    if(!opsMessages) {
        return (
            <>
                Ingen avviksmeldinger å vise
            </>
        )
    }

    return (
        <OpsMessagesList>
            {
                opsMessages.map((opsMessage) => {
                    return <OpsMessageCard key={opsMessage.id} opsMessage={opsMessage} />
                })
            }
        </OpsMessagesList>
    )
}


export default OpsMessages