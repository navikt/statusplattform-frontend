import { useState } from "react"
import styled from "styled-components"
import { Modal, Button, TextField, Checkbox, Alert, Heading, BodyShort } from "@navikt/ds-react"
import { Service } from "../../types/types"

interface SubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
    services: Service[]
}

const SubscriptionModal = ({ isOpen, onClose, services }: SubscriptionModalProps) => {
    const [email, setEmail] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [notificationChannels, setNotificationChannels] = useState({
        email: true,
        slack: false,
        teams: false,
        webhook: false
    })
    const [step, setStep] = useState<'email' | 'verify' | 'preferences' | 'success'>('email')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleEmailSubmit = async () => {
        if (!email || !isValidEmail(email)) {
            setError("Vennligst oppgi en gyldig e-postadresse")
            return
        }

        setLoading(true)
        setError("")

        try {
            // TODO: Send OTP to email
            const response = await fetch('/api/subscriptions/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (response.ok) {
                setStep('verify')
            } else {
                setError("Kunne ikke sende bekreftelseskode. Prøv igjen.")
            }
        } catch {
            setError("En feil oppstod. Prøv igjen senere.")
        } finally {
            setLoading(false)
        }
    }

    const handleOtpVerify = async () => {
        if (!otpCode || otpCode.length !== 6) {
            setError("Vennligst oppgi en gyldig 6-siffer kode")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch('/api/subscriptions/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otpCode })
            })

            if (response.ok) {
                setStep('preferences')
                // Pre-select all services by default
                setSelectedServices(services.map(s => s.id || ''))
            } else {
                setError("Ugyldig kode. Prøv igjen.")
            }
        } catch {
            setError("En feil oppstod. Prøv igjen senere.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubscriptionCreate = async () => {
        if (selectedServices.length === 0) {
            setError("Velg minst én tjeneste å abonnere på")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    services: selectedServices,
                    channels: notificationChannels
                })
            })

            if (response.ok) {
                setStep('success')
            } else {
                setError("Kunne ikke opprette abonnement. Prøv igjen.")
            }
        } catch {
            setError("En feil oppstod. Prøv igjen senere.")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setStep('email')
        setEmail("")
        setOtpCode("")
        setSelectedServices([])
        setError("")
        onClose()
    }

    const isValidEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    return (
        <Modal open={isOpen} onClose={handleClose} header={{ heading: "Abonner på statusoppdateringer" }}>
            <Modal.Body>
                {error && (
                    <Alert variant="error" style={{ marginBottom: "1rem" }}>
                        {error}
                    </Alert>
                )}

                {step === 'email' && (
                    <EmailStep>
                        <BodyShort spacing>
                            Få varsler om driftsmeldinger og planlagt vedlikehold direkte i innboksen din.
                        </BodyShort>
                        <TextField
                            label="E-postadresse"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="din@epost.no"
                            type="email"
                            autoComplete="email"
                        />
                    </EmailStep>
                )}

                {step === 'verify' && (
                    <VerifyStep>
                        <BodyShort spacing>
                            Vi har sendt en 6-siffer bekreftelseskode til <strong>{email}</strong>.
                            Oppgi koden under for å bekrefte e-postadressen din.
                        </BodyShort>
                        <TextField
                            label="Bekreftelseskode"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            maxLength={6}
                        />
                    </VerifyStep>
                )}

                {step === 'preferences' && (
                    <PreferencesStep>
                        <Heading size="small" spacing>Velg tjenester</Heading>
                        <ServicesList>
                            {services.map((service) => (
                                <Checkbox
                                    key={service.id}
                                    checked={selectedServices.includes(service.id || '')}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedServices([...selectedServices, service.id || ''])
                                        } else {
                                            setSelectedServices(selectedServices.filter(id => id !== service.id))
                                        }
                                    }}
                                >
                                    {service.name}
                                </Checkbox>
                            ))}
                        </ServicesList>

                        <Heading size="small" spacing style={{ marginTop: "1.5rem" }}>
                            Varslingskanaler
                        </Heading>
                        <ChannelsList>
                            <Checkbox
                                checked={notificationChannels.email}
                                onChange={(e) => setNotificationChannels({
                                    ...notificationChannels,
                                    email: e.target.checked
                                })}
                            >
                                E-post
                            </Checkbox>
                            <Checkbox
                                checked={notificationChannels.slack}
                                onChange={(e) => setNotificationChannels({
                                    ...notificationChannels,
                                    slack: e.target.checked
                                })}
                                disabled
                            >
                                Slack (kommer snart)
                            </Checkbox>
                            <Checkbox
                                checked={notificationChannels.teams}
                                onChange={(e) => setNotificationChannels({
                                    ...notificationChannels,
                                    teams: e.target.checked
                                })}
                                disabled
                            >
                                Microsoft Teams (kommer snart)
                            </Checkbox>
                        </ChannelsList>
                    </PreferencesStep>
                )}

                {step === 'success' && (
                    <SuccessStep>
                        <Alert variant="success">
                            <Heading size="small">Abonnement opprettet!</Heading>
                            <BodyShort>
                                Du vil nå motta varsler om driftsmeldinger for de valgte tjenestene på {email}.
                            </BodyShort>
                        </Alert>
                        <BodyShort style={{ marginTop: "1rem" }}>
                            Du kan administrere eller avbryte abonnementet ditt ved å følge lenken i varslene du mottar.
                        </BodyShort>
                    </SuccessStep>
                )}
            </Modal.Body>

            <Modal.Footer>
                {step === 'email' && (
                    <>
                        <Button variant="secondary" onClick={handleClose}>Avbryt</Button>
                        <Button onClick={handleEmailSubmit} loading={loading}>
                            Send bekreftelseskode
                        </Button>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <Button variant="secondary" onClick={() => setStep('email')}>Tilbake</Button>
                        <Button onClick={handleOtpVerify} loading={loading}>
                            Bekreft kode
                        </Button>
                    </>
                )}

                {step === 'preferences' && (
                    <>
                        <Button variant="secondary" onClick={() => setStep('verify')}>Tilbake</Button>
                        <Button onClick={handleSubscriptionCreate} loading={loading}>
                            Opprett abonnement
                        </Button>
                    </>
                )}

                {step === 'success' && (
                    <Button onClick={handleClose}>Lukk</Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}

const EmailStep = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const VerifyStep = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const PreferencesStep = styled.div`
    display: flex;
    flex-direction: column;
`

const ServicesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    background: #fafafa;
`

const ChannelsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const SuccessStep = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

export default SubscriptionModal