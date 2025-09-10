import { Clock } from "@navikt/aksel-icons"
import {
    Label,
    Select,
    DatePicker,
    useDatepicker,
} from "@navikt/ds-react"

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

    handleUpdateDate: (event) => void
    handleUpdateHours: (event) => void
    handleUpdateMinutes: (event) => void
    title: string

}

const DateSetterContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
`
const CustomDatePicker = (props: DatePickerI) => {
    const {

        handleUpdateDate,
        handleUpdateHours,
        handleUpdateMinutes,

        title,
    } = props

    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        fromDate: new Date("Aug 23 2019"),
        onDateChange: (date) => handleUpdateDate(date),
    })


    return (
        <div>
            <DateSetterContainer>
                <DatePicker {...datepickerProps}>
                    <DatePicker.Input {...inputProps} label={title} />
                </DatePicker>
                <CustomTimePicker
                    handleUpdateHours={handleUpdateHours}
                    handleUpdateMinutes={handleUpdateMinutes}
                />
            </DateSetterContainer>

        </div>
    )
}

export default CustomDatePicker
