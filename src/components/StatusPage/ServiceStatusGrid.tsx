import styled from "styled-components"
import { Service } from "../../types/types"

interface ServiceStatusGridProps {
    services: Service[]
}

const ServiceStatusGrid = ({ services }: ServiceStatusGridProps) => {
    return (
        <GridContainer>
            <SectionTitle>System Status</SectionTitle>
            <ServiceGrid>
                {services.map((service) => (
                    <ServiceRow key={service.id}>
                        <ServiceName>{service.name}</ServiceName>
                        <StatusIndicator status={getServiceStatus(service)}>
                            {getStatusText(getServiceStatus(service))}
                        </StatusIndicator>
                    </ServiceRow>
                ))}
            </ServiceGrid>
        </GridContainer>
    )
}

const getServiceStatus = (service: Service): 'operational' | 'degraded' | 'outage' | 'maintenance' => {
    if (!service.record) return 'operational'

    switch (service.record.status) {
        case 'OK':
        case 'UP':
            return 'operational'
        case 'ISSUE':
        case 'DEGRADED':
            return 'degraded'
        case 'DOWN':
        case 'OUTAGE':
            return 'outage'
        case 'MAINTENANCE':
            return 'maintenance'
        default:
            return 'operational'
    }
}

const getStatusText = (status: string): string => {
    switch (status) {
        case 'operational':
            return 'Operativ'
        case 'degraded':
            return 'Problemer'
        case 'outage':
            return 'Nedetid'
        case 'maintenance':
            return 'Vedlikehold'
        default:
            return 'Operativ'
    }
}

const GridContainer = styled.div`
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

const ServiceGrid = styled.div`
    padding: 0;
`

const ServiceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f8f9fa;
    }
`

const ServiceName = styled.div`
    font-size: 1rem;
    color: #262626;
    font-weight: 500;
`

const StatusIndicator = styled.div<{ status: string }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: ${props => {
        switch (props.status) {
            case 'operational':
                return '#22c55e'
            case 'degraded':
                return '#f59e0b'
            case 'outage':
                return '#ef4444'
            case 'maintenance':
                return '#3b82f6'
            default:
                return '#22c55e'
        }
    }};

    &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${props => {
            switch (props.status) {
                case 'operational':
                    return '#22c55e'
                case 'degraded':
                    return '#f59e0b'
                case 'outage':
                    return '#ef4444'
                case 'maintenance':
                    return '#3b82f6'
                default:
                    return '#22c55e'
            }
        }};
    }
`

export default ServiceStatusGrid