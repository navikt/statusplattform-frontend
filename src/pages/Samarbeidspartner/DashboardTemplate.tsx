import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Alert, Button } from "@navikt/ds-react";
import { UserData } from "../../types/userData";
import { Service } from "../../types/types";
import StatusList from "./statusList";
import RecentMessages from "./RecentMessages";

interface DashboardTemplateProps {
  services: Service[];
  user?: UserData;
}

const DashboardTemplate = ({ services, user }: DashboardTemplateProps) => {
  const services_ids_list = services.map((service: Service) => service.id);
  const issuesCount = services.filter(s => s.record?.status !== 'OK' && s.record?.status !== 'UP').length;

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Header with status overview and subscribe button */}
        <PageHeader>
          <StatusOverview>
            {issuesCount > 0
              ? `${issuesCount} tjeneste${issuesCount > 1 ? 'r' : ''} har problemer`
              : "Alle våre systemer fungerer normalt"
            }
          </StatusOverview>
          <SubscribeButton variant="secondary" size="small">
            Abonner
          </SubscribeButton>
        </PageHeader>

        {/* Status Legend */}
        <StatusLegend>
          <LegendItem>
            <LegendIcon color="#36b37e" />
            Normal drift
          </LegendItem>
          <LegendItem>
            <LegendIcon color="#ff8b00" />
            Redusert funksjonalitet
          </LegendItem>
          <LegendItem>
            <LegendIcon color="#de350b" />
            Delvis utilgjengelig
          </LegendItem>
          <LegendItem>
            <LegendIcon color="#de350b" />
            Utilgjengelig
          </LegendItem>
          <LegendItem>
            <LegendIcon color="#0052cc" />
            Vedlikehold
          </LegendItem>
        </StatusLegend>

        {/* Service Status Grid */}
        <ServiceGrid>
          {services.map((service) => (
            <ServiceCard key={service.id}>
              <ServiceLeft>
                <ServiceIcon>
                  <span>📄</span>
                </ServiceIcon>
                <ServiceName>{service.name}</ServiceName>
              </ServiceLeft>
              <ServiceStatus status={getServiceStatus(service)}>
                {getStatusText(getServiceStatus(service))}
              </ServiceStatus>
            </ServiceCard>
          ))}
          {/* Placeholder cards to fill grid to 10 places */}
          {Array.from({ length: Math.max(0, 10 - services.length) }, (_, index) => (
            <PlaceholderCard key={`placeholder-${index}`}>
              <ServiceLeft>
                <ServiceIcon>
                  <span>📄</span>
                </ServiceIcon>
                <ServiceName>Placeholder Service {index + services.length + 1}</ServiceName>
              </ServiceLeft>
              <ServiceStatus status="operational">
                Operativ
              </ServiceStatus>
            </PlaceholderCard>
          ))}
        </ServiceGrid>

        {/* Recent Messages (Last 7 Days) */}
        <MaintenanceSection>
          <SectionTitle>Driftsmeldinger siste 7 dagene</SectionTitle>
          <RecentMessages service_ids={services_ids_list} user={user}/>
        </MaintenanceSection>

        {/* Planned Maintenance */}
        <MaintenanceSection>
          <SectionTitle>Planlagt vedlikehold</SectionTitle>
          <StatusList service_ids={services_ids_list} user={user}/>
        </MaintenanceSection>
      </ContentWrapper>
    </PageContainer>
  );
};

const getServiceStatus = (service: Service): 'operational' | 'degraded' | 'outage' | 'maintenance' => {
  if (!service.record) return 'operational';

  switch (service.record.status) {
    case 'OK':
    case 'UP':
      return 'operational';
    case 'ISSUE':
    case 'DEGRADED':
      return 'degraded';
    case 'DOWN':
    case 'OUTAGE':
      return 'outage';
    case 'MAINTENANCE':
      return 'maintenance';
    default:
      return 'operational';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'operational':
      return 'Operativ';
    case 'degraded':
      return 'Problemer';
    case 'outage':
      return 'Nedetid';
    case 'maintenance':
      return 'Vedlikehold';
    default:
      return 'Operativ';
  }
};

// Page layout components
const PageContainer = styled.div`
  background: var(--a-gray-100);
  min-height: 100vh;
  padding: 0;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1200px) {
    max-width: 90%;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 768px) {
    max-width: 95%;
    padding: 1rem;
    gap: 0.75rem;
  }
`;

// Header components
const PageHeader = styled.div`
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 6px;
  border: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.5rem 2rem;
  }
`;

const StatusOverview = styled.div`
  font-size: 1.375rem;
  font-weight: 400;
  color: #172b4d;
  line-height: 1.4;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const SubscribeButton = styled(Button)`
  border-radius: 3px;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: #0052cc;
  border: none;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &:hover {
    background: #0747a6;
  }

  @media (max-width: 768px) {
    align-self: stretch;
    justify-content: center;
  }
`;

// Maintenance section title
const SectionTitle = styled.h2`
  background: #f4f5f7;
  margin: 0;
  padding: 1.25rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #172b4d;
  border-bottom: 1px solid #e1e5e9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  transition: background-color 0.15s ease;
  min-height: 64px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    background-color: #f4f5f7;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
  }
`;

const PlaceholderCard = styled(ServiceCard)`
  opacity: 0.7;
  background: #f8f9fa;
  border: 1px solid #e9ecef;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ServiceLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex: 1;
`;

const ServiceIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-size: 16px;
  }
`;

const ServiceName = styled.div`
  font-size: 0.9375rem;
  color: #172b4d;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const ServiceStatus = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: ${props => {
    switch (props.status) {
      case 'operational':
        return '#36b37e';
      case 'degraded':
        return '#ff8b00';
      case 'outage':
        return '#de350b';
      case 'maintenance':
        return '#0052cc';
      default:
        return '#36b37e';
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
          return '#36b37e';
        case 'degraded':
          return '#ff8b00';
        case 'outage':
          return '#de350b';
        case 'maintenance':
          return '#0052cc';
        default:
          return '#36b37e';
      }
    }};
  }
`;

// Status Legend
const StatusLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 0.75rem 0;
  justify-content: center;
  padding: 0.5rem 0;

  @media (max-width: 768px) {
    gap: 1.5rem;
    margin: 0.5rem 0;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #5e6c84;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const LegendIcon = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.color};
  flex-shrink: 0;
`;

// Maintenance section
const MaintenanceSection = styled.div`
  background: white;
  border-radius: 6px;
  border: 1px solid #e1e5e9;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export default DashboardTemplate;