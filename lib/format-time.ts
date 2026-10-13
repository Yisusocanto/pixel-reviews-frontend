import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export const formatTimeAgo = (date?: Date | string | null): string => {
  if (!date) return ""
  return dayjs(date).fromNow()
}
