import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {CircleButton} from './button'

import {
  FaEye,
  FaEyeSlash,
  FaHeart,
  FaHeartBroken,
  FaPlusCircle,
  FaMinusCircle,
} from 'react-icons/fa'

type TooltipButtonProps = {
  label: string
  icon: React.ReactElement
}

function TooltipButton({label, icon, ...rest}: TooltipButtonProps) {
  return (
    <Tooltip label={label}>
      <CircleButton className="bg-white hover:text-orange-500" {...rest}>
        {icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons() {
  const logEntry = {
    exist: true,
    watchedDate: true,
    favorite: true,
  }

  return (
    <React.Fragment>
      {logEntry.exist ? (
        logEntry.watchedDate ? (
          <TooltipButton label="Unmark as watched" icon={<FaEyeSlash />} />
        ) : (
          <TooltipButton label="Mark as watched" icon={<FaEye />} />
        )
      ) : null}
      {logEntry.exist ? (
        logEntry.favorite ? (
          <TooltipButton label="Unmark as favorite" icon={<FaHeartBroken />} />
        ) : (
          <TooltipButton label="Mark as favorite" icon={<FaHeart />} />
        )
      ) : null}
      {logEntry.exist ? (
        <TooltipButton label="Remove from list" icon={<FaMinusCircle />} />
      ) : (
        <TooltipButton label="Add to watchlist" icon={<FaPlusCircle />} />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
