import '../styles/globals.css'
import "@navikt/ds-css";
import "@navikt/ds-css-internal";

import { Providers } from '../components/ContextProviders/Providers'
import { useEffect } from 'react'
import { Modal } from '@navikt/ds-react';


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
        Modal.setAppElement(document.getElementsByClassName('ReactModalPortal'));
    })
    
    return (
        <Providers>
            <Component {...pageProps} />
        </Providers>
    )
}

export default MyApp
