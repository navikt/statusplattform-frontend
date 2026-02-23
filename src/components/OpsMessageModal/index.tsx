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
    isOpen: boolean
    onClose: () => void
    services?: any[]
    editingOpsMessage: OpsMessageI | null
}

const OpsMessageModal = (props: OpsMessageModalI) => {
    const { isOpen, onClose, editingOpsMessage } = props

    if (!editingOpsMessage || !isOpen) return null

    return (
        <>
            <CustomOpsModal
                open={isOpen}
                onClose={onClose}
                header={{ heading: "Driftsmelding" }}
                className={editingOpsMessage.severity.toLowerCase()}
            >
                <Modal.Body>
                    <OpsMessageDetails
                        opsMessage={editingOpsMessage}
                        navIdent={undefined}
                    />
                </Modal.Body>
            </CustomOpsModal>
        </>
    )
}

export default OpsMessageModal
