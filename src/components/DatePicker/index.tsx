import { Clock } from "@navikt/ds-icons"
import {
    Alert,
    Label,
    Select,
    UNSAFE_DatePicker,
    UNSAFE_useRangeDatepicker,
} from "@navikt/ds-react"
import { DateRange } from "react-day-picker"
import { datePrettifyer } from "../../utils/datePrettifyer"
import styled from "styled-components"

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

const TimeSeparator = styled.div`
    color: black;
    margin: 0.2rem 0.7rem 0 -1.5rem;
    z-index: 100;
`

const TimeSelect = styled(Select)`
    width: 3.45rem;
    border: none;
    box-shadow: none;

    &.selectFieldMinute {
        margin-left: -0.3rem;
    }
    .navds-select__input {
        padding-left: -0.5rem;
        border: none;
    }
    .navds-select__input:focus {
        border: none;
        box-shadow: none;
        outline: none;
    }

    .navds-select__input:hover {
        border: none;
        box-shadow: none;
        outline: none;
        cursor: pointer;
    }

    .navds-select__chevron {
        display: none;
    }
`

const CustomClock = styled(Clock)`
    height: 2rem;
    margin: -0.05rem 0 0 0rem;
    z-index: 100;
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
                <TimeSeparator>
                    <Label>:</Label>
                </TimeSeparator>
                <TimeSelect
                    label="Minutter"
                    onChange={handleUpdateMinutes}
                    hideLabel
                    className="selectFieldMinute"
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
