import { ReactNode } from "react"
import { FilterProvider } from "./FilterContext"
import { TitleProvider } from "./TitleContext"
import { UserStateProvider } from "./UserStatusContext"



export const Providers: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <UserStateProvider>
            <TitleProvider>
                <FilterProvider>
                    {children}
                </FilterProvider>
            </TitleProvider>
        </UserStateProvider>
    )  
}