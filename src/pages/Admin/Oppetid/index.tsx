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
} from "@navikt/ds-react"
import Layout from "../../../components/Layout"
import { backendPath } from "../.."
import { Service } from "../../../types/types"

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

    const fromDatepicker = useDatepicker({
        onDateChange: setFromDate,
    })

    const toDatepicker = useDatepicker({
        onDateChange: setToDate,
    })

    useEffect(() => {
        // Use the internal API proxy to avoid CORS issues
        setLoadingServices(true)
        fetch('/sp/api/requestGateway', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'backendendpath': '/rest/Services/Minimal'
            }
        })
            .then((r) => r.json())
            .then((svc: Service[]) => {
                setServices(svc)
                setLoadingServices(false)
            })
            .catch((error) => {
                console.error('Services fetch error:', error)
                // Fallback to regular Services endpoint
                fetch('/sp/api/requestGateway', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'backendendpath': '/rest/Services'
                    }
                })
                    .then((r) => r.json())
                    .then((svc: Service[]) => {
                        setServices(svc)
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

        // Combine date with time
        const fromDateTime = new Date(fromDate)
        const [fromHours, fromMinutes] = fromTime.split(':')
        fromDateTime.setHours(parseInt(fromHours), parseInt(fromMinutes), 0, 0)

        const toDateTime = new Date(toDate)
        const [toHours, toMinutes] = toTime.split(':')
        toDateTime.setHours(parseInt(toHours), parseInt(toMinutes), 59, 999)

        const from = encodeURIComponent(fromDateTime.toISOString())
        const to = encodeURIComponent(toDateTime.toISOString())

        const resp = await fetch('/sp/api/requestGateway', {
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
    }

    return (
        <Layout>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                <Heading size="xlarge" style={{ marginBottom: "2rem" }}>Oppetidsrapport</Heading>

                <div style={{ marginBottom: "2rem" }}>
                    {loadingServices ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <Loader size="medium" title="Laster tjenester..." />
                            <span>Laster tjenester...</span>
                        </div>
                    ) : (
                        <Select
                            label="Velg tjeneste"
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            style={{ maxWidth: "400px" }}
                        >
                            <option value="">-- Velg tjeneste --</option>
                            {services.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </Select>
                    )}
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    marginBottom: "2rem",
                    maxWidth: "400px"
                }}>
                    <div>
                        <Heading size="small" style={{ marginBottom: "1rem" }}>Fra</Heading>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                            <DatePicker {...fromDatepicker.datepickerProps}>
                                <DatePicker.Input
                                    {...fromDatepicker.inputProps}
                                    label="Dato"
                                />
                            </DatePicker>
                            <TextField
                                type="time"
                                label="Tidspunkt"
                                value={fromTime}
                                style={{ maxWidth: "157px" }}
                                onChange={(e) => setFromTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Heading size="small" style={{ marginBottom: "1rem" }}>Til</Heading>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                            <DatePicker {...toDatepicker.datepickerProps}>
                                <DatePicker.Input
                                    {...toDatepicker.inputProps}
                                    label="Dato"
                                />
                            </DatePicker>
                            <TextField
                                type="time"
                                label="Tidspunkt"
                                value={toTime}
                                style={{ maxWidth: "157px" }}
                                onChange={(e) => setToTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: "3rem" }}>
                    <Button
                        onClick={fetchReport}
                        disabled={!selectedServiceId || !fromDate || !toDate}
                        variant="primary"
                        size="medium"
                    >
                        Hent rapport
                    </Button>
                </div>

                {report && (
                    <div style={{
                        backgroundColor: "var(--a-surface-subtle)",
                        padding: "2rem",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}>
                        <Heading size="medium" style={{ marginBottom: "1.5rem" }}>
                            Oppetidsrapport for {report.serviceName}
                        </Heading>
                        <Table size="medium" style={{ maxWidth: "600px" }}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Metrikk</Table.HeaderCell>
                                    <Table.HeaderCell>Verdi</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.DataCell><strong>Faktisk oppetid</strong></Table.DataCell>
                                    <Table.DataCell>{(report.sumOfActualUptime ?? 0).toLocaleString()} minutter</Table.DataCell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.DataCell><strong>Forventet oppetid</strong></Table.DataCell>
                                    <Table.DataCell>{(report.sumOfExpectedUptime ?? 0).toLocaleString()} minutter</Table.DataCell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.DataCell><strong>Oppetid %</strong></Table.DataCell>
                                    <Table.DataCell>
                                        {report.sumOfExpectedUptime && report.sumOfExpectedUptime > 0 ? (
                                            <span style={{
                                                fontSize: "1.2em",
                                                fontWeight: "bold",
                                                color: ((report.sumOfActualUptime ?? 0) / report.sumOfExpectedUptime) >= 0.99 ? "var(--a-text-success)" :
                                                    ((report.sumOfActualUptime ?? 0) / report.sumOfExpectedUptime) >= 0.95 ? "var(--a-text-warning)" :
                                                        "var(--a-text-danger)"
                                            }}>
                                                {(((report.sumOfActualUptime ?? 0) / report.sumOfExpectedUptime) * 100).toFixed(2)}%
                                            </span>
                                        ) : (
                                            <span>–</span>
                                        )}
                                    </Table.DataCell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default UptimeReportPage