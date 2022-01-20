import { createContext, ReactNode, useState } from "react"

interface TitleContextInterface {
    title: string
    changeTitle: (title: string) => void
}


export const TitleContext = createContext<TitleContextInterface>({
    title: "",
    changeTitle: () => {}
})


export const TitleProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [title, changeTitle] = useState<string>()

    return (
        <TitleContext.Provider value={{
            title,
            changeTitle
        }}>
            {children}
        </TitleContext.Provider>
    )
}