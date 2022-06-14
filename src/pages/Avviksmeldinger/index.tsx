import { Button, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup, Textarea, TextField } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import styled from 'styled-components'
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../components/CustomNavSpinner"

import Layout from '../../components/Layout'
import OpsMessageCard from "../../components/OpsMessageCard"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterError, RouterOpprettOpsMelding } from "../../types/routes"
import { fetchOpsMessages } from "../../utils/opsAPI"


const CreateAvvikButtonWrapper = styled.div`
    margin-bottom: 2rem;
`


const OpsMessages = ({data}) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [opsMessages, setOpsMessages] = useState<OpsMessageI[]>()
    const [ fetchingUser, setFetchingUser ] = useState(true);

    const user = useContext(UserStateContext)

    const usersWithAccess: string[] = [
        "L152423", "H161540", "K146221", "J104568", "G124938", "M106261",
        "K132081", "H123099", "L110875", "K125327", "F110862", "A110886", "L120166"
    ]
    
    useEffect(() => {
        setIsLoading(true)
        let isMounted = true

        const setupOpsPage = async () => {
            try {
                const opsMessages = await fetchOpsMessages()
                if(isMounted) {
                    setOpsMessages(opsMessages)
                    setFetchingUser(false)
                }
            } catch (error) {
                console.log(error)
                setFetchingUser(false)
                router.push(RouterError.PATH)   
            } finally {
                if(isMounted) {
                    setIsLoading(false)
                }
            }
        }

        if(!usersWithAccess.includes(user.navIdent)) {
            router.push(RouterError.PATH)
        }
        else {
            setupOpsPage()
        }
        return () => {
            isMounted = false
        }
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