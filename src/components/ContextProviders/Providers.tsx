import { ReactNode } from "react"
import { FilterProvider } from "./FilterContext"
import { NavigatorProvider } from "./NavigatorContext"
import { TitleProvider } from "./TitleContext"
import { UserStateProvider } from "./UserStatusContext"



export const Providers: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <UserStateProvider>
            <NavigatorProvider>
                <FilterProvider>
                    <TitleProvider>
                        {children}
                    </TitleProvider>
                </FilterProvider>
            </NavigatorProvider>
        </UserStateProvider>
    )  
}