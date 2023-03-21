import { MutableRefObject } from "react"
import { Heading } from "@navikt/ds-react"
import React from "react"
import { Editor } from "@tinymce/tinymce-react"

interface EditorProps {
    isInternal: Boolean
    initialValue?: string
    title?: string
    status?: string
    handleUpdateInternalMsg?: (message: string) => void
    handleUpdateExternalMsg?: (message: string) => void
}

const DefaultMessage = (status: string) => {
    var opsStatus = ""
    var statusMsg = ""

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
    }

    return `
    <b>Problemer med: </b>  </br>
  <b>Status: </b> ${opsStatus}
</br></br>
${statusMsg}</br></br>

<b>Forventet rettetid er:
`
}

const TextEditor = React.forwardRef(
    (
        {
            isInternal,
            initialValue,
            title,
            status,
            handleUpdateInternalMsg,
            handleUpdateExternalMsg,
        }: EditorProps,
        ref: MutableRefObject<any>
    ) => {
        const handleEditorChange = (content: any, editor: any) => {
            isInternal
                ? handleUpdateInternalMsg(content)
                : handleUpdateExternalMsg(content)
        }
        return (
            <>
                <Heading size="xsmall">{title ? title : "Innhold:"}</Heading>
                <Editor
                    onInit={(editor) => (ref.current = editor)}
                    value={initialValue ? initialValue : ""}
                    initialValue={DefaultMessage(status)}
                    onEditorChange={handleEditorChange}
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
