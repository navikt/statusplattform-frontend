import { BodyShort, Select } from "@navikt/ds-react"
import DatePicker from "react-datepicker"
import styled from "styled-components"
import { HorizontalSeparator } from "../../pages/Admin"

const DateSetterContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

interface DateSetterI {
    startDateForActiveOpsMessage: Date
    endDateForActiveOpsMessage: Date
    handleUpdateStartDate: (event) => void
    handleUpdateStartHours: (event) => void
    handleUpdateStartMinutes: (event) => void
    handleUpdateEndDate: (event) => void
    handleUpdateEndHours: (event) => void
    handleUpdateEndMinutes: (event) => void
}

const DateSetterOps = (props: DateSetterI) => {
    const minuteOptions = ["00", "15", "30", "45"]
    const hours = []

    const {
        startDateForActiveOpsMessage,
        endDateForActiveOpsMessage,
        handleUpdateStartDate,
        handleUpdateStartHours,
        handleUpdateStartMinutes,
        handleUpdateEndDate,
        handleUpdateEndHours,
        handleUpdateEndMinutes,
    } = props

    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            hours.push(`0${i}:00`)
        } else {
            hours.push(`${i}:00`)
        }
    }

    return (
        <DateSetterContainer>
            <label htmlFor="#startDate">
                <b>Startdato</b>
            </label>
            <DatePicker
                id="startDate"
                selected={startDateForActiveOpsMessage}
                onChange={handleUpdateStartDate}
            />

            <div className="input-area">
                <BodyShort>
                    <b>Startklokkeslett</b>
                </BodyShort>
                <Select label="Timer" onChange={handleUpdateStartHours}>
                    {hours.map((hour, i) => {
                        return <option key={i}>{hour}</option>
                    })}
                </Select>
                <Select label="Minutter" onChange={handleUpdateStartMinutes}>
                    {minuteOptions.map((minutes, i) => (
                        <option key={i} value={minutes}>
                            {minutes}
                        </option>
                    ))}
                </Select>
            </div>

            <HorizontalSeparator />

            <label htmlFor="#startDate">
                <b>Sluttdato</b>
            </label>
            <DatePicker
                id="startDate"
                selected={endDateForActiveOpsMessage}
                onChange={handleUpdateEndDate}
            />

            <div className="input-area">
                <BodyShort>
                    <b>Sluttklokkeslett</b>
                </BodyShort>
                <Select label="Timer" onChange={handleUpdateEndHours}>
                    {hours.map((hour, i) => {
                        return <option key={i}>{hour}</option>
                    })}
                </Select>
                <Select label="Minutter" onChange={handleUpdateEndMinutes}>
                    {minuteOptions.map((minutes, i) => (
                        <option key={i} value={minutes}>
                            {minutes}
                        </option>
                    ))}
                </Select>
            </div>
        </DateSetterContainer>
    )
}

export default DateSetterOps
