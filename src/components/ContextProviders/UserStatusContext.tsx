import { useRouter } from "next/router"
import { createContext, ReactNode, useEffect, useState } from "react"
import { UserData } from "../../types/userData"
import { checkLoginInfoAndState } from "../../utils/checkLoginInfoAndState"
import CustomNavSpinner from "../CustomNavSpinner"

export interface UserStateInterface {
    name: string
    navIdent: string
    adminAccess:boolean
}

export const UserStateContext = createContext<UserStateInterface>({
    navIdent: "",
    name: "",
    adminAccess:false
})


export const UserStateProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserStateInterface | null>({
        name: "",
        navIdent: ""
    })
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        async function getLoggedInUser() {
            setIsLoading(true)
            const retrieveduser: UserData = await checkLoginInfoAndState()
            if(retrieveduser) {
                setUser(retrieveduser)
            }
            setIsLoading(false)
        }
        getLoggedInUser()
    },[router])

    if(isLoading) {
        return <CustomNavSpinner />
    }

    const { name, navIdent } = user

    return (
        <UserStateContext.Provider value={{
            name,
            navIdent
        }}>
            {children}
        </UserStateContext.Provider>
    )

}