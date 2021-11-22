import { useRouter } from "next/router"
import { createContext, ReactNode, useEffect, useState } from "react"
import { UserData } from "types/userData"
import { checkLoginInfoAndState } from "utils/checkLoginInfoAndState"

interface UserStateInterface {
    name: string
    navIdent: string
}

export const UserStateContext = createContext<UserStateInterface>({
    navIdent: "",
    name: ""
})


export const UserStateProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<UserStateInterface | null>({
        navIdent: "",
        name: ""
    })
    const [isLoggedIn, changeIsLoggedIn] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function getLoggedInUser() {
            const retrieveduser: UserData = await checkLoginInfoAndState()

            if(retrieveduser) {
                setUser(retrieveduser)
                changeIsLoggedIn(true)
            }
        }
        getLoggedInUser()
    },[router])

    const { name, navIdent} = user
    return (
        <UserStateContext.Provider value={{
            name,
            navIdent
        }}>
            {children}
        </UserStateContext.Provider>
    )
    // }
    // return (
    //     <>
    //     </>
    // )
}