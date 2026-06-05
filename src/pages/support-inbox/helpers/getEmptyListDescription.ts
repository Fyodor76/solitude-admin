import { SUPPORT_INBOX_COPY } from '../constants'

export function getEmptyListDescription(searchQuery: string, isClosedTab: boolean): string {
  if (searchQuery.trim()) {
    return SUPPORT_INBOX_COPY.EMPTY_SEARCH
  }

  return isClosedTab ? SUPPORT_INBOX_COPY.EMPTY_CLOSED : SUPPORT_INBOX_COPY.EMPTY_ACTIVE
}
