import { Back } from "@navikt/ds-icons"
import { Button, Heading } from "@navikt/ds-react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import styled from "styled-components"
import { backendPath } from "../../.."
import Layout from "../../../../components/Layout"
import OpsMessageCard from "./OpsMessageCard"
import { OpsMessageI } from "../../../../types/opsMessage"
import { EndPathOps } from "../../../../utils/apiHelper"
import { HorizontalSeparator } from "../../../Admin"

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

    const notifyChangedOpsMessage = (changedOps) => {
       return
    }

    const notifyDeletedOpsMessage = () => {
        return
    }

    const arrayActive: OpsMessageI[] = serverOpsMessages.filter(
        (message) => message.isActive
    )
    const arrayInActive: OpsMessageI[] = serverOpsMessages.filter(
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
                        </OpsHeadNoMsgs>
                    </>
                )}

                <div>
                    <OpsHead>
                        <Heading level="2" size="xlarge" className="heading">
                            Driftsmeldinger
                        </Heading>
                    </OpsHead>
                    <HorizontalSeparator />

                    <ListOfOpsMessages
                        opsMessages={serverOpsMessages}
                        notifyChangedOpsMessage={notifyChangedOpsMessage}
                        notifyDeletedOpsMessage={notifyDeletedOpsMessage}
                    />
                </div>
            </OpsSectionContainer>
        </Layout>
    )
}

const OpsMessagesList = styled.div`
    display: grid;
    grid-gap: 3rem;
    /* display: flex;
    flex-direction: column;
 
    gap: 2rem; */
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

    const opsMsgLists = opsMessages.sort((a, b) =>
        a.severity > b.severity ? 1 : b.severity > a.severity ? -1 : 0
    )

    var opsMsgList = opsMessages
        .sort((a, b) => {
            return (
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            )
        })
        .reverse()

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
