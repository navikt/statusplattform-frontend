import {
    UNSAFE_DatePicker,
    UNSAFE_useRangeDatepicker,
    Select,
    Alert,
} from "@navikt/ds-react"
import { DateRange } from "react-day-picker"
import { datePrettifyer } from "src/utils/datePrettifyer"
import styled from "styled-components"
import { Clock } from "@navikt/ds-icons"

interface TimePickerI {
    handleUpdateHours: (event) => void
    handleUpdateMinutes: (event) => void
}

const TimePickerContainer = styled.div`
    flex-direction: row;
    display: flex;
    width: fit-content;
    padding-left: 3px;
    border-radius: var(--a-border-radius-medium);
    border: 1px solid var(--ac-select-border, var(--a-gray-500));
    margin-top: 2rem;
    padding: 0.5rem 0.8rem 0.4rem 0.45rem;
`

const TimeSelect = styled(Select)`
    width: 4rem;
    border: none;
    box-shadow: none;
    background: none;
    .navds-select__input {
        border: none;
    }
    .navds-select__input:focus {
        border: none;
        box-shadow: none;
        outline: none;
    }
`

const CustomClock = styled(Clock)`
    height: 2rem;
    margin: -0.05rem 0 0 0.3rem;
`

const CustomTimePicker = (props: TimePickerI) => {
    const { handleUpdateHours, handleUpdateMinutes } = props
    const minuteOptions = ["00", "15", "30", "45"]
    const hours = []

    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            hours.push(`0${i}`)
        } else {
            hours.push(`${i}`)
        }
    }
    return (
        <div>
            <TimePickerContainer>
                <TimeSelect
                    label="Timer"
                    onChange={handleUpdateHours}
                    hideLabel
                    className="selectField"
                    size="small"
                >
                    {hours.map((hour, i) => {
                        return <option key={i}>{hour}</option>
                    })}
                </TimeSelect>

                <TimeSelect
                    label="Minutter"
                    onChange={handleUpdateMinutes}
                    hideLabel
                    className="selectField"
                    size="small"
                >
                    {minuteOptions.map((minutes, i) => (
                        <option key={i} value={minutes}>
                            {minutes}
                        </option>
                    ))}
                </TimeSelect>
                <CustomClock />
            </TimePickerContainer>
        </div>
    )
}

interface DatePickerI {
    onRangeChange: (periode: DateRange | undefined) => void
    startDateForActiveOpsMessage: Date
    endDateForActiveOpsMessage: Date
    handleUpdateStartHours: (event) => void
    handleUpdateStartMinutes: (event) => void
    handleUpdateEndHours: (event) => void
    handleUpdateEndMinutes: (event) => void
}

const DateSetterContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
`
const CustomDatePicker = (props: DatePickerI) => {
    const {
        onRangeChange,
        startDateForActiveOpsMessage,
        endDateForActiveOpsMessage,
        handleUpdateStartHours,
        handleUpdateStartMinutes,
        handleUpdateEndHours,
        handleUpdateEndMinutes,
    } = props
    const { datepickerProps, toInputProps, fromInputProps, selectedRange } =
        UNSAFE_useRangeDatepicker({
            onRangeChange,
        })

    return (
        <div>
            <DateSetterContainer>
                <UNSAFE_DatePicker {...datepickerProps}>
                    <UNSAFE_DatePicker.Input {...fromInputProps} label="Fra" />
                </UNSAFE_DatePicker>
                <CustomTimePicker
                    handleUpdateHours={handleUpdateStartHours}
                    handleUpdateMinutes={handleUpdateStartMinutes}
                />
            </DateSetterContainer>

            <DateSetterContainer>
                <UNSAFE_DatePicker {...datepickerProps}>
                    <UNSAFE_DatePicker.Input {...toInputProps} label="Til" />
                </UNSAFE_DatePicker>
                <CustomTimePicker
                    handleUpdateHours={handleUpdateEndHours}
                    handleUpdateMinutes={handleUpdateEndMinutes}
                />
            </DateSetterContainer>

            <div>
                {selectedRange?.from && selectedRange?.to && (
                    <Alert variant="info">
                        {"Driftsmeldingen blir aktiv fra " +
                            datePrettifyer(startDateForActiveOpsMessage) +
                            ", til " +
                            datePrettifyer(endDateForActiveOpsMessage)}
                    </Alert>
                )}
            </div>
        </div>
    )
}

export default CustomDatePicker
