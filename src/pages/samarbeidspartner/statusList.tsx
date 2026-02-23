import { BodyShort, Heading, Panel, Label, Detail, Button, Tag } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { OpsMessageI } from "@/types/opsMessage";
import { Service } from "@/types/types";
import styled from "styled-components";
import { formatDistanceToNow, parseISO, isAfter, isBefore } from "date-fns";
import { nb } from "date-fns/locale";
import { UserData } from "@/types/userData";
import { PencilIcon } from '@navikt/aksel-icons';
import { toast } from "react-toastify";
import { checkUserMembershipInTeam } from "@/utils/teamKatalogAPI";
import OpsMessageModal from "@/components/OpsMessageModal";

interface StatusListProps {
  service_ids: string[];
  user?: UserData;
  services: Service[];
  opsMessages: OpsMessageI[];
}

const StatusList = ({ service_ids, user, services, opsMessages }: StatusListProps) => {
  const [serverOpsMessages, setServerOpsMessages] = useState<OpsMessageI[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<Record<string, OpsMessageI[]>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<OpsMessageI | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const handleEditClick = async (message: OpsMessageI, e: React.MouseEvent) => {
    e.preventDefault();

    if (!user?.navIdent) {
      toast.error("Du må være logget inn for å redigere meldinger");
      return;
    }

    // Check if message has affected services
    if (message.affectedServices.length === 0) {
      toast.error("Du har ikke tilgang til å redigere denne driftsmeldingen - ingen tjenester tilknyttet");
      return;
    }

    const firstService = message.affectedServices[0];

    // Check if teamId exists
    if (!firstService.teamId) {
      toast.error("Du har ikke tilgang til å redigere denne driftsmeldingen - ingen team tilknyttet");
      return;
    }

    try {
      const isMember = await checkUserMembershipInTeam(firstService.teamId, user.navIdent);
      if (isMember) {
        setEditingMessage(message);
        setIsEditModalOpen(true);
      } else {
        toast.error("Du har ikke tilgang til å redigere denne driftsmeldingen");
      }
    } catch (error) {
      console.error('Error checking team membership:', error);
      toast.error("Kunne ikke verifisere tilgang til redigering");
    }
  };

  const handleMessageClick = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Filter to show:
    // 1. Future messages (planned maintenance)
    // 2. Messages with status MAITENANCE (maintenance operations)
    const currentTime = new Date();
    const maintenanceMessages = opsMessages.filter(message => {
      const messageStartTime = new Date(message.startTime);
      const isFuture = isAfter(messageStartTime, currentTime);
      const isMaintenance = message.status === 'MAITENANCE';

      return isFuture || isMaintenance;
    });

    maintenanceMessages.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const grouped = maintenanceMessages.reduce((acc: Record<string, OpsMessageI[]>, message) => {
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
    setServerOpsMessages(maintenanceMessages);
    setGroupedMessages(grouped);
  }, [opsMessages]);

  const getMessageStatus = (message: OpsMessageI) => {
    const currentTime = new Date();
    const messageStartTime = new Date(message.startTime);
    const messageEndTime = new Date(message.endTime);

    const isActive = isAfter(currentTime, messageStartTime) && isBefore(currentTime, messageEndTime);
    const isCompleted = message.status === 'SOLVED' || isAfter(currentTime, messageEndTime);

    return { isActive, isCompleted };
  };

  return (
    <StatusContainer>
      {serverOpsMessages.length === 0 ? (
        <NoMaintenanceCard>
          <NoMaintenanceText>Ingen planlagt vedlikehold</NoMaintenanceText>
        </NoMaintenanceCard>
      ) : (
        serverOpsMessages.map((message, index) => {
          const { isActive, isCompleted } = getMessageStatus(message);

          return (
            <MaintenanceCard
              key={message.id}
              isLast={index === serverOpsMessages.length - 1}
              isInactive={isCompleted}
            >
              <HeaderContainer>
                <HeaderWithBadge>
                  <Header level="3" size="medium">
                    {message.internalHeader}
                  </Header>
                  {isCompleted && (
                    <StatusBadge
                      variant={message.status === 'SOLVED' ? 'success' : 'neutral'}
                      size="small"
                    >
                      {message.status === 'SOLVED' ? '✓ Løst' : 'Avsluttet'}
                    </StatusBadge>
                  )}
                </HeaderWithBadge>
                {user && user.navIdent ? (
                  <AddOpsMessageLabel>
                    <button
                      onClick={(e) => handleEditClick(message, e)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <PencilIcon title="Rediger melding" fontSize="1.5rem" />
                    </button>
                  </AddOpsMessageLabel>
                ) : null}
              </HeaderContainer>

              <LastUpdated isInactive={isCompleted}>
                {isCompleted ? 'Avsluttet' : 'Slutter'}:{" "}
                {new Date(message.endTime).toLocaleDateString("nb-NO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                {new Date(message.endTime).toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </LastUpdated>

              {message.externalMessage && (
                <ShowMoreButton
                  isExpanded={expandedMessages.has(message.id!)}
                  isInactive={isCompleted}
                  onClick={() => handleMessageClick(message.id!)}
                >
                  {expandedMessages.has(message.id!) ? 'Vis mindre' : 'Vis mer'}
                </ShowMoreButton>
              )}

              {expandedMessages.has(message.id!) && (
                <ExpandedContent>
                  {message.externalMessage && (
                    <ExternalMessageContent
                      isInactive={isCompleted}
                      dangerouslySetInnerHTML={{ __html: message.externalMessage }}
                    />
                  )}
                </ExpandedContent>
              )}
            </MaintenanceCard>
          );
        })
      )}

      {/* Edit Modal */}
      <OpsMessageModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMessage(null);
        }}
        services={services}
        editingOpsMessage={editingMessage}
      />

    </StatusContainer>
  );
};

// Styled komponent for status
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

const StatusContainer = styled.div`
  padding: 0;
  width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderWithBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const StatusBadge = styled(Tag)`
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 0.25rem 0.625rem;
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

const MaintenanceCard = styled.div<{ isLast: boolean; isInactive?: boolean }>`
  background: ${props => props.isInactive ? '#fafbfc' : 'white'};
  border: 1px solid #e1e5e9;
  overflow: hidden;
  margin-bottom: ${props => props.isLast ? '0' : '1.5rem'};
  padding: 1.5rem 2rem;
  transition: all 0.15s ease;
  opacity: ${props => props.isInactive ? '0.75' : '1'};
`;

const NoMaintenanceCard = styled.div`
  background: white;
  border: 1px solid #e1e5e9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  text-align: center;
`;

const NoMaintenanceText = styled.div`
  color: #5e6c84;
  font-size: 0.875rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Header = styled(Heading)`
  font-size: 0.9375rem;
  font-weight: 500;
  margin: 0 0 0.75rem 0;
  color: #172b4d;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.4;
`;

const DetailItem = styled(Detail)`
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #5e6c84;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const LastUpdated = styled.div<{ isInactive?: boolean }>`
  font-size: 0.8125rem;
  color: ${props => props.isInactive ? '#8993a4' : '#5e6c84'};
  margin-top: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;




const AddOpsMessageLabel = styled.div`
  padding: 0;
  font-size: 15px;
  text-align: end;
`;

const ShowMoreButton = styled.div<{ isExpanded: boolean; isInactive?: boolean }>`
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: ${props => props.isInactive ? '#8993a4' : '#0052cc'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &:hover {
    color: ${props => props.isInactive ? '#6b7687' : '#0747a6'};
    text-decoration: underline;
  }

  &::after {
    content: '▼';
    font-size: 0.75rem;
    transition: transform 0.2s ease;
    transform: ${props => props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const ExpandedContent = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;
`;


const ExternalMessageContent = styled.div<{ isInactive?: boolean }>`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${props => props.isInactive ? '#6b7687' : '#172b4d'};

  p {
    margin: 0 0 1rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    font-weight: 600;
  }

  br {
    margin: 0.5rem 0;
  }
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