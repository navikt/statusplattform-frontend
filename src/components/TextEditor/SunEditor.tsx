// components/SunEditorComponent.tsx
import React, { useEffect } from "react"
import SunEditor from "suneditor-react"
import "suneditor/dist/css/suneditor.min.css" // Import SunEditor styles

interface SunEditorComponentProps {
    value: string
    onChange: (content: string) => void
    initialValue?: string
}

const SunEditorComponent: React.FC<SunEditorComponentProps> = ({
    value,
    onChange,
    initialValue,
}) => {
    return (
        <SunEditor
            onChange={onChange}
            setContents={initialValue ?? value}
            setOptions={{
                height: "300",
                buttonList: [
                    ["undo", "redo", "bold", "italic", "underline", "strike"],
                    [
                        "fontColor",
                        "hiliteColor",
                        "align",
                        "list",
                        "link",
                        "image",
                    ],
                ],
            }}
        />
    )
}

export default SunEditorComponent
