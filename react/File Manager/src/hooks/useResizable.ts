"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"

interface UseResizableProps {
    initialLeftWidth: number
    initialRightWidth: number
    minLeftWidth: number
    maxLeftWidth: number
    minRightWidth: number
    maxRightWidth: number
    minMiddleWidth: number
}

// 좌우 패널의 크기를 마우스로 드래그하여 조절할 수 있게 해 주는 React 커스텀 훅
export const useResizable = ({
    initialLeftWidth,
    initialRightWidth,
    minLeftWidth,
    maxLeftWidth,
    minRightWidth,
    maxRightWidth,
    minMiddleWidth,
}: UseResizableProps) => {
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth)
    const [rightWidth, setRightWidth] = useState(initialRightWidth)
    const [isResizing, setIsResizing] = useState<"left" | "right" | null>(null)
    const [startX, setStartX] = useState(0)
    const [startLeftWidth, setStartLeftWidth] = useState(0)
    const [startRightWidth, setStartRightWidth] = useState(0)

    const handleMouseDown = useCallback(
        (e: React.MouseEvent, side: "left" | "right") => {
            e.preventDefault()
            setIsResizing(side)
            setStartX(e.clientX)
            setStartLeftWidth(leftWidth)
            setStartRightWidth(rightWidth)
        },
        [leftWidth, rightWidth],
    )

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isResizing) return

            const deltaX = e.clientX - startX
            const containerWidth = window.innerWidth

            if (isResizing === "left") {
                const newLeftWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, startLeftWidth + deltaX))

                // 중간 패널이 최소 너비를 갖도록 보장
                const availableWidth = containerWidth - newLeftWidth - rightWidth - 8 // 리사이저용 8px
                if (availableWidth >= minMiddleWidth) {
                    setLeftWidth(newLeftWidth)
                }
            } else if (isResizing === "right") {
                const newRightWidth = Math.max(minRightWidth, Math.min(maxRightWidth, startRightWidth - deltaX))

                // 중간 패널이 최소 너비를 갖도록 보장
                const availableWidth = containerWidth - leftWidth - newRightWidth - 8 // 리사이저용 8px
                if (availableWidth >= minMiddleWidth) {
                    setRightWidth(newRightWidth)
                }
            }
        },
        [
            isResizing,
            startX,
            startLeftWidth,
            startRightWidth,
            leftWidth,
            rightWidth,
            minLeftWidth,
            maxLeftWidth,
            minRightWidth,
            maxRightWidth,
            minMiddleWidth,
        ],
    )

    const handleMouseUp = useCallback(() => {
        setIsResizing(null)
    }, [])

    useEffect(() => {
        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
            document.body.style.cursor = "col-resize"
            document.body.style.userSelect = "none"

            return () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
                document.body.style.cursor = ""
                document.body.style.userSelect = ""
            }
        }
    }, [isResizing, handleMouseMove, handleMouseUp])

    return {
        leftWidth,
        rightWidth,
        isResizing,
        handleMouseDown,
    }
}