import { Delete } from "@navikt/ds-icons"
import { BodyShort, Button, Detail, Heading, Modal } from "@navikt/ds-react"
import { useState } from "react"
import { toast } from "react-toastify"
import styled from "styled-components"
import { OpsMessageI } from "../../types/opsMessage"
import { RouterOpsMeldinger } from "../../types/routes"
import { deleteOpsMessage } from "../../utils/opsAPI"


const MessageCard = styled.div`
    background: white;
    padding: 1.7rem;
    margin: 1rem 0;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-flow: column wrap;

    position: relative;

    .delete-button {
        position: absolute;
        right: 0;
        top: 0;
    }
`

const OpsMessageCard: React.VFC<{opsMessage: OpsMessageI}> = ({opsMessage}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleModal = () => {
        setIsModalOpen(!isModalOpen)
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


            <Button size="small" variant="tertiary" className="delete-button" onClick={handleModal}>
                <Delete className="delete-icon" />
            </Button>
            <Heading spacing size="large" level="2">{opsMessage.internalHeader}</Heading>
            <BodyShort spacing>{opsMessage.internalMessage}</BodyShort>
        </MessageCard>
    )
}


export default OpsMessageCard