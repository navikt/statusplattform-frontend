import { useRouter } from "next/router"
import { createContext, ReactNode, useEffect, useState } from "react"
import { UserData } from "types/userData"
import { checkLoginInfoAndState } from "utils/checkLoginInfoAndState"

interface UserStateInterface {
    name: string
    navIdent: string
}

export const UserStateContext = createContext<UserStateInterface>({
    name: "",
    navIdent: ""
})


export const UserStateProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserStateInterface>({
        name: "",
        navIdent: ""
    })
    const router = useRouter()

    useEffect(() => {
        async function getLoggedInUser() {
            const retrieveduser: UserData = await checkLoginInfoAndState()
            console.log("test")
            console.log(retrieveduser)
            setUser(retrieveduser)
        }
        getLoggedInUser()
    },[router])

    console.log("UserStateProvider")
    const { name, navIdent} = user
    return (
        <UserStateContext.Provider value={{
            name,
            navIdent
        }}>
            {children}
        </UserStateContext.Provider>
    )
}