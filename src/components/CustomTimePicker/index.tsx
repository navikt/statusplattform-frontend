import { Clock } from "@navikt/aksel-icons"
import { BodyShort, Select } from "@navikt/ds-react"
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

export default CustomTimePicker
