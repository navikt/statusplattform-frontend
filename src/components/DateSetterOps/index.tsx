import { Alert } from "@navikt/ds-react"
import { useState } from "react"
import { datePrettifyer } from "../../utils/datePrettifyer"
import CustomDatePicker from "../DatePicker"

interface DateSetterI {
    startDateForActiveOpsMessage: Date
    endDateForActiveOpsMessage: Date

    handleUpdateStartDate: (event) => void
    handleUpdateEndDate: (event) => void

    handleUpdateStartHours: (event) => void
    handleUpdateStartMinutes: (event) => void
    handleUpdateEndHours: (event) => void
    handleUpdateEndMinutes: (event) => void
    showCustomDates: boolean
}

const DateSetterOps = (props: DateSetterI) => {
    const {
        startDateForActiveOpsMessage,
        endDateForActiveOpsMessage,

        handleUpdateStartDate,
        handleUpdateEndDate,

        handleUpdateStartHours,
        handleUpdateStartMinutes,
        handleUpdateEndHours,
        handleUpdateEndMinutes,
        showCustomDates,
    } = props

    const [datesPicked, setDatesPicked] = useState(false)

    return (
        <div>
            <CustomDatePicker
                handleUpdateDate={handleUpdateStartDate}
                handleUpdateHours={handleUpdateStartHours}
                handleUpdateMinutes={handleUpdateStartMinutes}
                title="Fra:"
            />
            <CustomDatePicker
                handleUpdateDate={handleUpdateEndDate}
                handleUpdateHours={handleUpdateEndHours}
                handleUpdateMinutes={handleUpdateEndMinutes}
                title="Til:"
            />
            {showCustomDates && (
                <Alert variant="info">
                    {"Driftsmeldingen blir aktiv fra " +
                        datePrettifyer(startDateForActiveOpsMessage) +
                        ", til " +
                        datePrettifyer(endDateForActiveOpsMessage)}
                </Alert>
            )}
        </div>
    )
}

export default DateSetterOps
