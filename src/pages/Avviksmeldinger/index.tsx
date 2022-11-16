import {
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
    Textarea,
    TextField,
} from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"
import { backendPath } from ".."
import { UserStateContext } from "../../components/ContextProviders/UserStatusContext"
import CustomNavSpinner from "../../components/CustomNavSpinner"

import Layout from "../../components/Layout"
import OpsMessageCard from "../../components/OpsMessageCard"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterError, RouterOpprettOpsMelding } from "../../types/routes"
import { EndPathOps } from "../../utils/apiHelper"
import { fetchOpsMessages } from "../../utils/opsAPI"
import { HorizontalSeparator } from "../Admin"

const CreateAvvikButtonWrapper = styled.div`
    margin-bottom: 2rem;
`

const OpsSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;

    h2 {
        margin-bottom: 1rem;
    }
`

export const getServerSideProps = async () => {
    const resOpsMessages = await fetch(backendPath + EndPathOps())
    const serverOpsMessages = await resOpsMessages.json()

    return {
        props: { serverOpsMessages },
    }
}

const OpsMessages = ({ serverOpsMessages }) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [opsMessages, setOpsMessages] =
        useState<OpsMessageI[]>(serverOpsMessages)

    const [opsMessage, newOpsMessage] = useState()
    const [reFetchOpsMessages, changeRefetchOpsMessages] = useState(false)

    const user = useContext(UserStateContext)

    const usersWithAccess: string[] = [
        "L152423",
        "H161540",
        "K146221",
        "J104568",
        "G124938",
        "M106261",
        "K132081",
        "H123099",
        "L110875",
        "K125327",
        "F110862",
        "A110886",
        "L120166",
        "H166137", "G121973"
    ]

    useEffect(() => {
        if (!usersWithAccess.includes(user.navIdent)) {
            router.push(RouterError.PATH)
        }
    }, [router])

    useEffect(() => {
        setIsLoading(true)
        let isMounted = true

        const setupOpsPage = async () => {
            try {
                const reloadedOpsMessages = await fetchOpsMessages()
                if (isMounted) {
                    setOpsMessages(reloadedOpsMessages)
                }
            } catch (error) {
                console.log(error)
                toast.error("Noe gikk galt ved henting av avviksmeldingene")
                isMounted = false
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                    isMounted = false
                }
            }
        }

        if (!usersWithAccess.includes(user.navIdent)) {
            router.push(RouterError.PATH)
        } else {
            setupOpsPage()
        }
        return () => {
            isMounted = false
            setIsLoading(false)
        }
    }, [opsMessage])

    useEffect(() => {
        setIsLoading(true)
        const refetch = async () => {
            try {
                try {
                    const reloadedOpsMessages = await fetchOpsMessages()
                    if (reFetchOpsMessages) {
                        setOpsMessages(reloadedOpsMessages)
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Noe gikk galt ved henting av avviksmeldingene")
                    changeRefetchOpsMessages(false)
                } finally {
                    if (reFetchOpsMessages) {
                        setIsLoading(false)
                        changeRefetchOpsMessages(false)
                    }
                }
            } catch (error) {}
        }
        if (reFetchOpsMessages == true) {
            refetch()
        }
        setIsLoading(false)
    }, [reFetchOpsMessages])

    const notifyChangedOpsMessage = (changedOps) => {
        newOpsMessage(changedOps)
    }

    const notifyDeletedOpsMessage = () => {
        changeRefetchOpsMessages(true)
    }

    if (isLoading) {
        return <CustomNavSpinner />
    }

    const arrayActive: OpsMessageI[] = opsMessages.filter(
        (message) => message.isActive
    )
    const arrayInActive: OpsMessageI[] = opsMessages.filter(
        (message) => !message.isActive
    )
    // const arrayArchived: OpsMessageI[] = opsMessages.filter(message => message.state == "archived")

    return (
        <Layout>
            <Head>
                <title>Operasjonsmeldinger - status.nav.no</title>
            </Head>
            <CreateAvvikButtonWrapper>
                <Button
                    onClick={() => router.push(RouterOpprettOpsMelding.PATH)}
                >
                    Opprett ny avviksmelding
                </Button>
            </CreateAvvikButtonWrapper>

            {/* <Heading level="2" size="small">Alle avviksmeldinger</Heading>            
            <ListOfOpsMessages opsMessages={opsMessages} /> */}

            <OpsSectionContainer>
                {arrayActive.length > 0 && (
                    <div>
                        <Heading level="2" size="xlarge">
                            Aktive meldinger
                        </Heading>

                        <ListOfOpsMessages
                            opsMessages={arrayActive}
                            notifyChangedOpsMessage={notifyChangedOpsMessage}
                            notifyDeletedOpsMessage={notifyDeletedOpsMessage}
                        />
                    </div>
                )}

                {arrayInActive.length > 0 && <HorizontalSeparator />}

                {arrayInActive.length > 0 && (
                    <div>
                        <Heading level="2" size="xlarge">
                            Inaktive meldinger
                        </Heading>

                        <ListOfOpsMessages
                            opsMessages={arrayInActive}
                            notifyChangedOpsMessage={notifyChangedOpsMessage}
                            notifyDeletedOpsMessage={notifyDeletedOpsMessage}
                        />
                    </div>
                )}

                {/* {arrayArchived.length > 0 &&
                    <div className="ops-section">
                        <Heading level="2" size="small">Arkiverte meldinger</Heading>            

                        <ListOfOpsMessages opsMessages={arrayArchived} />
                    </div>
                } */}
            </OpsSectionContainer>

            <ToastContainer />
        </Layout>
    )
}

const OpsMessagesList = styled.div`
    display: grid;
    grid-gap: 32px;

    @media (min-width: 800px) {
        grid-auto-rows: 350px;
        grid-template-columns: repeat(2, 350px);
    }

    @media (min-width: 1150px) {
        grid-auto-rows: 350px;
        grid-template-columns: repeat(3, 350px);
    }

    @media (min-width: 1600px) {
        grid-auto-rows: 350px;
        grid-template-columns: repeat(3, 500px);
    }
`

interface ListOfOpsMessagesI {
    opsMessages: OpsMessageI[]
    notifyChangedOpsMessage: (changedOps) => void
    notifyDeletedOpsMessage: () => void
}

const ListOfOpsMessages = (props: ListOfOpsMessagesI) => {
    const { opsMessages, notifyChangedOpsMessage, notifyDeletedOpsMessage } =
        props

    if (!opsMessages) {
        return <>Ingen avviksmeldinger å vise</>
    }

    return (
        <OpsMessagesList>
            {opsMessages.map((opsMessage) => {
                return (
                    <OpsMessageCard
                        key={opsMessage.id}
                        opsMessage={opsMessage}
                        notifyChangedOpsMessage={notifyChangedOpsMessage}
                        notifyDeletedOpsMessage={notifyDeletedOpsMessage}
                    />
                )
            })}
        </OpsMessagesList>
    )
}

export default OpsMessages
