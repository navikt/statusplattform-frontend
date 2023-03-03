import { Back } from "@navikt/ds-icons"
import { Button, Heading } from "@navikt/ds-react"
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

const CreateAvvikButtonWrapper = styled.div``
const OpsHead = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 3rem;
`
const OpsHeadNoMsgs = styled.div`
    display: flex;
    flex-direction: column;

    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 7rem 8rem 7rem 8rem;
    gap: 1rem;
    border-radius: 0.5rem;
    z-index: 1000;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    .createMsgBtn {
        width: 18rem;
        margin-left: 4.5rem;
    }

    .goBackBtn {
        position: absolute;
        top: 1rem;
        left: 1rem;
    }
`
const OpsSectionContainer = styled.div`
    display: flex;
    flex-direction: column;

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
    const approvedUsers = [
        "L152423",
        "K132081",
        "H123099",
        "L110875",
        "K125327",
        "F110862",
        "A110886",
        "L120166",
        "M106261",
        "M137316",
        "G121973",
        "H166137",
    ]

    useEffect(() => {
        if (!user.navIdent) {
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
                toast.error("Noe gikk galt ved henting av driftsmeldinger")
                isMounted = false
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                    isMounted = false
                }
            }
        }

        if (!user.navIdent) {
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
                    toast.error("Noe gikk galt ved henting av driftsmeldinger")
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
                <title>Driftsmeldinger - status.nav.no</title>
            </Head>

            {/* <Heading level="2" size="small">Alle driftsmeldinger</Heading>            
            <ListOfOpsMessages opsMessages={opsMessages} /> */}

            <OpsSectionContainer>
                {arrayActive.length == 0 && arrayInActive.length == 0 && (
                    <>
                        <OpsHeadNoMsgs>
                            <Button
                                variant="tertiary"
                                onClick={() => router.back()}
                                icon={<Back />}
                                className="goBackBtn"
                            >
                                Gå tilbake
                            </Button>
                            <Heading level="2" size="large" className="heading">
                                Ingen driftsmeldinger tilgjengelig
                            </Heading>
                            {approvedUsers.includes(user.navIdent) && (
                                <Button
                                    onClick={() =>
                                        router.push(
                                            RouterOpprettOpsMelding.PATH
                                        )
                                    }
                                    className="createMsgBtn"
                                >
                                    Opprett ny driftsmelding
                                </Button>
                            )}
                        </OpsHeadNoMsgs>
                    </>
                )}
                {arrayActive.length > 0 && (
                    <>
                        <OpsHead>
                            <Heading
                                level="2"
                                size="xlarge"
                                className="heading"
                            >
                                Aktive meldinger
                            </Heading>
                            {approvedUsers.includes(user.navIdent) && (
                                <Button
                                    onClick={() =>
                                        router.push(
                                            RouterOpprettOpsMelding.PATH
                                        )
                                    }
                                >
                                    Opprett ny driftsmelding
                                </Button>
                            )}
                        </OpsHead>
                        <HorizontalSeparator />

                        <ListOfOpsMessages
                            opsMessages={arrayActive}
                            notifyChangedOpsMessage={notifyChangedOpsMessage}
                            notifyDeletedOpsMessage={notifyDeletedOpsMessage}
                        />
                    </>
                )}

                {arrayInActive.length > 0 && (
                    <div>
                        <OpsHead>
                            <Heading
                                level="2"
                                size="xlarge"
                                className="heading"
                            >
                                Inaktive meldinger
                            </Heading>
                            {arrayActive.length <= 0 &&
                                approvedUsers.includes(user.navIdent) && (
                                    <Button
                                        onClick={() =>
                                            router.push(
                                                RouterOpprettOpsMelding.PATH
                                            )
                                        }
                                    >
                                        Opprett ny driftsmelding
                                    </Button>
                                )}
                        </OpsHead>
                        <HorizontalSeparator />

                        <ListOfOpsMessages
                            opsMessages={arrayInActive}
                            notifyChangedOpsMessage={notifyChangedOpsMessage}
                            notifyDeletedOpsMessage={notifyDeletedOpsMessage}
                        />
                    </div>
                )}
            </OpsSectionContainer>

            <ToastContainer />
        </Layout>
    )
}

const OpsMessagesList = styled.div`
    display: grid;
    grid-gap: 3rem;
    margin-bottom: 2rem;

    @media (min-width: 800px) {
        grid-auto-rows: 350px;
        grid-template-columns: repeat(2, 370px);
    }

    @media (min-width: 1150px) {
        grid-auto-rows: 350px;
        grid-template-columns: repeat(3, 370px);
    }

    @media (min-width: 1600px) {
        grid-auto-rows: 350px;
        grid-template-columns: repeat(3, 370px);
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
        return <>Ingen driftsmeldinger å vise</>
    }

    const opsMsgList = opsMessages.sort((a, b) =>
        a.severity > b.severity ? 1 : b.severity > a.severity ? -1 : 0
    )

    return (
        <OpsMessagesList>
            {opsMsgList.map((opsMessage) => {
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
