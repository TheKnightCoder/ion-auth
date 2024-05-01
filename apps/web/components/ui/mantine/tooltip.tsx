import * as React from 'react'
import { Tooltip, TooltipProps as componentProps } from '@mantine/core'
import { cn } from '../../../lib/utils'

export interface TooltipProps extends componentProps {}

const CustomTooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, className, classNames, ...props }, ref) => {
    const baseStyle = 'bg-popover-foreground text-popover'
    return (
      <Tooltip
        className={cn(baseStyle, className)}
        classNames={{
          ...classNames,
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Tooltip>
    )
  }
)
CustomTooltip.displayName = Tooltip.displayName
export { CustomTooltip as Tooltip }
