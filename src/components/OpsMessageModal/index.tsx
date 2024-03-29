import { Modal } from "@navikt/ds-react"
import { SetStateAction, useEffect } from "react"
import styled from "styled-components"
import { OpsMessageI } from "../../types/opsMessage"
import OpsMessageDetails from "../OpsMessageDetails"

const CustomOpsModal = styled(Modal)`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 40.8rem;
    flex-direction: column;
    background-color: white;
    padding: 1rem;
    border: none;
    border-left: 8px solid transparent;
    border-radius: 0.5rem;
    box-shadow: none !important;

    &.neutral {
        border-color: var(--a-blue-500);
    }

    &.down {
        border-color: var(--a-border-danger);
    }

    &.issue {
        border-color: var(--a-border-warning);
    }

    &.none {
        border-color: var(--a-gray-300);
    }

    .input-area {
        & > * {
            margin: 1rem 0;
        }
    }
`

interface OpsMessageModalI {
    opsMessage: OpsMessageI
    navIdent: string
    modalOpen: boolean
    setModalOpen: React.Dispatch<SetStateAction<boolean>>
}

const OpsMessageModal = (props: OpsMessageModalI) => {
    const { opsMessage, navIdent, modalOpen, setModalOpen } = props

    useEffect(() => {
        Modal.setAppElement("#__next")
    }, [])

    return (
        <>
            <CustomOpsModal
                open={modalOpen}
                aria-label="Modal demo"
                onClose={() => setModalOpen(!modalOpen)}
                aria-labelledby="modal-heading"
                className={opsMessage.severity.toLowerCase()}
            >
                <CustomOpsModal.Content>
                    <OpsMessageDetails
                        opsMessage={opsMessage}
                        navIdent={navIdent}
                    />
                </CustomOpsModal.Content>
            </CustomOpsModal>
        </>
    )
}

export default OpsMessageModal
