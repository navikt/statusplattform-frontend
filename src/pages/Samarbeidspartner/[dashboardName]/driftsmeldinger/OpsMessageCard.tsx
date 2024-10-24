import { BodyShort, Button, Heading, Modal } from "@navikt/ds-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"
import { datePrettifyer } from "../../../../utils/datePrettifyer"
import styled from "styled-components"

import { OpsMessageI } from "../../../../types/opsMessage"
import { RouterOpsMeldinger } from "../../../../types/routes"

const PublishedTime = styled.div`
    color: var(--a-gray-500);
    margin: -0.4rem 0 0.4rem;
`

const MessageCard = styled.div`
    background: white;
    /* width: 60rem; */
    padding: 1rem 1rem;
    border-radius: 4px;
    border-left: 0.4rem solid var(--a-gray-300);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;

    &.NEUTRAL {
        border-color: var(--a-blue-200);
    }
    &.ISSUE {
        border-color: var(--a-orange-200);
    }
    &.DOWN {
        border-color: var(--a-red-200);
    }

    .ops-card-content {
        padding: 0.5rem 0 0.5rem;
        /* padding: 0.5rem 10rem 0 1rem; */

        display: flex;
        flex-direction: column;
    }

    .message-content {
        margin: -0.3rem 0px 0 -0.5rem;
        padding: 0.5rem;
        /* margin: -0.3rem 0 0 -0.5rem;
        padding: 0.5rem 0rem 0 1rem; */
        height: 11.8rem;

        -webkit-box-orient: vertical;
        overflow-y: scroll;

        display: -webkit-box;
        ::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 7px;
        }

        ::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.2);
        }
    }

    .buttons-container {
        display: flex;
        align-self: flex-end;

        .top-row-button {
            padding: 0 0.2rem;

            text-decoration: underline;

            span {
                font-size: 18px;
            }

            svg {
                height: 1rem;
            }

            :hover {
                text-decoration: none;
            }
        }
    }

    button:hover {
        cursor: pointer;
        outline: 1px solid black;
    }

    .se-mer-wrapper {
        display: flex;
        flex-direction: row;
        gap: 0.2rem;

        margin: 18.4rem 0 0 9.5rem;

        position: absolute;
    }

    .se-mer-ops {
        display: flex;
        flex-direction: row;
        gap: 0.2rem;

        margin: 18.4rem 0 0 16.5rem;

        position: absolute;
    }
`

const CustomizedModal = styled(Modal)`
    .modal-buttons {
        display: flex;
        gap: 1rem;

        button {
            margin: 1rem 0;
            padding: 0.5rem 2rem;
        }
    }
`

interface OpsMessageCardI {
    opsMessage: OpsMessageI
    notifyChangedOpsMessage: (changedOps) => void
    notifyDeletedOpsMessage: () => void
}

const OpsMessageCard = (props: OpsMessageCardI) => {

    //const approvedUsers = process.env.NEXT_PUBLIC_OPS_ACCESS?.split(",")

    const router = useRouter()

    const { opsMessage } =
        props
   
    const prettifiedStartTime = datePrettifyer(opsMessage.startTime)

    return (
        <MessageCard className={opsMessage.severity}>

            <div className="ops-card-content">
                <PublishedTime>{prettifiedStartTime}</PublishedTime>
                <Heading spacing size="medium">
                    {opsMessage.internalHeader}
                </Heading>

                <BodyShort spacing className="message-content">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: opsMessage.internalMessage,
                        }}
                    />
                </BodyShort>
            </div>

            <div
           
            >
                <Button
                    variant="tertiary"
                    size="small"
                    onClick={() =>
                        router.push(`${router.asPath}/${opsMessage.id}`)
                    }
                >
                    Se mer
                </Button>
            </div>
        </MessageCard>
    )
}

export default OpsMessageCard
