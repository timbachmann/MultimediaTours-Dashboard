import clsx from 'clsx'
import React from 'react'
import { Box, styled } from '@mui/material'

const StyledBox = styled(Box)(({ texttransformstyle, ellipsis }) => ({
    textTransform: texttransformstyle || 'none',
    whiteSpace: ellipsis ? 'nowrap' : 'normal',
    overflow: ellipsis ? 'hidden' : '',
    textOverflow: ellipsis ? 'ellipsis' : '',
    // color: theme.palette.primary.contrastText,
}))

export const H1 = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({ [className || '']: true })}
            component="h1"
            mb={0}
            mt={0}
            fontSize="28px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const H2 = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({ [className || '']: true })}
            component="h2"
            mb={0}
            mt={0}
            fontSize="24px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const H3 = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({ [className || '']: true })}
            component="h3"
            mb={0}
            mt={0}
            fontSize="18px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const H4 = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="h4"
            mb={0}
            mt={0}
            fontSize="16px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const H5 = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="h5"
            mb={0}
            mt={0}
            fontSize="14px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const H6 = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="h6"
            mb={0}
            mt={0}
            fontSize="13px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const Paragraph = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="p"
            mb={0}
            mt={0}
            fontSize="14px"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const Small = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="small"
            fontSize="12px"
            fontWeight="500"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const Span = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="span"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}

export const Tiny = ({
    children,
    className,
    ellipsis,
    textTransform,
    ...props
}) => {
    return (
        <StyledBox
            texttransformstyle={textTransform}
            ellipsis={ellipsis}
            className={clsx({
                [className || '']: true,
            })}
            component="small"
            fontSize="10px"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    )
}
