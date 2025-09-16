import { BodyShort, Heading, Tag } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { OpsMessageI } from "../../types/opsMessage";
import styled from "styled-components";
import { fetchMessageByServiceList } from "../../utils/dashboardsAPI";
import { UserData } from "../../types/userData";
import { format, isValid, parseISO, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { useRouter } from "next/router"; // Importer useRouter



interface StatusListProps {
  service_ids: string[];
  user?: UserData;
}

const StatusList = ({ service_ids, user }: StatusListProps) => {
  const [serverOpsMessages, setServerOpsMessages] = useState<OpsMessageI[]>([]);
  const [maintenanceMessages, setMaintenanceMessages] = useState<OpsMessageI[]>([]);
  const [otherMessages, setOtherMessages] = useState<OpsMessageI[]>([]);
  const router = useRouter(); // Hent router


  useEffect(() => {
    const fetchData = async () => {
      try {
        const messages = await fetchMessageByServiceList(service_ids);
        messages.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

        // Filtrer ut maintenance-meldinger
        const maintenance = messages.filter((msg) => msg.severity === "NEUTRAL");
        const others = filterLast7Days(messages).filter((msg) => msg.severity !== "NEUTRAL");

        setServerOpsMessages(messages);
        setMaintenanceMessages(maintenance);
        setOtherMessages(others);
      } catch (error) {
        console.error("Failed to fetch operations messages:", error);
      }
    };

    fetchData();
  }, [service_ids]);



  return (
    <StatusContainer>
      {serverOpsMessages.length === 0 ? (
        <NoMessages>Ingen varsler eller meldinger tilgjengelig.</NoMessages>
      ) : (
        <>
          {/* Vedlikehold-seksjon */}
          {maintenanceMessages.length > 0 && (
            <MaintenanceSection>
              <SectionHeading>Planlagt vedlikehold</SectionHeading>
              {maintenanceMessages.filter((message) => message.isActive).map((message) => (
                <MessageCard
                  key={message.id}
                  severityColor={getSeverityColor(message.severity)}
                  onClick={() => router.push(`/Driftsmeldinger/${message.id}`)} // Navigering
                >
                  <HeaderContainer>
                    <Heading level="4" size="small">{message.internalHeader}</Heading>
                  </HeaderContainer>
                  <DateInfo>
                    Start: {formatDate(message.startTime)} • Oppdatert: {getLastUpdatedDate(message.internalMessage)}
                  </DateInfo>
                </MessageCard>
              ))}
            </MaintenanceSection>
          )}

          {/* Andre driftsmeldinger */}
          {otherMessages.length > 0 && (
            <OtherMessagesSection>
              <SectionHeading>Siste 7 dager</SectionHeading>
              {otherMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  severityColor={getSeverityColor(message.severity)}
                  onClick={() => router.push(`/Driftsmeldinger/${message.id}`)} // Navigering
                >
                  <HeaderContainer>
                    <Heading level="4" size="small">{message.internalHeader}</Heading>
                  </HeaderContainer>
                  <DateInfo>
                    Start: {formatDate(message.startTime)} • Oppdatert: {getLastUpdatedDate(message.internalMessage)}
                  </DateInfo>
                </MessageCard>
              ))}
            </OtherMessagesSection>
          )}

          {/* Link til alle driftsmeldinger */}
          <AllMessagesLink href="/Driftsmeldinger">Se alle driftsmeldinger</AllMessagesLink>
        </>
      )}
    </StatusContainer>
  );
};

// **Nye/oppdaterte funksjoner**

// **Styled Components**
const StatusContainer = styled.div`
  width: 77vw;
  border-radius: 8px;
`;

const MaintenanceSection = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
`;

const OtherMessagesSection = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
`;

const MessageCard = styled.div<{ severityColor: string }>`
  padding: 0.75rem 1rem;
  border-left: 6px solid ${(props) => props.severityColor}; 
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  cursor: pointer; /* Gjør kortet klikkbart */
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color:rgb(228, 224, 224); /* Litt mørkere ved hover */
  }
`;

const SectionHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InternalMessage = styled(BodyShort)`
  margin-top: 0.5rem;
  color: #555;
`;

const NoMessages = styled.p`
  text-align: center;
  margin: 2rem 0;
  color: #7d7d7d;
  font-size: 1rem;
`;

const AllMessagesLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #0056b3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DateInfo = styled(BodyShort)`
  font-size: 0.85rem;
  color: #666;
`;

// Funksjon for å hente farge basert på alvorlighetsgrad
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "DOWN":
      return "#d32f2f"; // Rød for alvorlige feil
    case "ISSUE":
      return "#f57c00"; // Oransje for problemer
    case "NEUTRAL":
      return "#1976d2"; // Blå for vedlikehold
    default:
      return "#0076be";
  }
};

const getLastUpdate = (messageHtml: string): string => {
  const sections = messageHtml.split("<p>------------------------------------------------- </p>");
  return removeEmptyExpectedFixTime(sections[0]);
};

const removeEmptyExpectedFixTime = (htmlContent: string): string => {
  return htmlContent
    .replace(/(&nbsp;|\s)+<br>/g, "")
    .replace(/<strong>Forventet rettetid er:<\/strong>\s*false(\s*|<br>)/g, "")
    .replace(/<strong>Forventet rettetid er:<\/strong>\s*(<br>)?/g, "")
    .replace(/<p>\s*false\s*<\/p>/g, "")
    .replace(/Feilen er nå rettet.<br>\s*false/g, "Feilen er nå rettet.")
    .replace(/<p><strong>Status: <\/strong> Løst\s*<\/p>/g, "");
};

const filterLast7Days = (messages: OpsMessageI[]) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return messages.filter((msg) => new Date(msg.startTime) >= sevenDaysAgo);
};

const formatDate = (date: Date | string) => {
  if (typeof date === "string") {
    date = parseISO(date); // Konverter fra ISO-streng til Date
  }

  return isValid(date) ? format(date, "dd.MM.yyyy HH:mm", { locale: nb }) : "Ukjent dato";
};

const getLastUpdatedDate = (messageHtml: string): string => {
  const sections = messageHtml.split("<p>------------------------------------------------- </p>");
  return extractDateFromMessage(sections[0]);
};

const extractDateFromMessage = (htmlContent: string): string => {
  const match = htmlContent.match(/<strong>Oppdatert: <\/strong>(.*?)<br>/);
  return match ? match[1].trim() : "Ukjent";
};

export default StatusList;