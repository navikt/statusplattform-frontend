import styled from 'styled-components'
import Head from 'next/head'
import Link from 'next/link'

import { BodyShort, Heading, Ingress } from '@navikt/ds-react';

import Layout from '../components/Layout'

const ErrorWrapper = styled.div`
    margin: 2rem 0;
    background-color: var(--navds-semantic-color-canvas-background-light);
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
    padding-bottom: 1rem;

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
                    <Heading size="xlarge">Fant ikke siden</Heading><Ingress>Statuskode 404</Ingress>
                </ErrorHeader>

                    <div>
                        <BodyShort spacing>
                            Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
                        </BodyShort>
                        <BodyShort spacing>Bruk gjerne søket, menyen eller <Link href="/">
                            gå til forsiden
                            </Link>.
                        </BodyShort>
                        <Link href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
                            Meld gjerne fra om denne lenken
                        </Link>
                    </div>
            </ErrorWrapper>
        </Layout>
    )
}