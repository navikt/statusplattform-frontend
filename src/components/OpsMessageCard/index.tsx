import { TrashIcon } from "@navikt/aksel-icons"
import { BodyShort, Button, Heading, Modal } from "@navikt/ds-react"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { datePrettifyer } from "../../utils/datePrettifyer"
import styled from "styled-components"

import { OpsMessageI } from "../../types/opsMessage"
import { RouterOpsMeldinger } from "../../types/routes"
import { deleteOpsMessage, updateSpecificOpsMessage } from "../../utils/opsAPI"
import { UserStateContext } from "../ContextProviders/UserStatusContext"

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
    height: 250px;

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
        height: 9.0rem;

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

    .top-row-container {
        display: flex;
        justify-content: space-between; /* Dato til venstre, knapper til høyre */
        align-items: center; /* Sørger for vertikal justering */
        width: 100%;
    }

    .se-mer-wrapper {
        display: flex;
        flex-direction: row;
        gap: 0.5rem; /* Mer luft mellom knappene */
    }

    .se-mer-ops {
        display: flex;
        flex-direction: row;
        gap: 0.5rem; /* Mer luft mellom knappene */
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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isActiveModalOpen, setIsActiveModalOpen] = useState(false)

    const { name, navIdent } = useContext(UserStateContext)
    //const approvedUsers = process.env.NEXT_PUBLIC_OPS_ACCESS?.split(",")

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
    const router = useRouter()

    const { opsMessage, notifyChangedOpsMessage, notifyDeletedOpsMessage } =
        props
    const color: string = opsMessage.severity
    const handleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleActiveModal = () => {
        setIsActiveModalOpen(!isActiveModalOpen)
    }

    const handleDeleteMessage = () => {
        ;(async function () {
            try {
                await deleteOpsMessage(opsMessage.id)
                toast.success("Meldingen er slettet")
                notifyDeletedOpsMessage()
            } catch (error) {
                console.log(error)
                toast.error("Noe gikk galt")
            } finally {
                setIsModalOpen(false)
            }
        })()
    }

    const handleChangeActiveOpsMessage = async () => {
        const changedOps = { ...opsMessage, isActive: !opsMessage.isActive }
        try {
            await updateSpecificOpsMessage(changedOps)
            toast.success(
                `Meldingen er nå satt til ${
                    changedOps.isActive ? "aktiv" : "inaktiv"
                }`
            )
            setIsActiveModalOpen(false)
            notifyChangedOpsMessage(changedOps)
        } catch (error) {
            console.log(error)
            toast.error("Noe gikk galt i oppdateringen")
            setIsActiveModalOpen(false)
        }
    }

    const prettifiedStartTime = datePrettifyer(opsMessage.startTime)

    return (
        <MessageCard className={opsMessage.severity}>
            <CustomizedModal
                open={!!isModalOpen}
                onClose={() => setIsModalOpen(false)}
                header={{ heading: "Slette melding" }}
            >
                <Modal.Body>
                    Ønsker du å slette meldingen med tittel:{" "}
                    <b>{opsMessage.internalHeader}</b>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Avbryt
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteMessage()}>
                        Slett
                    </Button>
                </Modal.Footer>
            </CustomizedModal>

            <CustomizedModal
                open={!!isActiveModalOpen}
                onClose={() => setIsActiveModalOpen(false)}
                header={{ heading: "Endre aktivitetsstatus" }}
            >
                <Modal.Body>
                    {opsMessage.isActive ? (
                        <>
                            Ønsker du å sette meldingen:{" "}
                            <b>{opsMessage.internalHeader}</b> som inaktiv?
                        </>
                    ) : (
                        <>
                            Ønsker du å aktivere meldingen:{" "}
                            <b>{opsMessage.internalHeader}</b>?
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsActiveModalOpen(false)}>
                        Nei
                    </Button>
                    <Button onClick={() => handleChangeActiveOpsMessage()}>
                        Ja
                    </Button>
                </Modal.Footer>
            </CustomizedModal>

            <div className="ops-card-content">
            <div className="top-row-container">
            <PublishedTime>{prettifiedStartTime}</PublishedTime>
            <div
                className={
                    approvedUsers.includes(navIdent)
                        ? "se-mer-wrapper"
                        : "se-mer-ops"
                }
            >
                {approvedUsers.includes(navIdent) && (
                    <>
                        <Button
                            size="small"
                            variant="tertiary"
                            className="top-row-button"
                            onClick={handleModal}
                            icon={<TrashIcon />}
                        />
                        <Button
                            variant="tertiary"
                            size="small"
                            onClick={() =>
                                router.push(
                                    RouterOpsMeldinger.PATH +
                                        `/${opsMessage.id}/RedigerMelding`
                                )
                            }
                        >
                            Rediger
                        </Button>
                    </>
                )}
                <Button
                    variant="tertiary"
                    size="small"
                    onClick={() =>
                        router.push(
                            RouterOpsMeldinger.PATH + `/${opsMessage.id}`
                        )
                    }
                >
                    Se mer
                </Button>
            </div>
        </div>
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
        </MessageCard>
    )
}

export default OpsMessageCard
