import 'styles/globals.css'
import { Head } from 'next/document';

import { Providers } from 'components/ContextProviders/Providers'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="title" content="Navstatus" />
                <meta name="description" content="" />


                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:site_name" content="Status Nav digitale tjenester" />
                <meta property="og:title" content="Status Nav digitale tjenester" />
                <meta property="og:description" content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere." />
                <meta property="og:image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg" />
                <meta property="og:url" content="https://portal.labs.nais.io/Dashboard/Privatperson" />
                <meta property="og:type" content="website" />


                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://portal.labs.nais.io/Dashboard/Privatperson" />
                <meta property="twitter:title" content="Navstatus" />
                <meta property="twitter:description" content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere." />
                <meta property="twitter:image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg" />
            </Head>
            <Providers>
                <Component {...pageProps} />
            </Providers>
        </>
    )
}

export default MyApp
