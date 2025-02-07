import { BodyShort, Heading, Panel, Label, Detail, Button } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { OpsMessageI } from "../../types/opsMessage";
import { Service } from "../../types/types";
import styled from "styled-components";
import { fetchMessageByServiceList } from "../../utils/dashboardsAPI";
import { formatDistanceToNow, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { UserData } from "../../types/userData";
import { PencilIcon } from '@navikt/aksel-icons';
import opsMessageDetails from "../Driftsmeldinger/[driftmeldingsId]";

interface StatusListProps {
  service_ids: string[];
  user?: UserData;
}

const StatusList = ({ service_ids, user }: StatusListProps) => {
  const [serverOpsMessages, setServerOpsMessages] = useState<OpsMessageI[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<Record<string, OpsMessageI[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messages = await fetchMessageByServiceList(service_ids);
        messages.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

        const grouped = messages.reduce((acc: Record<string, OpsMessageI[]>, message) => {
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
        setServerOpsMessages(messages);
        setGroupedMessages(grouped);
      } catch (error) {
        console.error("Failed to fetch operations messages:", error);
      }
    };

    fetchData();
  }, [service_ids]);

  console.log(serverOpsMessages);
  return (
    <StatusContainer>
      {serverOpsMessages.length === 0 ? (
        <NoMessages>Ingen varsler eller meldinger tilgjengelig.</NoMessages>
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
                  
                  {/* Viser status basert på isActive */}
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
    </StatusContainer>
  );
};

// Styled komponent for status
const StatusText = styled(BodyShort)<{ isActive: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.isActive ? "#2e7d32" : "#d32f2f")}; // Grønn for aktiv, rød for inaktiv
  margin-top: 0.5rem;
`;

const StatusContainer = styled(Panel)`
  padding: 1.5rem;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const InternalMessage = styled(BodyShort)`
  margin: 0;
  color: #555;
`;

const AffectedServices = styled.div`
  margin-top: 0.5rem;
`;

const ServiceName = styled(BodyShort)`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #333;
`;

const NoMessages = styled.p`
  text-align: center;
  margin: 2rem 0;
  color: #7d7d7d;
  font-size: 1rem;
`;

const Header = styled(Heading)`
  font-size: 1.25rem;
  font-weight: 600;
`;

const DetailItem = styled(Detail)`
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #888;
`;

const DateHeading = styled(Heading)`
  font-size: 1.5rem;
  margin: 1rem 0;
  color: #333;
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

const AddOpsMessageLabel = styled.div`
  padding: 0;
  font-size: 15px;
  text-align: end;
`;

// Funksjon for å vise hvor lenge siden meldingen ble postet
const getPostedTime = (startTime) => {
  return formatDistanceToNow(parseISO(startTime), { addSuffix: true, locale: nb });
};

const getLastUpdate = (messageHtml) => {
  // Splitt meldingen basert på separatoren "<p>------------------------------------------------- </p>"
  const sections = messageHtml.split("<p>------------------------------------------------- </p>");
  // Returner den første delen som HTML
  return removeEmptyExpectedFixTime(sections[0]);
}; 

const removeEmptyExpectedFixTime = (htmlContent) => {
  // Fjern &nbsp; og sjekk for linjer der "Forventet rettetid er:" er tom eller inneholder "false"
  return htmlContent
    .replace(/(&nbsp;|\s)+<br>/g, "") // Fjern unødvendige &nbsp; og tomme linjer
    .replace(/<strong>Forventet rettetid er:<\/strong>\s*false(\s*|<br>)/g, "") // Fjern linjer med "false" som forventet rettetid
    .replace(/<strong>Forventet rettetid er:<\/strong>\s*(<br>)?/g, "") // Fjern helt tomme linjer
    .replace(/<p>\s*false\s*<\/p>/g, "") // Fjern p-tagger som kun inneholder "false"
    .replace(/Feilen er nå rettet.<br>\s*false/g, "Feilen er nå rettet.") // Fjern "false" etter "Feilen er nå rettet."
    .replace(/<p><strong>Status: <\/strong> Løst\s*<\/p>/g, ""); // Fjern linjer som angir "Løst" hvis det er tomt
};

// Funksjon for å få farge basert på alvorlighetsgrad
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

export default StatusList;