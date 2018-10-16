type DateObj = {
    day: number,
    month: number,
    year: number
}

export const getDate = (date: DateObj): Date => date ? new Date(date.year, date.month, date.day) : null