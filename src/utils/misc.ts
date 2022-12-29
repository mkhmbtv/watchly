const formatDate = (date: number) =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  }).format(date)

const formatNumberString = (str: string) =>
  Number(str).toLocaleString().replace(/,/g, ' ')

export {formatDate, formatNumberString}
