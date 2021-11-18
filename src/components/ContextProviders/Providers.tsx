import { ReactNode } from "react"
import { FilterProvider } from "./FilterContext"
import { UserStateProvider } from "./UserStatusContext"



export const Providers: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <UserStateProvider>
            <FilterProvider>
                {children}
            </FilterProvider>
        </UserStateProvider>
    )  
}