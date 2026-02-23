import { BodyShort, Heading, Panel, Label, Detail, Button, Tag } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { OpsMessageI } from "@/types/opsMessage";
import { Service } from "@/types/types";
import styled from "styled-components";
import { formatDistanceToNow, parseISO, isAfter, isBefore, subDays, eachDayOfInterval, format } from "date-fns";
import { nb } from "date-fns/locale";
import { UserData } from "@/types/userData";
import { PencilIcon } from '@navikt/aksel-icons';
import { toast } from "react-toastify";
import { checkUserMembershipInTeam } from "@/utils/teamKatalogAPI";
import OpsMessageModal from "@/components/OpsMessageModal";

interface RecentMessagesProps {
  service_ids: string[];
  user?: UserData;
  services: Service[];
  opsMessages: OpsMessageI[];
}

const RecentMessages = ({ service_ids, user, services, opsMessages }: RecentMessagesProps) => {
  const [recentMessages, setRecentMessages] = useState<OpsMessageI[]>([]);
  const [allDays, setAllDays] = useState<{ date: string; messages: OpsMessageI[] }[]>([]);
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
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6); // Last 7 days including today

    // Generate all 7 days
    const last7Days = eachDayOfInterval({
      start: sevenDaysAgo,
      end: today
    });

    // Filter messages from the last 7 days
    // Exclude future messages (they're shown in "Planlagt vedlikehold")
    const recent = opsMessages.filter(message => {
      const messageDate = new Date(message.startTime);
      const messageEndTime = new Date(message.endTime);
      const isFromLast7Days = isAfter(messageDate, subDays(today, 7));
      const isFuture = isAfter(messageDate, today);
      const isOngoing = isAfter(messageEndTime, today) && !isAfter(messageDate, today);
      const isMaintenance = message.status === 'MAITENANCE';

      // Show if: from last 7 days AND not future AND (not ongoing maintenance OR is completed)
      return isFromLast7Days && !isFuture && !(isMaintenance && isOngoing);
    });

    // Group messages by date
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

    // Create array of all days with their messages (or empty array)
    const daysWithMessages = last7Days.reverse().map(day => {
      const dateString = day.toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return {
        date: dateString,
        messages: grouped[dateString] || []
      };
    });

    setRecentMessages(recent);
    setAllDays(daysWithMessages);
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
    <MessagesContainer>
      {allDays.map((dayData, index) => (
        <DayCard key={dayData.date} isFirst={index === 0}>
          <DateHeading>{dayData.date}</DateHeading>
          <DayContent>
            {dayData.messages.length === 0 ? (
              <NoEventsCard>
                <NoEventsText>Ingen hendelser rapportert</NoEventsText>
              </NoEventsCard>
            ) : (
              dayData.messages.map((message, msgIndex) => {
                const { isActive, isCompleted } = getMessageStatus(message);

                return (
                  <MessageCard
                    key={message.id}
                    isLast={msgIndex === dayData.messages.length - 1}
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
                  </MessageCard>
                );
              })
            )}
          </DayContent>
        </DayCard>
      ))}

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

const DayCard = styled.div<{ isFirst: boolean }>`
  background: white;
  border: 1px solid #e1e5e9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DayContent = styled.div`
  padding: 0;
`;

const NoEventsCard = styled.div`
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #f4f5f7;
`;

const NoEventsText = styled.div`
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

const DateHeading = styled(Heading)`
  font-size: 1rem;
  margin: 0;
  padding: 1.25rem 2rem;
  color: #172b4d;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f4f5f7;
  border-bottom: 1px solid #e1e5e9;
`;

const MessageCard = styled.div<{ isLast: boolean; isInactive?: boolean }>`
  padding: 1.5rem 2rem;
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #f0f0f0'};
  transition: all 0.15s ease;
  opacity: ${props => props.isInactive ? '0.75' : '1'};
  background-color: ${props => props.isInactive ? '#fafbfc' : 'transparent'};
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