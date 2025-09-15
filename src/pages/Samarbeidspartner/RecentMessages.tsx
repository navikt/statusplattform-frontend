import { BodyShort, Heading, Panel, Label, Detail, Button } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { OpsMessageI } from "../../types/opsMessage";
import { Service } from "../../types/types";
import styled from "styled-components";
import { fetchMessageByServiceList } from "../../utils/dashboardsAPI";
import { formatDistanceToNow, parseISO, isAfter, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import { UserData } from "../../types/userData";
import { PencilIcon } from '@navikt/aksel-icons';

interface RecentMessagesProps {
  service_ids: string[];
  user?: UserData;
}

const RecentMessages = ({ service_ids, user }: RecentMessagesProps) => {
  const [recentMessages, setRecentMessages] = useState<OpsMessageI[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<Record<string, OpsMessageI[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messages = await fetchMessageByServiceList(service_ids);
        const sevenDaysAgo = subDays(new Date(), 7);

        // Filter messages from the last 7 days (including maintenance that has passed)
        const recent = messages.filter(message => {
          const messageDate = new Date(message.startTime);
          return isAfter(messageDate, sevenDaysAgo);
        });

        recent.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

        const grouped = recent.reduce((acc: Record<string, OpsMessageI[]>, message) => {
          const messageDate = new Date(message.startTime).toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          if (!acc[messageDate]) {
            acc[messageDate] = [];
          }
          acc[messageDate].push(message);
          return acc;
        }, {});

        setRecentMessages(recent);
        setGroupedMessages(grouped);
      } catch (error) {
        console.error("Failed to fetch recent operations messages:", error);
      }
    };

    fetchData();
  }, [service_ids]);

  return (
    <MessagesContainer>
      {recentMessages.length === 0 ? (
        <NoMessages>Ingen driftsmeldinger siste 7 dagene.</NoMessages>
      ) : (
        Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <DateHeading>{date}</DateHeading>
            {groupedMessages[date].map((message) => (
              <DateSection key={message.id}>
                <EventDetails severityColor={getSeverityColor(message.severity)}>
                  <HeaderContainer>
                    <Header level="3" size="medium" spacing>
                      {message.internalHeader}
                    </Header>
                    {user ? (
                      <AddOpsMessageLabel>
                        <a href={`ekstern/${message.id}/rediger`}>
                          <PencilIcon title="Rediger melding" fontSize="1.5rem" />
                        </a>
                      </AddOpsMessageLabel>
                    ) : null}
                  </HeaderContainer>

                  <StatusText isActive={message.isActive}>
                    Status: {message.isActive ? "Aktiv" : "Inaktiv"}
                  </StatusText>

                  {message.internalMessage && (
                    <InternalMessage
                      dangerouslySetInnerHTML={{
                        __html: getLastUpdate(message.internalMessage),
                      }}
                    />
                  )}

                  {message.affectedServices.length > 0 && (
                    <>
                      <Label as="h4" size="medium">Berørte tjenester:</Label>
                      <AffectedServices>
                        {message.affectedServices.map((service: Service) => (
                          <ServiceName key={service.name}>{service.name}</ServiceName>
                        ))}
                      </AffectedServices>
                    </>
                  )}

                  <DetailItem>
                    Postet: {getPostedTime(message.startTime)} •{" "}
                    {new Date(message.startTime).toLocaleDateString("nb-NO", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(message.startTime).toLocaleTimeString("nb-NO", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                  </DetailItem>
                </EventDetails>
              </DateSection>
            ))}
          </div>
        ))
      )}
    </MessagesContainer>
  );
};

// Styled components (reusing from statusList.tsx)
const StatusText = styled(BodyShort)<{ isActive: boolean }>`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${(props) => (props.isActive ? "#de350b" : "#36b37e")};
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => (props.isActive ? "#de350b" : "#36b37e")};
  }
`;

const MessagesContainer = styled.div`
  padding: 2.5rem;
  width: 100%;
  background-color: white;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InternalMessage = styled(BodyShort)`
  margin: 0.75rem 0;
  color: #5e6c84;
  font-size: 0.875rem;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const AffectedServices = styled.div`
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
`;

const ServiceName = styled(BodyShort)`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #555;
  font-weight: 500;
`;

const NoMessages = styled.p`
  text-align: center;
  margin: 2rem 0;
  color: #666;
  font-size: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
`;

const Header = styled(Heading)`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: #172b4d;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const DetailItem = styled(Detail)`
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #5e6c84;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const DateHeading = styled(Heading)`
  font-size: 1rem;
  margin: 1.5rem 0 0.75rem 0;
  color: #172b4d;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &:first-child {
    margin-top: 0;
  }
`;

const DateSection = styled.div`
  margin: 0 0 1rem 0;
  &:last-child {
    margin-bottom: 0;
  }
`;

const EventDetails = styled.div<{ severityColor: string }>`
  padding: 1.25rem 0;
  border-bottom: 1px solid #e1e5e9;
  margin: 0;
  background-color: transparent;

  &:last-child {
    border-bottom: none;
  }
`;

const AddOpsMessageLabel = styled.div`
  padding: 0;
  font-size: 15px;
  text-align: end;
`;

// Helper functions (reusing from statusList.tsx)
const getPostedTime = (startTime) => {
  return formatDistanceToNow(parseISO(startTime), { addSuffix: true, locale: nb });
};

const getLastUpdate = (messageHtml) => {
  const sections = messageHtml.split("<p>------------------------------------------------- </p>");
  return removeEmptyExpectedFixTime(sections[0]);
};

const removeEmptyExpectedFixTime = (htmlContent) => {
  return htmlContent
    .replace(/(&nbsp;|\s)+<br>/g, "")
    .replace(/<strong>Forventet rettetid er:<\/strong>\s*false(\s*|<br>)/g, "")
    .replace(/<strong>Forventet rettetid er:<\/strong>\s*(<br>)?/g, "")
    .replace(/<p>\s*false\s*<\/p>/g, "")
    .replace(/Feilen er nå rettet.<br>\s*false/g, "Feilen er nå rettet.")
    .replace(/<p><strong>Status: <\/strong> Løst\s*<\/p>/g, "");
};

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

export default RecentMessages;