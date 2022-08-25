import { Delete } from "@navikt/ds-icons"
import { BodyShort, Button, Heading, Modal } from "@navikt/ds-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { VerticalSeparator } from "../../pages"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterOpsMeldinger } from "../../types/routes"
import { deleteOpsMessage, updateSpecificOpsMessage } from "../../utils/opsAPI"

const MessageCard = styled.div`
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-flow: column;

    .ops-card-content {
        padding: 0.5rem 0;

        display: flex;
        flex-direction: column;
    }

    .message-content {
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;

        display: -webkit-box;
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
        margin-top: auto;
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
    const router = useRouter()

    const { opsMessage, notifyChangedOpsMessage, notifyDeletedOpsMessage } =
        props

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

    return (
        <MessageCard>
            <CustomizedModal
                open={!!isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <Modal.Content>
                    <Heading spacing level="1" size="large">
                        Slette melding
                    </Heading>
                    Ønsker du å slette meldingen med tittel:{" "}
                    <b>{opsMessage.internalHeader}</b>?
                    <div className="modal-buttons">
                        <Button onClick={() => setIsModalOpen(false)}>
                            Avbryt
                        </Button>
                        <Button onClick={() => handleDeleteMessage()}>
                            Slett
                        </Button>
                    </div>
                </Modal.Content>
            </CustomizedModal>

            <CustomizedModal
                open={!!isActiveModalOpen}
                onClose={() => setIsActiveModalOpen(false)}
            >
                <Modal.Content>
                    <Heading spacing level="1" size="large">
                        Endre aktivitetsstatus
                    </Heading>

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

                    <div className="modal-buttons">
                        <Button onClick={() => setIsActiveModalOpen(false)}>
                            Nei
                        </Button>
                        <Button onClick={() => handleChangeActiveOpsMessage()}>
                            Ja
                        </Button>
                    </div>
                </Modal.Content>
            </CustomizedModal>

            <div className="buttons-container">
                <Button
                    size="small"
                    variant="tertiary"
                    className="top-row-button"
                    onClick={handleActiveModal}
                >
                    <span>Endre status</span>
                </Button>

                <VerticalSeparator />

                <Button
                    size="small"
                    variant="tertiary"
                    className="top-row-button"
                    onClick={handleModal}
                >
                    <span>Slett</span>
                    <Delete className="delete-icon" />
                </Button>
            </div>

            <div className="ops-card-content">
                <Heading spacing size="large" level="2">
                    {opsMessage.internalHeader}
                </Heading>
                <BodyShort spacing className="message-content">
                    {opsMessage.internalMessage}
                </BodyShort>
            </div>

            <div className="se-mer-wrapper">
                <Button
                    variant="tertiary"
                    onClick={() =>
                        router.push(
                            RouterOpsMeldinger.PATH + `/${opsMessage.id}`
                        )
                    }
                >
                    Se mer | Rediger
                </Button>
            </div>
        </MessageCard>
    )
}

export default OpsMessageCard
