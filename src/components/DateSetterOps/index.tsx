import CustomDatePicker from "../DatePicker"

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
    const {
        startDateForActiveOpsMessage,
        endDateForActiveOpsMessage,
        handleUpdateDates,
        handleUpdateStartHours,
        handleUpdateStartMinutes,
        handleUpdateEndHours,
        handleUpdateEndMinutes,
    } = props

    return (
        <div>
            <CustomDatePicker
                onRangeChange={(periode) => {
                    if (periode) {
                        const { from: fra, to: til } = periode
                        handleUpdateDates(fra, til)
                    }
                }}
                startDateForActiveOpsMessage={startDateForActiveOpsMessage}
                endDateForActiveOpsMessage={endDateForActiveOpsMessage}
                handleUpdateStartHours={handleUpdateStartHours}
                handleUpdateEndHours={handleUpdateEndHours}
                handleUpdateStartMinutes={handleUpdateStartMinutes}
                handleUpdateEndMinutes={handleUpdateEndMinutes}
            />
        </div>
    )
}

export default DateSetterOps
