import 'styles/globals.css'

import { Providers } from 'components/ContextProviders/Providers'

function MyApp({ Component, pageProps }) {
    return (
        <Providers>
            <Component {...pageProps} />
        </Providers>
    )
}

export default MyApp
