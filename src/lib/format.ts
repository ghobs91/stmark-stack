export const TIME_ZONE = 'America/New_York'

export const formatDateTime = (value: string, timeZone = TIME_ZONE) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(value))

export const formatLongDate = (value: string, timeZone = TIME_ZONE) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(new Date(value))

export const formatDate = (value: string, timeZone = TIME_ZONE) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(new Date(value))

export const formatTime = (value: string, timeZone = TIME_ZONE) =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(value))
