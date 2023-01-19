import { forwardRef, MutableRefObject, Props, useRef } from "react"
import { Heading } from "@navikt/ds-react"
import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import tinymce from "tinymce/tinymce"

interface EditorProps {
    isInternal: Boolean
    handleUpdateInternalMsg?: (message: string) => void
    handleUpdateExternalMsg?: (message: string) => void
}

const TextEditor = React.forwardRef(
    (
        {
            isInternal,
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
                <Heading level="5" size="xsmall">
                    Innhold:
                </Heading>
                <Editor
                    onInit={(editor) => (ref.current = editor)}
                    initialValue=""
                    onEditorChange={handleEditorChange}
                    init={{
                        height: 300,
                        menubar: "format edit help",
                        plugins: "lists advlist wordcount",
                        toolbar:
                            "undo redo | bold italic underline strikethrough  |fontsize | forecolor backcolor | bullist numlist removeformat ",

                        content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                />
            </>
        )
    }
)

export default TextEditor
