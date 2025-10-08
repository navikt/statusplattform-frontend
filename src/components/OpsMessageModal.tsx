import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Button, TextField, Select, Textarea, Radio, RadioGroup, Alert, Chips } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Service } from '../types/types';
import { OpsMessageI, SeverityEnum, StatusEnum } from '../types/opsMessage';
import { UserStateContext } from './ContextProviders/UserStatusContext';
import { UserData } from '../types/userData';
import { postOpsMessage, updateSpecificOpsMessage } from '../utils/opsAPI';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { filterServicesForUser } from '../utils/servicePermissions';

interface OpsMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  editingOpsMessage?: OpsMessageI | null;
}

const OpsMessageModal: React.FC<OpsMessageModalProps> = ({
  isOpen,
  onClose,
  services,
  editingOpsMessage = null
}) => {
  const router = useRouter();
  const user = useContext<UserData>(UserStateContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowedServices, setAllowedServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = !!editingOpsMessage;

  // Set default dates
  const getDefaultDates = () => {
    if (isEditMode && editingOpsMessage) {
      return {
        startTime: new Date(editingOpsMessage.startTime),
        endTime: new Date(editingOpsMessage.endTime)
      };
    } else {
      const currentTime = new Date();
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 14);
      return { startTime: currentTime, endTime };
    }
  };

  const [opsMessage, setOpsMessage] = useState<OpsMessageI>(() => {
    const defaultDates = getDefaultDates();

    if (isEditMode && editingOpsMessage) {
      return {
        ...editingOpsMessage,
        startTime: defaultDates.startTime,
        endTime: defaultDates.endTime,
        status: editingOpsMessage.status || StatusEnum.EXAMINING,
      };
    } else {
      return {
        internalHeader: "",
        internalMessage: "",
        externalHeader: "",
        externalMessage: "",
        onlyShowForNavEmployees: false,
        isActive: true,
        affectedServices: [],
        startTime: defaultDates.startTime,
        endTime: defaultDates.endTime,
        severity: SeverityEnum.NEUTRAL,
        status: StatusEnum.EXAMINING,
        state: "",
      };
    }
  });

  const [durationType, setDurationType] = useState<'automatic' | 'custom'>(() => {
    if (isEditMode && editingOpsMessage) {
      // Determine if current dates match automatic pattern (roughly 14 days)
      const start = new Date(editingOpsMessage.startTime);
      const end = new Date(editingOpsMessage.endTime);
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays === 14 ? 'automatic' : 'custom';
    }
    return 'automatic';
  });
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  // Function to generate automatic title based on status and services
  const generateTitle = (status: StatusEnum, affectedServices: Service[]): string => {
    const serviceNames = affectedServices.map(service => service.name);

    let prefix = '';
    switch (status) {
      case StatusEnum.MAITENANCE:
        prefix = 'Vedlikehold på';
        break;
      case StatusEnum.EXAMINING:
        prefix = 'Problemer med';
        break;
      case StatusEnum.SOLVING:
        prefix = 'Feilretting pågår for';
        break;
      case StatusEnum.SOLVED:
        prefix = 'Løst for';
        break;
      default:
        prefix = 'Oppdatering om';
    }

    if (serviceNames.length === 0) {
      return `${prefix} tjenester`;
    } else if (serviceNames.length === 1) {
      return `${prefix} ${serviceNames[0]}`;
    } else if (serviceNames.length === 2) {
      return `${prefix} ${serviceNames[0]} og ${serviceNames[1]}`;
    } else {
      return `${prefix} ${serviceNames[0]} og ${serviceNames.length - 1} andre tjenester`;
    }
  };

  // Update title automatically when status or services change
  const updateTitle = () => {
    const newTitle = generateTitle(opsMessage.status, opsMessage.affectedServices);
    setOpsMessage(prev => ({
      ...prev,
      externalHeader: newTitle,
      internalHeader: newTitle
    }));
  };

  // Filter services based on user permissions when modal opens
  useEffect(() => {
    const loadAllowedServices = async () => {
      if (isOpen && user?.navIdent) {
        setIsLoadingServices(true);
        try {
          const filtered = await filterServicesForUser(services, user.navIdent);
          setAllowedServices(filtered);
        } catch (error) {
          console.error('Error filtering services:', error);
          setAllowedServices([]);
        } finally {
          setIsLoadingServices(false);
        }
      } else {
        setAllowedServices([]);
        setIsLoadingServices(false);
      }
    };

    loadAllowedServices();
  }, [isOpen, services, user?.navIdent]);

  // Reset form when modal opens or editingOpsMessage changes
  useEffect(() => {
    if (isOpen) {
      const defaultDates = getDefaultDates();

      if (isEditMode && editingOpsMessage) {
        setOpsMessage({
          ...editingOpsMessage,
          startTime: defaultDates.startTime,
          endTime: defaultDates.endTime,
          status: editingOpsMessage.status || StatusEnum.EXAMINING,
        });

        // Determine duration type for edit mode
        const start = new Date(editingOpsMessage.startTime);
        const end = new Date(editingOpsMessage.endTime);
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        setDurationType(diffDays === 14 ? 'automatic' : 'custom');
      } else {
        setOpsMessage({
          internalHeader: "",
          internalMessage: "",
          externalHeader: "",
          externalMessage: "",
          onlyShowForNavEmployees: false,
          isActive: true,
          affectedServices: [],
          startTime: defaultDates.startTime,
          endTime: defaultDates.endTime,
          severity: SeverityEnum.NEUTRAL,
          status: StatusEnum.EXAMINING,
          state: "",
        });
        setDurationType('automatic');
      }
      setSelectedServiceId('');
    }
  }, [isOpen, editingOpsMessage, isEditMode]);

  // Update title when status or affected services change
  useEffect(() => {
    if (isOpen && !isEditMode) {
      updateTitle();
    }
  }, [opsMessage.status, opsMessage.affectedServices, isOpen, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!opsMessage.externalMessage.trim()) {
      toast.error('Innhold er påkrevd');
      return;
    }

    if (opsMessage.affectedServices.length === 0) {
      toast.error('Minst én tjeneste må være tilknyttet');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateSpecificOpsMessage(opsMessage);
        toast.success('Driftsmelding oppdatert!');
      } else {
        await postOpsMessage(opsMessage);
        toast.success('Driftsmelding opprettet!');
      }
      onClose();
      // Refresh the page to show updated/new message
      window.location.reload();
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} ops message:`, error);
      toast.error(`Kunne ikke ${isEditMode ? 'oppdatere' : 'opprette'} driftsmelding. Prøv igjen.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddService = () => {
    if (!selectedServiceId) {
      toast.info('Velg en tjeneste først');
      return;
    }

    const service = allowedServices.find(s => s.id === selectedServiceId);
    if (!service) {
      toast.error('Du har ikke tilgang til denne tjenesten');
      return;
    }

    if (opsMessage.affectedServices.some(s => s.id === service.id)) {
      toast.warn('Denne tjenesten er allerede lagt til');
      return;
    }

    const newAffectedServices = [...opsMessage.affectedServices, service];
    setOpsMessage(prev => ({
      ...prev,
      affectedServices: newAffectedServices
    }));
    setSelectedServiceId('');
  };

  const handleRemoveService = (serviceToRemove: Service) => {
    const newAffectedServices = opsMessage.affectedServices.filter(s => s.id !== serviceToRemove.id);
    setOpsMessage(prev => ({
      ...prev,
      affectedServices: newAffectedServices
    }));
  };

  const handleDurationTypeChange = (value: string) => {
    const isAutomatic = value === 'automatic';
    setDurationType(isAutomatic ? 'automatic' : 'custom');

    if (isAutomatic) {
      const currentTime = new Date();
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 14);

      setOpsMessage({
        ...opsMessage,
        isActive: true,
        startTime: currentTime,
        endTime: endTime
      });
    } else {
      setOpsMessage({
        ...opsMessage,
        isActive: false
      });
    }
  };

  // Filter out services that are already selected from allowed services
  const availableServices = allowedServices.filter(
    service => !opsMessage.affectedServices.some(selected => selected.id === service.id)
  );

  // Check if form is valid for submission
  const isFormValid = opsMessage.externalMessage.trim().length > 0 && opsMessage.affectedServices.length > 0;

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isEditMode ? 'Rediger driftsmelding' : 'Opprett driftsmelding'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <XMarkIcon aria-hidden fontSize="1.25rem" />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Description>
            {isEditMode
              ? 'Rediger eksisterende driftsmelding for å oppdatere informasjon om problemer eller vedlikehold.'
              : 'Opprett en ny driftsmelding for å informere brukere om problemer eller planlagt vedlikehold.'
            }
          </Description>

          <form onSubmit={handleSubmit}>
            <FormSection>
              <Select
                label="Alvorlighetsgrad"
                value={opsMessage.severity}
                onChange={(e) => setOpsMessage({
                  ...opsMessage,
                  severity: e.target.value as SeverityEnum
                })}
                size="medium"
              >
                <option value={SeverityEnum.NEUTRAL}>Nøytral - Blå</option>
                <option value={SeverityEnum.ISSUE}>Middels - Gul</option>
                <option value={SeverityEnum.DOWN}>Høy - Rød</option>
              </Select>
            </FormSection>

            <FormSection>
              <Select
                label="Status"
                value={opsMessage.status}
                onChange={(e) => setOpsMessage({
                  ...opsMessage,
                  status: e.target.value as StatusEnum
                })}
                size="medium"
              >
                <option value={StatusEnum.EXAMINING}>Undersøkes</option>
                <option value={StatusEnum.MAITENANCE}>Vedlikehold</option>
                <option value={StatusEnum.SOLVING}>Feilretting pågår</option>
                <option value={StatusEnum.SOLVED}>Løst</option>
              </Select>
            </FormSection>


            <FormSection>
              <Textarea
                label="Innhold"
                value={opsMessage.externalMessage}
                onChange={(e) => setOpsMessage({
                  ...opsMessage,
                  externalMessage: e.target.value,
                  internalMessage: e.target.value
                })}
                placeholder="Beskriv problemet eller vedlikeholdet..."
                minRows={4}
                maxLength={1000}
                required
              />
            </FormSection>

            <FormSection>
              <SectionTitle>Berørte tjenester *</SectionTitle>

              {opsMessage.affectedServices.length > 0 && (
                <ServiceChipsContainer>
                  <Chips>
                    {opsMessage.affectedServices.map((service) => (
                      <Chips.Removable
                        key={service.id}
                        onClick={() => handleRemoveService(service)}
                      >
                        {service.name}
                      </Chips.Removable>
                    ))}
                  </Chips>
                </ServiceChipsContainer>
              )}

              <ServiceSelectContainer>
                <Select
                  label="Legg til tjeneste"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  size="medium"
                  hideLabel
                  disabled={isLoadingServices}
                >
                  <option value="">
                    {isLoadingServices
                      ? "Laster tjenester..."
                      : availableServices.length === 0
                        ? "Ingen tilgjengelige tjenester"
                        : "Velg tjeneste..."
                    }
                  </option>
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
                <Button
                  variant="secondary"
                  size="medium"
                  type="button"
                  onClick={handleAddService}
                  disabled={!selectedServiceId || isLoadingServices || availableServices.length === 0}
                >
                  Legg til
                </Button>
              </ServiceSelectContainer>

              {!isLoadingServices && allowedServices.length === 0 && (
                <NoServicesMessage>
                  Du har ikke tilgang til noen tjenester. Kontakt teamleder for å få tilgang.
                </NoServicesMessage>
              )}

              {opsMessage.affectedServices.length === 0 && (
                <RequiredFieldError>
                  Minst én tjeneste må være tilknyttet
                </RequiredFieldError>
              )}
            </FormSection>

            <FormSection>
              <RadioGroup
                legend="Varighet"
                value={durationType}
                onChange={(value) => handleDurationTypeChange(value)}
              >
                <Radio value="automatic">
                  Automatisk (14 dager)
                </Radio>
                <Radio value="custom">
                  Tilpasset
                </Radio>
              </RadioGroup>

              {durationType === 'automatic' && (
                <DurationAlert>
                  <Alert variant="info" size="small">
                    Driftsmeldingen gjøres aktiv umiddelbart og forblir aktiv i 14 dager.
                    Den blir inaktiv {opsMessage.endTime.toLocaleDateString('nb', {
                      month: 'long',
                      weekday: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}.
                  </Alert>
                </DurationAlert>
              )}

              {durationType === 'custom' && (
                <CustomDateContainer>
                  <DateFieldContainer>
                    <TextField
                      label="Startdato"
                      type="datetime-local"
                      value={opsMessage.startTime instanceof Date && !isNaN(opsMessage.startTime.getTime())
                        ? opsMessage.startTime.toISOString().slice(0, 16)
                        : ''}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          setOpsMessage({
                            ...opsMessage,
                            startTime: newDate
                          });
                        }
                      }}
                      size="medium"
                    />
                  </DateFieldContainer>
                  <DateFieldContainer>
                    <TextField
                      label="Sluttdato"
                      type="datetime-local"
                      value={opsMessage.endTime instanceof Date && !isNaN(opsMessage.endTime.getTime())
                        ? opsMessage.endTime.toISOString().slice(0, 16)
                        : ''}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          setOpsMessage({
                            ...opsMessage,
                            endTime: newDate
                          });
                        }
                      }}
                      size="medium"
                    />
                  </DateFieldContainer>
                </CustomDateContainer>
              )}
            </FormSection>

            <ModalActions>
              <Button
                variant="secondary"
                size="medium"
                onClick={onClose}
                type="button"
                disabled={isSubmitting}
              >
                Avbryt
              </Button>
              <Button
                variant="primary"
                size="medium"
                type="submit"
                loading={isSubmitting}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting
                  ? (isEditMode ? 'Oppdaterer...' : 'Oppretter...')
                  : (isEditMode ? 'Oppdater driftsmelding' : 'Opprett driftsmelding')
                }
              </Button>
            </ModalActions>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled components (reusing many from SubscriptionModal)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: none;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #172b4d;
  line-height: 1.3;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  color: #5e6c84;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f4f5f7;
    color: #172b4d;
  }

  &:focus {
    outline: 2px solid #0052cc;
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Description = styled.p`
  margin: 0 0 1.5rem 0;
  color: #5e6c84;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-of-type {
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #172b4d;
`;

const ServiceChipsContainer = styled.div`
  margin-bottom: 1rem;
`;

const ServiceSelectContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: end;

  > div:first-child {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DurationAlert = styled.div`
  margin-top: 1rem;
`;

const CustomDateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DateFieldContainer = styled.div`
  /* Container for date fields */
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;


const RequiredFieldError = styled.div`
  color: #de350b;
  font-size: 0.8125rem;
  margin-top: 0.5rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  background-color: #ffebe6;
  border: 1px solid #ff8b00;
  border-radius: 4px;
`;

const NoServicesMessage = styled.div`
  color: #5e6c84;
  font-size: 0.8125rem;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f4f5f7;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  text-align: center;
  font-style: italic;
`;

export default OpsMessageModal;