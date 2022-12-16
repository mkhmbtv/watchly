import * as React from 'react'
import {useUpdateLogEntry} from 'utils/log-entries'
import {LogEntry} from 'types/log-entry'
import {AuthUser} from 'types/user'
import {FaStar} from 'react-icons/fa'

interface Props {
  logEntry: LogEntry
  user: AuthUser
}

function Rating({logEntry, user}: Props) {
  const {mutate: update} = useUpdateLogEntry(user)

  const rootClassName = `log-entry-${logEntry.id}`

  const stars = Array.from({length: 5}).map((x, i) => {
    const ratingId = `rating-${logEntry.id}-${i}`
    const ratingValue = i + 1

    return (
      <React.Fragment key={i}>
        <input
          name={rootClassName}
          type="radio"
          id={ratingId}
          value={ratingValue}
          checked={ratingValue === logEntry.rating}
          onChange={() => {
            update({id: logEntry.id, rating: ratingValue})
          }}
          className="visually-hidden"
        />
        <label
          htmlFor={ratingId}
          className={`cursor-pointer m-0 ${
            typeof logEntry.rating === 'number' && logEntry.rating < 0
              ? 'text-gray-200'
              : 'text-orange-500'
          }`}
        >
          <span className="visually-hidden">
            {ratingValue} {ratingValue === 1 ? 'star' : 'stars'}
          </span>
          <FaStar className="w-4 mx-0.5" />
        </label>
      </React.Fragment>
    )
  })

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={`${rootClassName} inline-flex items-center`}
    >
      <span className="flex">{stars}</span>
    </div>
  )
}

export {Rating}
