import { ReactNode } from "react"
import { FilterProvider } from "./FilterContext"



export const Providers: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <FilterProvider>
            {children}
        </FilterProvider>
    )  
}