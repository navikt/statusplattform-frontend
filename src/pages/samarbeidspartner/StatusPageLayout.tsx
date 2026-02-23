import { useState } from "react"
import styled from "styled-components"
import Head from "next/head"
import Layout from "@/components/LayoutExternal"
import { Button } from "@navikt/ds-react"
import ServiceStatusGrid from "@/components/StatusPage/ServiceStatusGrid"
import IncidentTimeline from "@/components/StatusPage/IncidentTimeline"
import SubscriptionModal from "@/components/StatusPage/SubscriptionModal"
import { Service } from "@/types/types"
import { OpsMessageI } from "@/types/opsMessage"

interface StatusPageLayoutProps {
    services: Service[]
    incidents: OpsMessageI[]
}

const StatusPageLayout = ({ services, incidents }: StatusPageLayoutProps) => {
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)

    return (
        <Layout>
            <Head>
                <title>Status NAV digitale tjenester - Samarbeidspartnere</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="title" content="Status NAV digitale tjenester" />
                <meta
                    name="description"
                    content="Sanntidsstatus for NAVs digitale tjenester til samarbeidspartnere. Følg med på driftsmeldinger og planlagt vedlikehold."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://status.nav.no/samarbeidspartner" />
                <meta property="og:title" content="Status NAV digitale tjenester" />
                <meta
                    property="og:description"
                    content="Sanntidsstatus for NAVs digitale tjenester til samarbeidspartnere. Følg med på driftsmeldinger og planlagt vedlikehold."
                />
                <meta
                    property="og:image"
                    content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg"
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://status.nav.no/samarbeidspartner" />
                <meta property="twitter:title" content="Status NAV digitale tjenester" />
                <meta
                    property="twitter:description"
                    content="Sanntidsstatus for NAVs digitale tjenester til samarbeidspartnere. Følg med på driftsmeldinger og planlagt vedlikehold."
                />
                <meta
                    property="twitter:image"
                    content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg"
                />
            </Head>

            <PageContent>
                <ContentContainer>
                    <PageHeader>
                        <StatusOverview>
                            {services.filter(s => s.record?.status !== 'OK' && s.record?.status !== 'UP').length > 0
                                ? `${services.filter(s => s.record?.status !== 'OK' && s.record?.status !== 'UP').length} tjeneste(r) har problemer`
                                : "Alle våre systemer fungerer normalt"
                            }
                        </StatusOverview>
                        <SubscribeButton
                            variant="secondary"
                            size="small"
                            onClick={() => setIsSubscriptionModalOpen(true)}
                        >
                            Abonner
                        </SubscribeButton>
                    </PageHeader>
                    <ServiceStatusGrid services={services} />
                    <IncidentTimeline incidents={incidents} />
                </ContentContainer>
            </PageContent>

            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
                services={services}
            />
        </Layout>
    )
}

const PageContent = styled.main`
    background: #f8f9fa;
    min-height: calc(100vh - 100px);
    padding: 0;
`

const ContentContainer = styled.div`
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (max-width: 1440px) {
        max-width: 95%;
        padding: 0 2rem;
    }

    @media (max-width: 1024px) {
        max-width: 90%;
        padding: 0 1.5rem;
    }

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 0 1rem;
        gap: 1.25rem;
    }
`

const PageHeader = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
`

const StatusOverview = styled.div`
    font-size: 1.1rem;
    font-weight: 600;
    color: #262626;
`

const SubscribeButton = styled(Button)`
    border-radius: 20px;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;

    @media (max-width: 768px) {
        align-self: stretch;
        justify-content: center;
    }
`

export default StatusPageLayout