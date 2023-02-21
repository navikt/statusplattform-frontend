import { DateRange } from "react-day-picker"
import styled from "styled-components"
import CustomDatePicker from "../DatePicker"

import { useState } from "react"

const DateSetterContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`

interface DateSetterI {
    startDateForActiveOpsMessage: Date
    endDateForActiveOpsMessage: Date
    handleUpdateDates: (startDateInput: Date, endDateInput: Date) => void
    handleUpdateStartHours: (event) => void
    handleUpdateStartMinutes: (event) => void
    handleUpdateEndHours: (event) => void
    handleUpdateEndMinutes: (event) => void
}

const DateSetterOps = (props: DateSetterI) => {
    const minuteOptions = ["00", "15", "30", "45"]
    const hours = []

    const {
        startDateForActiveOpsMessage,
        endDateForActiveOpsMessage,
        handleUpdateDates,
        handleUpdateStartHours,
        handleUpdateStartMinutes,
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

    const handleSetDateRange = (selectedRange: DateRange) => {
        const startDate = selectedRange.from
        const endDate = selectedRange.to
        selectedRange
            ? handleUpdateDates(startDate, endDate)
            : handleUpdateDates(
                  startDateForActiveOpsMessage,
                  endDateForActiveOpsMessage
              )
    }

    const currentDate = new Date()
    const [value, onChange] = useState("10:00")

    return (
        <div>
            <CustomDatePicker
                onRangeChange={(periode) => {
                    if (periode) {
                        const { from: fra, to: til } = periode
                        handleUpdateDates(fra, til)
                    }
                }}
                handleUpdateStartHours={handleUpdateStartHours}
                handleUpdateEndHours={handleUpdateEndHours}
                handleUpdateStartMinutes={handleUpdateStartMinutes}
                handleUpdateEndMinutes={handleUpdateEndMinutes}
            />
        </div>
    )
}

export default DateSetterOps
