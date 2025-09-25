import { Checkbox, Heading } from "@navikt/ds-react"
import React, { MutableRefObject, useEffect, useState, useRef } from "react"
import { datePrettifyer } from "@/utils/datePrettifyer"
import styled from "styled-components"
import dynamic from "next/dynamic"

const SunEditorComponent = dynamic(() => import("./SunEditor"), {
    ssr: false,
})

const EditorTitle = styled.div`
    display: flex;
    flex-direction: column;
`
interface EditorProps {
    isInternal: Boolean
    initialValue?: string
    title?: string
    status?: string
    editing?: boolean
    handleUpdateMsg?: (message: string) => void
}

const DefaultMessage = (
    status: string,
    editing: boolean,
    initialvalue: string,
    showHistory: boolean
) => {
    var opsStatus = ""
    var statusMsg = ""
    var currentDate = new Date()
    var formattedDate = datePrettifyer(currentDate)

    var grayText =
        "<p style='color:#757575'>------------------------------------------------- </p>" +
        initialvalue.replace("<p>", '<p style="color:#757575"')

    switch (status) {
        case "EXAMINING":
            opsStatus = "Undersøkes"
            statusMsg = "Det jobbes med å undersøke og identifisere feilen."
            break
        case "MAITENANCE":
            opsStatus = "Vedlikehold"
            statusMsg = "Det er for tiden vedlikehold på:"
            break
        case "SOLVING":
            opsStatus = "Feilretting pågår"
            statusMsg = "Det jobbes med feilretting."
            break
        case "SOLVED":
            opsStatus = "Løst"
            statusMsg = "Feilen er nå rettet."
            break

        default:
            opsStatus = "Undersøkes"
            statusMsg = "Det jobbes med å undersøke og identifisere feilen."
            break
    }

    return editing && showHistory
        ? `<b>Status: </b> ${opsStatus}
        </br></br>
        <b>Oppdatert: </b> ${formattedDate}
</br></br>
${statusMsg}
</br>
${
    status != "SOLVED" && status != "MAITENANCE"
        ? "</br><b>Forventet rettetid er:</b>&nbsp;</br> "
        : ""
}
${status == "MAITENANCE" && "</br><b>Forventet ferdig:</b>&nbsp;</br> "}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
${grayText} `
        : ` <b>Status: </b> ${opsStatus}
</br></br>
${statusMsg}
</br></br>

${
    status != "MAITENANCE"
        ? "<b>Forventet rettetid er:</b>&nbsp;</br> "
        : "<b>Forventet ferdig:</b>&nbsp;</br> "
}
`
}

const TextEditor = React.forwardRef<any, EditorProps>(
    (
        {
            isInternal,
            initialValue,
            title,
            status,
            editing,
            handleUpdateMsg,
        }: EditorProps,
        ref: MutableRefObject<any>
    ) => {
        const [message, setMessage] = useState("")
        const [showHistory, setShowHistory] = useState(true)
        const editingRef = useRef(editing)

        useEffect(() => {
            setMessage(initialValue)
            editingRef.current = true
        }, [initialValue])

        return (
            <>
                <EditorTitle>
                    <Heading size="xsmall">
                        {title ? title : "Innhold:"}
                    </Heading>
                    {editingRef.current && (
                        <Checkbox
                            checked={showHistory}
                            onChange={() => setShowHistory(!showHistory)}
                            size="small"
                        >
                            Vis historikk
                        </Checkbox>
                    )}
                </EditorTitle>
                <SunEditorComponent
                    value={message}
                    onChange={handleUpdateMsg}
                    initialValue={DefaultMessage(
                        status,
                        editing,
                        message,
                        showHistory
                    )}
                />
            </>
        )
    }
)

TextEditor.displayName = 'TextEditor'

export default TextEditor
