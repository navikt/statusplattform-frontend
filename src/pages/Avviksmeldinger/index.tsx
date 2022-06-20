import { Button, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup, Textarea, TextField } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import styled from 'styled-components'
import { backendPath } from ".."
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../components/CustomNavSpinner"

import Layout from '../../components/Layout'
import OpsMessageCard from "../../components/OpsMessageCard"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterError, RouterOpprettOpsMelding } from "../../types/routes"
import { EndPathOps } from "../../utils/apiHelper"
import { fetchOpsMessages } from "../../utils/opsAPI"


const CreateAvvikButtonWrapper = styled.div`
    margin-bottom: 2rem;
`

export const getServerSideProps = async () => {
    const resOpsMessages = await fetch(backendPath + EndPathOps())
    const opsMessages = await resOpsMessages.json()

    return {
        props: { opsMessages }
    }
}


const OpsMessages = ({opsMessages}) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    // const [opsMessages, setOpsMessages] = useState<OpsMessageI[]>()
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
                    // setOpsMessages(opsMessages)
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

    // const arrayActive: OpsMessageI[] = opsMessages.filter(message => message.state == "active")
    // const arrayInActive: OpsMessageI[] = opsMessages.filter(message => message.state == "inActive")
    // const arrayArchived: OpsMessageI[] = opsMessages.filter(message => message.state == "archived")
    // console.log(opsMessages)

    return (
        <Layout>
            <Head>
                <title>Operasjonsmeldinger - status.nav.no</title>
            </Head>
            <CreateAvvikButtonWrapper>
                <Button onClick={() => router.push(RouterOpprettOpsMelding.PATH)}>Opprett ny avviksmelding</Button>
            </CreateAvvikButtonWrapper>

            <Heading level="2" size="small">Alle avviksmeldinger</Heading>            
            <ListOfOpsMessages opsMessages={opsMessages} />

            {/* {arrayActive.length > 0 &&
                <div>
                    <Heading level="2" size="small">Aktive meldinger</Heading>            
    
                    <ListOfOpsMessages opsMessages={arrayActive} />
                </div>
            }

            {arrayInActive.length > 0 &&
                <div>
                    <Heading level="2" size="small">Inaktive meldinger</Heading>            

                    <ListOfOpsMessages opsMessages={arrayInActive} />
                </div>
            }

            {arrayArchived.length > 0 &&
                <div>
                    <Heading level="2" size="small">Arkiverte meldinger</Heading>            

                    <ListOfOpsMessages opsMessages={arrayArchived} />
                </div>
            } */}

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