import { useState, useEffect } from "react"
import styled from "styled-components"
import { Button, Alert, Heading, BodyShort, Loader } from "@navikt/ds-react"
import { useRouter } from "next/router"
import Head from "next/head"

interface SubscriptionInfo {
    email: string
    serviceIds: string[]
    unsubscribeToken: string
    isInternal: boolean
}

const UnsubscribePage = () => {
    const router = useRouter()
    const { token } = router.query

    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [unsubscribing, setUnsubscribing] = useState(false)
    const [unsubscribed, setUnsubscribed] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!token) return

        const fetchSubscription = async () => {
            try {
                const response = await fetch(`/api/subscriptions?token=${token}`)
                if (response.ok) {
                    const data = await response.json()
                    setSubscription(data)
                } else {
                    setError("Kunne ikke finne abonnementet. Lenken kan ha utlopt.")
                }
            } catch {
                setError("En feil oppstod. Prov igjen senere.")
            } finally {
                setLoading(false)
            }
        }

        fetchSubscription()
    }, [token])

    const handleUnsubscribe = async () => {
        if (!token) return

        setUnsubscribing(true)
        setError("")

        try {
            const response = await fetch(`/api/subscriptions/unsubscribe?token=${token}`)

            if (response.ok) {
                setUnsubscribed(true)
            } else {
                setError("Kunne ikke avslutte abonnementet. Prov igjen.")
            }
        } catch {
            setError("En feil oppstod. Prov igjen senere.")
        } finally {
            setUnsubscribing(false)
        }
    }

    return (
        <>
            <Head>
                <title>Avmeld - status.nav.no</title>
            </Head>
            <PageContainer>
                <ContentCard>
                    <Heading size="large" spacing>
                        Avmeld statusoppdateringer
                    </Heading>

                    {loading && (
                        <LoaderWrapper>
                            <Loader size="xlarge" />
                        </LoaderWrapper>
                    )}

                    {error && (
                        <Alert variant="error" style={{ marginBottom: "1rem" }}>
                            {error}
                        </Alert>
                    )}

                    {!loading && !unsubscribed && subscription && (
                        <>
                            <BodyShort spacing>
                                Du er i ferd med a avslutte abonnementet for <strong>{subscription.email}</strong>.
                            </BodyShort>
                            <BodyShort spacing>
                                Du abonnerer pa {subscription.serviceIds.length} tjeneste{subscription.serviceIds.length !== 1 ? 'r' : ''}.
                                Etter avmelding vil du ikke lenger motta varsler om driftsmeldinger eller statusendringer.
                            </BodyShort>
                            <ButtonRow>
                                <Button
                                    variant="danger"
                                    onClick={handleUnsubscribe}
                                    loading={unsubscribing}
                                >
                                    Bekreft avmelding
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push("/samarbeidspartner")}
                                >
                                    Avbryt
                                </Button>
                            </ButtonRow>
                        </>
                    )}

                    {unsubscribed && (
                        <Alert variant="success">
                            <Heading size="small">Avmelding bekreftet</Heading>
                            <BodyShort>
                                Du er na avmeldt statusoppdateringer. Du vil ikke lenger motta varsler.
                            </BodyShort>
                        </Alert>
                    )}
                </ContentCard>
            </PageContainer>
        </>
    )
}

const PageContainer = styled.div`
    background: var(--a-gray-100);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 1rem;
`

const ContentCard = styled.div`
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 6px;
    padding: 2.5rem;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 2rem;
`

const ButtonRow = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
`

export default UnsubscribePage
