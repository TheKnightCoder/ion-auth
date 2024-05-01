import * as React from 'react'
import { ActionIcon, ActionIconProps as componentProps } from '@mantine/core'
import { cn } from '../../../lib/utils'

export interface ActionIconProps extends Omit<componentProps, 'variant'> {
  variant?:
    | 'default'
    | 'filled'
    | 'light'
    | 'outline'
    | 'subtle'
    | 'transparent'
    | 'white'
  onClick?: () => void
}

interface variantStyleType {
  [key: string]: {
    variant: string
    className?: string
    classNames?: Record<string, any>
  }
}

const CustomActionIcon = React.forwardRef<HTMLButtonElement, ActionIconProps>(
  ({ children, className, classNames, variant = 'default', ...props }, ref) => {
    const baseStyle = 'rounded-lg'
    const variantStyle: variantStyleType = {
      default: {
        variant: 'default',
        className: 'bg-background hover:bg-accent hover:text-accent-foreground',
      },
      filled: {
        variant: 'filled',
      },
      light: {
        variant: 'light',
      },
      outline: {
        variant: 'outline',
      },
      subtle: {
        variant: 'subtle',
        className: 'border-0',
      },
      transparent: {
        variant: 'transparent',
      },
      white: {
        variant: 'white',
      },
    }

    return (
      <ActionIcon
        variant={variantStyle[variant]?.variant}
        className={cn(baseStyle, variantStyle[variant]?.className, className)}
        classNames={{
          ...classNames,
        }}
        ref={ref}
        {...props}
      >
        {children}
      </ActionIcon>
    )
  }
)
CustomActionIcon.displayName = ActionIcon.displayName
export { CustomActionIcon as ActionIcon }
