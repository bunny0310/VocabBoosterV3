import { lastDayOfWeek, startOfWeek } from "date-fns"

export const getWeekRange = (curr: Date = new Date()): Date[] => {
    const first = startOfWeek(curr, { weekStartsOn: 1 })
    const last = lastDayOfWeek(curr, { weekStartsOn: 1 })
    return [first, last]
}