type props = {
    arr: []
    find: String
    item: {
        result: String
    }[]
}

export const countStatuses = (arr, find) => {
    return arr.filter((item) => item.result === find).length
}
