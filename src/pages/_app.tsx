import '../styles/globals.css'
import "@navikt/ds-css";
import "@navikt/ds-css-internal";

import { Providers } from '../components/ContextProviders/Providers'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        setTimeout(() => {
            const path = window.location.hash 
            if (path && path.includes('#')) {
                const id = path.replace('#', '')
                const el = window.document.getElementById(id)
                if (el) {
                    el.tabIndex = 0
                    el.focus()
                    el.removeAttribute("tabIndex")
                }
            }
        }, 200)
    })

    return (
        <Providers>
            <Component {...pageProps} />
        </Providers>
    )
}

export default MyApp
