import { format } from "date-fns"

export function formatDate(date: Date) {
    if (!date) return
    return format(date.getTime(), "yyyy-MM-dd")
}

export function strToDate(str: string) {
    const [y, m, d] = str.split("-").map((d) => +d);
    return new Date(y, m, d);
}