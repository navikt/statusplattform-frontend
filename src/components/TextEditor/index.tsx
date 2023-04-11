import { Checkbox, Heading } from "@navikt/ds-react"
import { Editor } from "@tinymce/tinymce-react"
import React, { MutableRefObject, useEffect, useState } from "react"
import { datePrettifyer } from "../../utils/datePrettifyer"
import styled from "styled-components"

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
</br></br>
<b>Forventet rettetid er:</b>&nbsp;
</br>
${grayText} `
        : ` <b>Status: </b> ${opsStatus}
</br></br>
${statusMsg}
</br></br>

<b>Forventet rettetid er:</b>&nbsp;
`
}

const TextEditor = React.forwardRef(
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

        useEffect(() => {
            setMessage(initialValue)
        }, [])

        return (
            <>
                <EditorTitle>
                    <Heading size="xsmall">
                        {title ? title : "Innhold:"}
                    </Heading>
                    {editing && (
                        <Checkbox
                            checked={showHistory}
                            onChange={() => setShowHistory(!showHistory)}
                            size="small"
                        >
                            Vis historikk
                        </Checkbox>
                    )}
                </EditorTitle>
                <Editor
                    onInit={(editor) => (ref.current = editor)}
                    value={initialValue ? initialValue : ""}
                    initialValue={DefaultMessage(
                        status,
                        editing,
                        message,
                        showHistory
                    )}
                    onEditorChange={handleUpdateMsg}
                    init={{
                        height: 300,
                        menubar: "format edit help",
                        plugins: "lists advlist wordcount",
                        toolbar:
                            "undo redo | pastetext | bold italic underline strikethrough  |fontsize | forecolor backcolor | bullist numlist removeformat ",

                        content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                />
            </>
        )
    }
)

export default TextEditor
