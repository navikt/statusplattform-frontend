import { BodyShort, Select } from "@navikt/ds-react"
import DatePicker from "react-datepicker"
import styled from "styled-components"
import { HorizontalSeparator } from "../../pages/Admin"
import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from "@navikt/ds-react"
import { DateRange } from "react-day-picker"

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

    const { datepickerProps, toInputProps, fromInputProps, selectedRange } =
        UNSAFE_useRangeDatepicker({
            fromDate: new Date("Aug 23 2019"),
            onRangeChange: console.log,
        })

    const currentDate = new Date()

    return (
        <div>
            <UNSAFE_DatePicker
                {...datepickerProps}
                showWeekNumber
                onChange={handleSetDateRange(selectedRange)}
            >
                <DateSetterContainer>
                    <UNSAFE_DatePicker.Input {...fromInputProps} label="Fra" />
                    <UNSAFE_DatePicker.Input {...toInputProps} label="Til" />
                </DateSetterContainer>
            </UNSAFE_DatePicker>

            <div>
                {selectedRange && (
                    <div className="pt-4">
                        <div>
                            {selectedRange?.from &&
                                selectedRange.from.toDateString()}
                        </div>
                        <div>
                            {selectedRange?.to &&
                                selectedRange.to.toDateString()}
                        </div>
                    </div>
                )}
            </div>
        </div>

        // <DateSetterContainer>
        //     <label htmlFor="#startDate">
        //         <b>Startdato</b>
        //     </label>
        //     <DatePicker
        //         id="startDate"
        //         selected={startDateForActiveOpsMessage}
        //         onChange={handleUpdateStartDate}
        //     />

        //     <div className="input-area">
        //         <BodyShort>
        //             <b>Startklokkeslett</b>
        //         </BodyShort>
        //         <Select label="Timer" onChange={handleUpdateStartHours}>
        //             {hours.map((hour, i) => {
        //                 return <option key={i}>{hour}</option>
        //             })}
        //         </Select>
        //         <Select label="Minutter" onChange={handleUpdateStartMinutes}>
        //             {minuteOptions.map((minutes, i) => (
        //                 <option key={i} value={minutes}>
        //                     {minutes}
        //                 </option>
        //             ))}
        //         </Select>
        //     </div>

        //     <HorizontalSeparator />

        //     <label htmlFor="#startDate">
        //         <b>Sluttdato</b>
        //     </label>
        //     <DatePicker
        //         id="startDate"
        //         selected={endDateForActiveOpsMessage}
        //         onChange={handleUpdateEndDate}
        //     />

        //     <div className="input-area">
        //         <BodyShort>
        //             <b>Sluttklokkeslett</b>
        //         </BodyShort>
        //         <Select label="Timer" onChange={handleUpdateEndHours}>
        //             {hours.map((hour, i) => {
        //                 return <option key={i}>{hour}</option>
        //             })}
        //         </Select>
        //         <Select label="Minutter" onChange={handleUpdateEndMinutes}>
        //             {minuteOptions.map((minutes, i) => (
        //                 <option key={i} value={minutes}>
        //                     {minutes}
        //                 </option>
        //             ))}
        //         </Select>
        //     </div>
        // </DateSetterContainer>
    )
}

export default DateSetterOps
