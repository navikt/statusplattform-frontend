import "../styles/globals.css"
import "@navikt/ds-css"

import { Providers } from "@/components/ContextProviders/Providers"
import { useEffect, useState } from "react"
import { Modal } from "@navikt/ds-react"
import CustomNavSpinner from "@/components/CustomNavSpinner"

function MyApp({ Component, pageProps }) {
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)

        setTimeout(() => {
            const path = window.location.hash
            if (path && path.includes("#")) {
                const id = path.replace("#", "")
                const el = window.document.getElementById(id)
                if (el) {
                    el.tabIndex = 0
                    el.focus()
                    el.removeAttribute("tabIndex")
                }
            }
        }, 200)
        // Modal.setAppElement is no longer needed in newer versions
        setIsLoading(false)
    })

    return (
        <Providers>
            {!isLoading ? <Component {...pageProps} /> : <CustomNavSpinner />}
        </Providers>
    )
}

export default MyApp
