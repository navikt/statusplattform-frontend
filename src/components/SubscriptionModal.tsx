import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField, Select } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Service } from '../types/types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  selectedService?: Service;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  services,
  selectedService
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<'all' | 'service' | 'specific'>('all');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form and close modal
      setEmail('');
      setSubscriptionType('all');
      setSelectedServices([]);
      onClose();

      // Show success message (could be replaced with proper notification)
      alert('Abonnement opprettet!');
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Noe gikk galt. Prøv igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Abonner på statusoppdateringer</ModalTitle>
          <CloseButton onClick={onClose}>
            <XMarkIcon aria-hidden fontSize="1.25rem" />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Description>
            Få beskjed når det oppstår problemer eller planlagt vedlikehold på våre tjenester.
          </Description>

          <form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Hva vil du abonnere på?</SectionTitle>

              <RadioGroup>
                <RadioOption>
                  <input
                    type="radio"
                    id="all-services"
                    name="subscription-type"
                    value="all"
                    checked={subscriptionType === 'all'}
                    onChange={() => setSubscriptionType('all')}
                  />
                  <label htmlFor="all-services">
                    <RadioLabel>
                      <RadioTitle>Alle tjenester</RadioTitle>
                      <RadioDescription>
                        Motta varsler for alle NAV sine digitale tjenester
                      </RadioDescription>
                    </RadioLabel>
                  </label>
                </RadioOption>

                {selectedService && (
                  <RadioOption>
                    <input
                      type="radio"
                      id="selected-service"
                      name="subscription-type"
                      value="service"
                      checked={subscriptionType === 'service'}
                      onChange={() => setSubscriptionType('service')}
                    />
                    <label htmlFor="selected-service">
                      <RadioLabel>
                        <RadioTitle>Kun {selectedService.name}</RadioTitle>
                        <RadioDescription>
                          Motta varsler kun for denne tjenesten
                        </RadioDescription>
                      </RadioLabel>
                    </label>
                  </RadioOption>
                )}

                <RadioOption>
                  <input
                    type="radio"
                    id="specific-services"
                    name="subscription-type"
                    value="specific"
                    checked={subscriptionType === 'specific'}
                    onChange={() => setSubscriptionType('specific')}
                  />
                  <label htmlFor="specific-services">
                    <RadioLabel>
                      <RadioTitle>Velg spesifikke tjenester</RadioTitle>
                      <RadioDescription>
                        Velg hvilke tjenester du vil motta varsler for
                      </RadioDescription>
                    </RadioLabel>
                  </label>
                </RadioOption>
              </RadioGroup>
            </FormSection>

            {subscriptionType === 'specific' && (
              <FormSection>
                <ServiceMultiSelect>
                  <SectionTitle>Velg tjenester</SectionTitle>
                  <ServiceCheckboxGroup>
                    {services.filter(service => service.id).map((service) => (
                      <ServiceCheckboxOption key={service.id}>
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          value={service.id!}
                          checked={selectedServices.includes(service.id!)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServices([...selectedServices, service.id!]);
                            } else {
                              setSelectedServices(selectedServices.filter(id => id !== service.id!));
                            }
                          }}
                        />
                        <label htmlFor={`service-${service.id}`}>
                          {service.name}
                        </label>
                      </ServiceCheckboxOption>
                    ))}
                  </ServiceCheckboxGroup>
                  {selectedServices.length === 0 && (
                    <ErrorMessage>
                      Velg minst én tjeneste for å fortsette
                    </ErrorMessage>
                  )}
                </ServiceMultiSelect>
              </FormSection>
            )}

            <FormSection>
              <TextField
                label="E-postadresse"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                required
                size="medium"
              />
              <FieldDescription>
                Vi sender kun varsler når det er problemer eller planlagt vedlikehold.
              </FieldDescription>
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
                disabled={subscriptionType === 'specific' && selectedServices.length === 0}
              >
                {isSubmitting ? 'Oppretter...' : 'Opprett abonnement'}
              </Button>
            </ModalActions>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

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
  max-width: 500px;
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

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioOption = styled.div`
  input[type="radio"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    padding: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    transition: all 0.15s ease;
    position: relative;

    &::before {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid #5e6c84;
      border-radius: 50%;
      margin-right: 0.75rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }

    &:hover {
      border-color: #0052cc;
      background-color: #f4f5f7;
    }
  }

  input[type="radio"]:checked + label {
    border-color: #0052cc;
    background-color: #e9f2ff;

    &::before {
      border-color: #0052cc;
      background-color: #0052cc;
      box-shadow: inset 0 0 0 3px white;
    }
  }

  input[type="radio"]:focus + label {
    outline: 2px solid #0052cc;
    outline-offset: 2px;
  }
`;

const RadioLabel = styled.div`
  flex: 1;
`;

const RadioTitle = styled.div`
  font-weight: 500;
  color: #172b4d;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const RadioDescription = styled.div`
  color: #5e6c84;
  font-size: 0.8125rem;
  line-height: 1.4;
`;

const FieldDescription = styled.div`
  margin-top: 0.5rem;
  color: #5e6c84;
  font-size: 0.8125rem;
  line-height: 1.4;
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

const ServiceMultiSelect = styled.div`
  margin-top: 0.5rem;
`;

const ServiceCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 0.75rem;
  background: #f8f9fa;
`;

const ServiceCheckboxOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #0052cc;
    cursor: pointer;
  }

  label {
    font-size: 0.875rem;
    color: #172b4d;
    cursor: pointer;
    line-height: 1.4;
    user-select: none;
  }

  &:hover label {
    color: #0052cc;
  }
`;

const ErrorMessage = styled.div`
  color: #de350b;
  font-size: 0.8125rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

export default SubscriptionModal;