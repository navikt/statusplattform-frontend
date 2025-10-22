import { useEffect, useState } from "react"
import {
    Heading,
    Select,
    Button,
    Table,
    DatePicker,
    useDatepicker,
    TextField,
    Loader,
    BodyShort,
    Label,
    Panel,
} from "@navikt/ds-react"
import styled from "styled-components"
import Layout from "../../../components/Layout"
import { backendPath } from "../.."
import { Service } from "../../../types/types"
import { CheckmarkCircleIcon, XMarkOctagonIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'

interface UptimeData {
    serviceId: string
    serviceName: string
    sumOfActualUptime: number
    sumOfExpectedUptime: number
}

const UptimeReportPage = () => {
    const [services, setServices] = useState<Service[]>([])
    const [selectedServiceId, setSelectedServiceId] = useState("")
    const [fromDate, setFromDate] = useState<Date | undefined>()
    const [toDate, setToDate] = useState<Date | undefined>()
    const [fromTime, setFromTime] = useState("00:00")
    const [toTime, setToTime] = useState("23:59")
    const [report, setReport] = useState<UptimeData | null>(null)
    const [loadingServices, setLoadingServices] = useState(true)
    const [loadingReport, setLoadingReport] = useState(false)

    const fromDatepicker = useDatepicker({
        onDateChange: setFromDate,
    })

    const toDatepicker = useDatepicker({
        onDateChange: setToDate,
    })

    useEffect(() => {
        setLoadingServices(true)
        fetch('/api/requestGateway', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'backendendpath': '/rest/Services/Minimal'
            }
        })
            .then((r) => r.json())
            .then((svc: Service[]) => {
                setServices(svc.sort((a, b) => a.name.localeCompare(b.name)))
                setLoadingServices(false)
            })
            .catch((error) => {
                console.error('Services fetch error:', error)
                fetch('/api/requestGateway', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'backendendpath': '/rest/Services'
                    }
                })
                    .then((r) => r.json())
                    .then((svc: Service[]) => {
                        setServices(svc.sort((a, b) => a.name.localeCompare(b.name)))
                        setLoadingServices(false)
                    })
                    .catch((fallbackError) => {
                        console.error('Fallback fetch error:', fallbackError)
                        setLoadingServices(false)
                    })
            })
    }, [])

    const fetchReport = async () => {
        if (!selectedServiceId || !fromDate || !toDate) return

        setLoadingReport(true)

        const fromDateTime = new Date(fromDate)
        const [fromHours, fromMinutes] = fromTime.split(':')
        fromDateTime.setHours(parseInt(fromHours), parseInt(fromMinutes), 0, 0)

        const toDateTime = new Date(toDate)
        const [toHours, toMinutes] = toTime.split(':')
        toDateTime.setHours(parseInt(toHours), parseInt(toMinutes), 59, 999)

        const from = encodeURIComponent(fromDateTime.toISOString())
        const to = encodeURIComponent(toDateTime.toISOString())

        try {
            const resp = await fetch('/api/requestGateway', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'backendendpath': `/rest/UpTime/${selectedServiceId}?From=${from}&To=${to}`
                }
            })
            const json = await resp.json()
            const svc = services.find((s) => s.id === selectedServiceId)
            setReport({
                serviceId: selectedServiceId,
                serviceName: svc?.name ?? "–",
                sumOfActualUptime: json.sumOfActualUptime,
                sumOfExpectedUptime: json.sumOfExpectedUptime,
            })
        } catch (error) {
            console.error('Error fetching report:', error)
        } finally {
            setLoadingReport(false)
        }
    }

    const calculateUptimePercentage = () => {
        if (!report || !report.sumOfExpectedUptime || report.sumOfExpectedUptime === 0) return 0
        return ((report.sumOfActualUptime ?? 0) / report.sumOfExpectedUptime) * 100
    }

    const getUptimeStatus = (percentage: number) => {
        if (percentage >= 99) return { color: 'success', icon: <CheckmarkCircleIcon />, label: 'Utmerket' }
        if (percentage >= 95) return { color: 'warning', icon: <ExclamationmarkTriangleIcon />, label: 'Akseptabel' }
        return { color: 'danger', icon: <XMarkOctagonIcon />, label: 'Kritisk' }
    }

    const formatMinutesToReadable = (minutes: number) => {
        const days = Math.floor(minutes / (60 * 24))
        const hours = Math.floor((minutes % (60 * 24)) / 60)
        const mins = Math.floor(minutes % 60)

        const parts = []
        if (days > 0) parts.push(`${days}d`)
        if (hours > 0) parts.push(`${hours}t`)
        if (mins > 0) parts.push(`${mins}m`)

        return parts.length > 0 ? parts.join(' ') : '0m'
    }

    const uptimePercentage = calculateUptimePercentage()
    const status = getUptimeStatus(uptimePercentage)
    const downtimeMinutes = report ? (report.sumOfExpectedUptime ?? 0) - (report.sumOfActualUptime ?? 0) : 0

    return (
        <Layout>
            <Container>
                <Header>
                    <Heading size="xlarge">Oppetidsrapport</Heading>
                    <BodyShort size="large" style={{ color: 'var(--a-text-subtle)' }}>
                        Analyser oppetid og nedetid for tjenester over en gitt periode
                    </BodyShort>
                </Header>

                <FormSection>
                    <FormCard>
                        <Heading size="medium" style={{ marginBottom: "1.5rem" }}>
                            Rapportparametere
                        </Heading>

                        <FormGrid>
                            <FormField>
                                <Label>Tjeneste</Label>
                                {loadingServices ? (
                                    <LoaderContainer>
                                        <Loader size="small" />
                                        <span>Laster tjenester...</span>
                                    </LoaderContainer>
                                ) : (
                                    <Select
                                        label=""
                                        hideLabel
                                        value={selectedServiceId}
                                        onChange={(e) => setSelectedServiceId(e.target.value)}
                                    >
                                        <option value="">-- Velg tjeneste --</option>
                                        {services.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </Select>
                                )}
                            </FormField>

                            <DateTimeGroup>
                                <FormField>
                                    <Label>Fra dato</Label>
                                    <DatePicker {...fromDatepicker.datepickerProps}>
                                        <DatePicker.Input
                                            {...fromDatepicker.inputProps}
                                            label=""
                                            hideLabel
                                        />
                                    </DatePicker>
                                </FormField>
                                <FormField style={{ maxWidth: "157px" }}>
                                    <Label>Tidspunkt</Label>
                                    <TextField
                                        type="time"
                                        label=""
                                        hideLabel
                                        value={fromTime}
                                        onChange={(e) => setFromTime(e.target.value)}
                                    />
                                </FormField>
                            </DateTimeGroup>

                            <DateTimeGroup>
                                <FormField>
                                    <Label>Til dato</Label>
                                    <DatePicker {...toDatepicker.datepickerProps}>
                                        <DatePicker.Input
                                            {...toDatepicker.inputProps}
                                            label=""
                                            hideLabel
                                        />
                                    </DatePicker>
                                </FormField>
                                <FormField style={{ maxWidth: "157px" }}>
                                    <Label>Tidspunkt</Label>
                                    <TextField
                                        type="time"
                                        label=""
                                        hideLabel
                                        value={toTime}
                                        onChange={(e) => setToTime(e.target.value)}
                                    />
                                </FormField>
                            </DateTimeGroup>
                        </FormGrid>

                        <Button
                            onClick={fetchReport}
                            disabled={!selectedServiceId || !fromDate || !toDate || loadingReport}
                            variant="primary"
                            size="medium"
                            loading={loadingReport}
                            style={{ marginTop: "1.5rem" }}
                        >
                            Generer rapport
                        </Button>
                    </FormCard>
                </FormSection>

                {report && (
                    <ResultSection>
                        <Heading size="large" style={{ marginBottom: "1.5rem" }}>
                            Rapport for {report.serviceName}
                        </Heading>

                        <StatsGrid>
                            <StatCard $status={status.color}>
                                <StatIcon>{status.icon}</StatIcon>
                                <StatContent>
                                    <StatLabel>Oppetidsprosent</StatLabel>
                                    <StatValue>{uptimePercentage.toFixed(2)}%</StatValue>
                                    <StatSubtext>{status.label}</StatSubtext>
                                </StatContent>
                            </StatCard>

                            <StatCard>
                                <StatContent>
                                    <StatLabel>Faktisk oppetid</StatLabel>
                                    <StatValue>{formatMinutesToReadable(report.sumOfActualUptime ?? 0)}</StatValue>
                                    <StatSubtext>{((report.sumOfActualUptime ?? 0)).toLocaleString('nb-NO')} minutter</StatSubtext>
                                </StatContent>
                            </StatCard>

                            <StatCard>
                                <StatContent>
                                    <StatLabel>Forventet oppetid</StatLabel>
                                    <StatValue>{formatMinutesToReadable(report.sumOfExpectedUptime ?? 0)}</StatValue>
                                    <StatSubtext>{(report.sumOfExpectedUptime ?? 0).toLocaleString('nb-NO')} minutter</StatSubtext>
                                </StatContent>
                            </StatCard>

                            <StatCard>
                                <StatContent>
                                    <StatLabel>Total nedetid</StatLabel>
                                    <StatValue $error>{formatMinutesToReadable(downtimeMinutes)}</StatValue>
                                    <StatSubtext>{(downtimeMinutes).toLocaleString('nb-NO')} minutter</StatSubtext>
                                </StatContent>
                            </StatCard>
                        </StatsGrid>

                        <ProgressCard>
                            <ProgressHeader>
                                <Heading size="small">Oppetidsvisualisering</Heading>
                                <BodyShort>{uptimePercentage.toFixed(2)}%</BodyShort>
                            </ProgressHeader>
                            <ProgressBarContainer>
                                <ProgressBarFill
                                    $percentage={uptimePercentage}
                                    $status={status.color}
                                />
                            </ProgressBarContainer>
                            <ProgressLabels>
                                <ProgressLabel>
                                    <ProgressDot $color="var(--a-surface-success)" />
                                    <span>Oppetid</span>
                                </ProgressLabel>
                                <ProgressLabel>
                                    <ProgressDot $color="var(--a-surface-danger)" />
                                    <span>Nedetid</span>
                                </ProgressLabel>
                            </ProgressLabels>
                        </ProgressCard>
                    </ResultSection>
                )}
            </Container>
        </Layout>
    )
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Header = styled.div`
  margin-bottom: 3rem;
  padding: 2rem 0;

  h1 {
    background: linear-gradient(135deg, #0067c5 0%, #003d73 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
`

const FormSection = styled.div`
  margin-bottom: 3rem;
`

const FormCard = styled(Panel)`
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  border: 1px solid rgba(0, 103, 197, 0.1);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 103, 197, 0.04);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.12),
      0 4px 16px rgba(0, 103, 197, 0.08);
    transform: translateY(-2px);
  }
`

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const DateTimeGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
`

const ResultSection = styled.div`
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h2 {
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #0067c5;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled(Panel)<{ $status?: string }>`
  padding: 2rem;
  background: ${props => {
    if (props.$status === 'success') return 'linear-gradient(135deg, rgba(6, 122, 69, 0.03) 0%, rgba(255, 255, 255, 0.98) 100%)'
    if (props.$status === 'warning') return 'linear-gradient(135deg, rgba(236, 116, 0, 0.03) 0%, rgba(255, 255, 255, 0.98) 100%)'
    if (props.$status === 'danger') return 'linear-gradient(135deg, rgba(199, 16, 30, 0.03) 0%, rgba(255, 255, 255, 0.98) 100%)'
    return 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)'
  }};
  border: 1px solid ${props => {
    if (props.$status === 'success') return 'rgba(6, 122, 69, 0.2)'
    if (props.$status === 'warning') return 'rgba(236, 116, 0, 0.2)'
    if (props.$status === 'danger') return 'rgba(199, 16, 30, 0.2)'
    return 'rgba(0, 103, 197, 0.1)'
  }};
  border-radius: 16px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  ${props => props.$status && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: ${
        props.$status === 'success' ? 'linear-gradient(180deg, var(--a-green-600) 0%, var(--a-green-500) 100%)' :
        props.$status === 'warning' ? 'linear-gradient(180deg, var(--a-orange-600) 0%, var(--a-orange-500) 100%)' :
        'linear-gradient(180deg, var(--a-red-600) 0%, var(--a-red-500) 100%)'
      };
    }
  `}

  &:hover {
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.12),
      0 4px 16px rgba(0, 103, 197, 0.08);
    transform: translateY(-4px) scale(1.02);
    border-color: ${props => {
      if (props.$status === 'success') return 'rgba(6, 122, 69, 0.4)'
      if (props.$status === 'warning') return 'rgba(236, 116, 0, 0.4)'
      if (props.$status === 'danger') return 'rgba(199, 16, 30, 0.4)'
      return 'rgba(0, 103, 197, 0.2)'
    }};
  }
`

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: var(--a-icon-success);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(6, 122, 69, 0.1) 0%, rgba(6, 122, 69, 0.05) 100%);
`

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`

