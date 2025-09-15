import styled from "styled-components"
import { formatDistanceToNow, parseISO } from "date-fns"
import { nb } from "date-fns/locale"
import { OpsMessageI } from "../../types/opsMessage"
import { Service } from "../../types/types"

interface IncidentTimelineProps {
    incidents: OpsMessageI[]
}

const IncidentTimeline = ({ incidents }: IncidentTimelineProps) => {
    if (incidents.length === 0) {
        return (
            <TimelineContainer>
                <SectionTitle>Siste hendelser</SectionTitle>
                <NoIncidents>
                    Ingen aktive hendelser eller planlagt vedlikehold.
                </NoIncidents>
            </TimelineContainer>
        )
    }

    const groupedIncidents = groupIncidentsByDate(incidents)

    return (
        <TimelineContainer>
            <SectionTitle>Siste hendelser</SectionTitle>
            {Object.entries(groupedIncidents).map(([date, dayIncidents]) => (
                <DateGroup key={date}>
                    <DateHeader>{date}</DateHeader>
                    {dayIncidents.map((incident) => (
                        <IncidentCard key={incident.id}>
                            <IncidentHeader>
                                <IncidentTitle>{incident.internalHeader}</IncidentTitle>
                                <StatusBadge severity={incident.severity} isActive={incident.isActive}>
                                    {getIncidentStatusText(incident)}
                                </StatusBadge>
                            </IncidentHeader>

                            <IncidentDescription
                                dangerouslySetInnerHTML={{
                                    __html: cleanIncidentMessage(incident.internalMessage)
                                }}
                            />

                            {incident.affectedServices && incident.affectedServices.length > 0 && (
                                <AffectedServices>
                                    <ServicesLabel>Berørte tjenester:</ServicesLabel>
                                    <ServicesList>
                                        {incident.affectedServices.map((service: Service) => (
                                            <ServiceTag key={service.name}>{service.name}</ServiceTag>
                                        ))}
                                    </ServicesList>
                                </AffectedServices>
                            )}

                            <IncidentMeta>
                                {formatDistanceToNow(incident.startTime, {
                                    addSuffix: true,
                                    locale: nb
                                })} • {incident.startTime.toLocaleDateString("nb-NO", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </IncidentMeta>
                        </IncidentCard>
                    ))}
                </DateGroup>
            ))}
        </TimelineContainer>
    )
}

const groupIncidentsByDate = (incidents: OpsMessageI[]) => {
    return incidents
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
        .reduce((acc: Record<string, OpsMessageI[]>, incident) => {
            const date = incident.startTime.toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
            })
            if (!acc[date]) {
                acc[date] = []
            }
            acc[date].push(incident)
            return acc
        }, {})
}

const getIncidentStatusText = (incident: OpsMessageI): string => {
    if (!incident.isActive) return 'Løst'

    switch (incident.severity) {
        case 'DOWN':
            return 'Pågående nedetid'
        case 'ISSUE':
            return 'Undersøker'
        case 'NEUTRAL':
            return 'Planlagt vedlikehold'
        default:
            return 'Pågående'
    }
}

const cleanIncidentMessage = (message: string): string => {
    if (!message) return ''

    // Extract first update only (before separator)
    const sections = message.split("<p>------------------------------------------------- </p>")
    const firstSection = sections[0]

    // Clean up the message
    return firstSection
        .replace(/(&nbsp;|\s)+<br>/g, "")
        .replace(/<strong>Forventet rettetid er:<\/strong>\s*false(\s*|<br>)/g, "")
        .replace(/<strong>Forventet rettetid er:<\/strong>\s*(<br>)?/g, "")
        .replace(/<p>\s*false\s*<\/p>/g, "")
        .replace(/Feilen er nå rettet.<br>\s*false/g, "Feilen er nå rettet.")
        .replace(/<p><strong>Status: <\/strong> Løst\s*<\/p>/g, "")
}

const TimelineContainer = styled.div`
    background: white;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    overflow: hidden;
`

const SectionTitle = styled.h2`
    background: #f8f9fa;
    margin: 0;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #262626;
    border-bottom: 1px solid #e6e6e6;
`

const NoIncidents = styled.div`
    padding: 2rem 1.5rem;
    text-align: center;
    color: #666;
    font-size: 1rem;
`

const DateGroup = styled.div`
    &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
    }
`

const DateHeader = styled.h3`
    background: #fafafa;
    margin: 0;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: #666;
    border-bottom: 1px solid #f0f0f0;
`

const IncidentCard = styled.div`
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f8f9fa;

    &:last-child {
        border-bottom: none;
    }
`

const IncidentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    gap: 1rem;
`

const IncidentTitle = styled.h4`
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #262626;
    flex: 1;
    line-height: 1.4;
`

const StatusBadge = styled.span<{ severity: string; isActive: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    background-color: ${props => {
        if (!props.isActive) return '#f0f9ff'
        switch (props.severity) {
            case 'DOWN': return '#fef2f2'
            case 'ISSUE': return '#fefce8'
            case 'NEUTRAL': return '#eff6ff'
            default: return '#f0f9ff'
        }
    }};

    color: ${props => {
        if (!props.isActive) return '#0369a1'
        switch (props.severity) {
            case 'DOWN': return '#dc2626'
            case 'ISSUE': return '#ca8a04'
            case 'NEUTRAL': return '#2563eb'
            default: return '#0369a1'
        }
    }};

    border: 1px solid ${props => {
        if (!props.isActive) return '#bae6fd'
        switch (props.severity) {
            case 'DOWN': return '#fecaca'
            case 'ISSUE': return '#fef3c7'
            case 'NEUTRAL': return '#dbeafe'
            default: return '#bae6fd'
        }
    }};

    &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: ${props => {
            if (!props.isActive) return '#0369a1'
            switch (props.severity) {
                case 'DOWN': return '#dc2626'
                case 'ISSUE': return '#ca8a04'
                case 'NEUTRAL': return '#2563eb'
                default: return '#0369a1'
            }
        }};
    }
`

const IncidentDescription = styled.div`
    margin-bottom: 0.75rem;
    color: #555;
    line-height: 1.5;
    font-size: 0.95rem;

    p {
        margin: 0 0 0.5rem 0;

        &:last-child {
            margin-bottom: 0;
        }
    }

    strong {
        color: #262626;
        font-weight: 600;
    }
`

const AffectedServices = styled.div`
    margin-bottom: 1rem;
`

const ServicesLabel = styled.div`
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
    margin-bottom: 0.5rem;
`

const ServicesList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`

const ServiceTag = styled.span`
    background: #f3f4f6;
    color: #374151;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
`

const IncidentMeta = styled.div`
    font-size: 0.85rem;
    color: #888;
    margin-top: 0.75rem;
`

export default IncidentTimeline