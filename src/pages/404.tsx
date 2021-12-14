import styled from 'styled-components'
import Head from 'next/head'

import Layout from '../components/Layout'
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

const ErrorWrapper = styled.div`
    margin: 2rem 0;
    background-color: var(--navBakgrunn);
    border-radius: .25rem;
    padding: 1.5rem;
    max-width: 50rem;
    display: flex;
    flex-flow: column wrap;
    h1 {
        border-right: 1px solid rgba(0,0,0,.3);
        margin-right: 1.5rem;
        padding-right: 1.5rem;
        vertical-align: top;
    }
`;

const ErrorHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

export default function Custom404() {
    return (
        <Layout>
            <Head>
                <title>Fant ikke siden</title>
            </Head>
            <ErrorWrapper>
                <ErrorHeader>
                    <Innholdstittel>Fant ikke siden</Innholdstittel><Ingress>Statuskode 404</Ingress>
                </ErrorHeader>
                    <div className="error404__content">
                        <p>
                            Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
                        </p>
                        <p>Bruk gjerne søket, menyen eller <Lenke href="/">
                            gå til forsiden
                            </Lenke>.
                        </p>
                        <Lenke href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                            Meld gjerne fra om denne lenken
                        </Lenke>
                    </div>
            </ErrorWrapper>
        </Layout>
    )
}