type StatusItem = {
    result: string
}

export const countStatuses = (arr: StatusItem[], find: String) => {
    return arr.filter((item) => item.result === find).length
}
