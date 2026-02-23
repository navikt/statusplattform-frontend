import { useState, useEffect } from "react"
import styled from "styled-components"
import { Modal, Button, TextField, Checkbox, Alert, Heading, BodyShort } from "@navikt/ds-react"
import { Service } from "../../types/types"
import { UserData } from "../../types/userData"

interface SubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
    services: Service[]
    user?: UserData
}

const SubscriptionModal = ({ isOpen, onClose, services, user }: SubscriptionModalProps) => {
    const isInternalUser = !!(user && user.navIdent)
    const [email, setEmail] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [notificationChannels, setNotificationChannels] = useState({
        email: true,
        slack: false,
        teams: false,
    })
    const [step, setStep] = useState<'email' | 'verify' | 'preferences' | 'success'>('email')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // For internal users, skip to preferences step with their email
    useEffect(() => {
        if (isInternalUser && isOpen) {
            setEmail(user?.navIdent + "@nav.no")
            setStep('preferences')
            setSelectedServices(services.map(s => s.id || ''))
        }
    }, [isInternalUser, isOpen])

    const handleEmailSubmit = async () => {
        if (!email || !isValidEmail(email)) {
            setError("Vennligst oppgi en gyldig e-postadresse")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await fetch('/api/subscriptions/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (response.ok) {
                setStep('verify')
            } else {
                const data = await response.json().catch(() => ({}))
                setError(data.message || "Kunne ikke sende bekreftelseskode. Prøv igjen.")
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
                body: JSON.stringify({ email, code: otpCode })
            })

            if (response.ok) {
                setStep('preferences')
                setSelectedServices(services.map(s => s.id || ''))
            } else {
                const data = await response.json().catch(() => ({}))
                setError(data.message || "Ugyldig kode. Prøv igjen.")
            }
        } catch {
            setError("En feil oppstod. Prøv igjen senere.")
        } finally {
            setLoading(false)
        }
    }

    const handleSubscriptionCreate = async () => {
        if (selectedServices.length === 0) {
            setError("Velg minst en tjeneste a abonnere pa")
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
                    serviceIds: selectedServices,
                    isInternal: isInternalUser
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
        setStep(isInternalUser ? 'preferences' : 'email')
        if (!isInternalUser) setEmail("")
        setOtpCode("")
        setSelectedServices([])
        setError("")
        onClose()
    }

    const isValidEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    return (
        <Modal open={isOpen} onClose={handleClose} header={{ heading: "Abonner pa statusoppdateringer" }}>
            <Modal.Body>
                {error && (
                    <Alert variant="error" style={{ marginBottom: "1rem" }}>
                        {error}
                    </Alert>
                )}

                {step === 'email' && (
                    <EmailStep>
                        <BodyShort spacing>
                            Fa varsler om driftsmeldinger og planlagt vedlikehold direkte i innboksen din.
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
                            Oppgi koden under for a bekrefte e-postadressen din.
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
                        {isInternalUser && (
                            <BodyShort spacing>
                                Logget inn som <strong>{user?.name || user?.navIdent}</strong>. Varsler sendes til {email}.
                            </BodyShort>
                        )}
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
                                Du vil na motta varsler om driftsmeldinger for de valgte tjenestene pa {email}.
                            </BodyShort>
                        </Alert>
                        <BodyShort style={{ marginTop: "1rem" }}>
                            Du kan administrere eller avbryte abonnementet ditt ved a folge lenken i varslene du mottar.
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
                        {!isInternalUser && (
                            <Button variant="secondary" onClick={() => setStep('verify')}>Tilbake</Button>
                        )}
                        <Button variant="secondary" onClick={handleClose}>Avbryt</Button>
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
