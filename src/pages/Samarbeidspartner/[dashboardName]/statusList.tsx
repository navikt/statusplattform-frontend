import { BodyShort, Heading, Panel, Label, Detail } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { OpsMessageI } from "../../../types/opsMessage";
import { Service } from "../../../types/types";
import styled from "styled-components";
import { fetchMessageByDashboardId } from "../../../utils/dashboardsAPI";

const StatusContainer = styled(Panel)`
  padding: 2rem;
  width: 80vw;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DateSection = styled.div`
  padding-bottom: 40px;
  border-bottom: 1px solid #e9e9e9;
  &:last-child {
    border-bottom: none;
  }
`;

const EventDetails = styled.div<{ severityColor: string }>`
  margin-top: 1rem;
  padding: 1.5rem;
  border-left: 6px solid ${(props) => props.severityColor}; /* Tydeligere bred farget venstremarg */
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const Header = styled(Heading)`
  font-size: 1.5rem; /* Økt skriftstørrelse for tittel */
  font-weight: 600;
`;

const DetailItem = styled(Detail)`
  margin: 0.25rem 0;
  font-size: 1.1rem; /* Gjør detaljer tydeligere */
  color: #333; /* Mørkere tekstfarge for bedre kontrast */
`;

const NoMessages = styled.p`
  text-align: center;
  margin: 2rem 0;
  color: var(--a-gray-600);
  font-size: 1rem;
`

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "DOWN":
      return "#d32f2f";
    case "ISSUE":
      return "#f57c00";
    case "NEUTRAL":
      return "#1976d2";
    default:
      return "#0076be";
  }
};

const fetchOpsMessages = async (dashboardId: string) => {
  const backendPath = process.env.NEXT_PUBLIC_BACKENDPATH;
  const messageRes = await fetch(`${backendPath}/rest/Dashboards/external/${dashboardId}/messages`);
  const serverOpsMessages: OpsMessageI[] = await messageRes.json();
  return serverOpsMessages;

};

const StatusList = ({ dashboardId }) => {
  const [serverOpsMessages, setServerOpsMessages] = useState<OpsMessageI[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messages = await fetchMessageByDashboardId(dashboardId);
        // Sorter meldingene etter startTime i synkende rekkefølge (nyeste først)
        messages.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setServerOpsMessages(messages);
      } catch (error) {
        console.error("Failed to fetch operations messages:", error);
      }
    };

    if (dashboardId) {
      fetchData();
    }
  }, [dashboardId]);

  return (
    <StatusContainer>
    {serverOpsMessages.length === 0 ? (
      <NoMessages> Ingen varsler eller meldinger tilgjengelig. </NoMessages>
     ) : (
      serverOpsMessages.map((message) => (
        <DateSection key={message.id}>
          <Header level="3" size="medium" spacing>
            {message.internalHeader}
          </Header>

          <EventDetails severityColor={getSeverityColor(message.severity)}>
            <DetailItem>
              Fra: {new Date(message.startTime).toLocaleString()} <br />
              Til: {message.endTime ? new Date(message.endTime).toLocaleString() : "Pågår"}
            </DetailItem>
            <Label as="h4" size="medium">
              Berørte tjenester:
            </Label>
            <DetailItem>
              {message.affectedServices.map((service: Service) => (
                <p key={service.name}>- {service.name}</p>
              ))}
            </DetailItem>
          </EventDetails>
        </DateSection>
      ))
  )}
</StatusContainer>
  );
};

export default StatusList;