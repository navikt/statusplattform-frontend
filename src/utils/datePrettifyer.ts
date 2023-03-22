export const datePrettifyer = (date) => {
    const convertDate = new Date(date)
    return `${
        convertDate.getDate() < 10
            ? `0${convertDate.getDate()}`
            : convertDate.getDate()
    }.${
        convertDate.getMonth() + 1 < 10
            ? `0${convertDate.getMonth() + 1}`
            : convertDate.getMonth() + 1
    }.${convertDate.getFullYear().toString().substr(-2)}  ${
        convertDate.getHours() < 10
            ? `0${convertDate.getHours()}`
            : convertDate.getHours()
    }:${
        convertDate.getMinutes() < 10
            ? `0${convertDate.getMinutes()}`
            : convertDate.getMinutes()
    }`
}
