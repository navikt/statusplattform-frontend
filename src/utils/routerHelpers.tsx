import { useRouter } from "next/router"
import { ReactElement } from "react"

import CustomNavSpinner from "../components/CustomNavSpinner"


export const useSingleValueQueryParam = (paramName: string): string | undefined => {
    const router = useRouter()
    const value = router.query[paramName]
    
    return !value ? undefined : (Array.isArray(value) ? value[0] : value)
}






export const useRenderComponentOnQuery = (paramName: string, renderOnParam: (param: string) => ReactElement): ReactElement => {
    const value = useSingleValueQueryParam(paramName)

    if(!value) {
        return <CustomNavSpinner />
    }

    return renderOnParam(value);
}