const StatLabel = styled(BodyShort)`
  color: var(--a-text-subtle);
  font-size: 0.875rem;
  font-weight: 500;
`

const StatValue = styled.div<{ $error?: boolean }>`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.$error ? 'var(--a-text-danger)' : 'var(--a-text-default)'};
  line-height: 1.1;
  letter-spacing: -0.02em;

  ${props => props.$error && `
    background: linear-gradient(135deg, #c7101e 0%, #a30c18 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
`

const StatSubtext = styled(BodyShort)`
  color: var(--a-text-subtle);
  font-size: 0.8125rem;
  font-weight: 500;
`

const ProgressCard = styled(Panel)`
  padding: 2.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  border: 1px solid rgba(0, 103, 197, 0.1);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 103, 197, 0.04);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.12),
      0 4px 16px rgba(0, 103, 197, 0.08);
  }
`

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 100%);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
    border-radius: 20px 20px 0 0;
    pointer-events: none;
  }
`

const ProgressBarFill = styled.div<{ $percentage: number; $status: string }>`
  height: 100%;
  width: ${props => Math.min(props.$percentage, 100)}%;
  background: ${props => {
    if (props.$status === 'success') return 'linear-gradient(90deg, #067a45 0%, #06a35b 50%, #067a45 100%)'
    if (props.$status === 'warning') return 'linear-gradient(90deg, #ec7400 0%, #ff9533 50%, #ec7400 100%)'
    return 'linear-gradient(90deg, #c7101e 0%, #e71929 50%, #c7101e 100%)'
  }};
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 4px 16px ${props => {
      if (props.$status === 'success') return 'rgba(6, 122, 69, 0.4)'
      if (props.$status === 'warning') return 'rgba(236, 116, 0, 0.4)'
      return 'rgba(199, 16, 30, 0.4)'
    }};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
    border-radius: 20px 20px 0 0;
  }

  @keyframes shimmer {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`

const ProgressLabels = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`

const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--a-text-subtle);
`

const ProgressDot = styled.div<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.$color};
  box-shadow: 0 2px 8px ${props => props.$color}40;
  border: 2px solid white;
`

export default UptimeReportPage
