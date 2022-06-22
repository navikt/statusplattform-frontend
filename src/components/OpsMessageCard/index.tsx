import { Delete, Error, Success } from "@navikt/ds-icons"
import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { HorizontalSeparator } from "../../pages/Admin"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterOpsMeldinger } from "../../types/routes"
import { deleteOpsMessage, updateSpecificOpsMessage } from "../../utils/opsAPI"


const MessageCard = styled.div`
    background: white;
    padding: .5rem 1.7rem 1.7rem 1.7rem;
    margin: 1rem 0;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-flow: column wrap;

    position: relative;

    .buttons-container {
        display: flex;
        justify-content: space-between;

        button {
            padding: .5rem .2rem;
        }
    }

    button:hover {
        cursor: pointer;
        outline: 1px solid black;
    }
`

const OpsMessageCard: React.VFC<{opsMessage: OpsMessageI, notifyChangedOpsMessage: (changedOps) => void}> = ({opsMessage, notifyChangedOpsMessage}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isActiveModalOpen, setIsActiveModalOpen] = useState(false)
    const router = useRouter()

    const handleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleActiveModal = () => {
        setIsActiveModalOpen(!isActiveModalOpen)
    }

    const handleDeleteMessage = () => {
        (async function () {
            try {
                await deleteOpsMessage(opsMessage.id)
                toast.success("Meldingen er slettet")
            } catch (error) {
                toast.error("Noe gikk galt")
            } finally {
                setIsModalOpen(false)
            }
        })()
    }

    const handleChangeActiveOpsMessage = async () => {
        const changedOps = {...opsMessage, isActive: !opsMessage.isActive}
        
        try {
            const response = await updateSpecificOpsMessage(changedOps)
            toast.success(`Meldingen er nå satt til ${changedOps.isActive ? "aktiv" : "inaktiv"}`)
            setIsActiveModalOpen(false)
            notifyChangedOpsMessage(changedOps)

        } catch (error) {
            toast.error("Noe gikk galt i oppdateringen")
            setIsActiveModalOpen(false)
        }
    }


    return (
        <MessageCard>


            <Modal 
                open={!!isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <Modal.Content>

                    <Heading spacing level="1" size="large">
                        Slette melding
                    </Heading>

                    Ønsker du å slette meldingen med tittel: <b>{opsMessage.internalHeader}</b>?

                    <div>
                        <Button onClick={() => setIsModalOpen(false)}>Avbryt</Button>
                        <Button onClick={() => handleDeleteMessage()}>Slett</Button>
                    </div>

                </Modal.Content>
            </Modal>



            <Modal 
                open={!!isActiveModalOpen}
                onClose={() => setIsActiveModalOpen(false)}
            >
                <Modal.Content>

                    <Heading spacing level="1" size="large">
                        Endre aktivitetsstatus
                    </Heading>

                    {opsMessage.isActive ?
                            <>
                                Ønsker du å sette meldingen: <b>{opsMessage.internalHeader}</b> som inaktiv?
                            </>
                        :
                            <>
                                Ønsker du å aktivere meldingen: <b>{opsMessage.internalHeader}</b>?
                            </>
                    }

                    <div>
                        <Button onClick={() => setIsActiveModalOpen(false)}>Nei</Button>
                        <Button onClick={() => handleChangeActiveOpsMessage()}>Ja</Button>
                    </div>

                </Modal.Content>
            </Modal>

            <div className="buttons-container">
                <Button size="small" variant="tertiary" className="delete-button" onClick={handleActiveModal}>
                    Status: {opsMessage.isActive ? "Aktiv" : "Inaktiv"}
                </Button>

                <Button size="small" variant="tertiary" className="delete-button" onClick={handleModal}>
                    <Delete className="delete-icon" />
                </Button>
            </div>

            <HorizontalSeparator />


            <Heading spacing size="large" level="2">{opsMessage.internalHeader}</Heading>
            <BodyShort spacing>{opsMessage.internalMessage}</BodyShort>

            <Button variant="tertiary" onClick={() => router.push(RouterOpsMeldinger.PATH + `/${opsMessage.id}`)}>Se mer...</Button>
        </MessageCard>
    )
}


export default OpsMessageCard