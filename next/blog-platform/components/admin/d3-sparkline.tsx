"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface DataPoint {
  date: string
  value: number
}

interface D3SparklineProps {
  data: DataPoint[]
  width?: number
  height?: number
  color?: string
  trend?: "up" | "down" | "neutral"
}

export function D3Sparkline({
  data,
  width = 100,
  height = 30,
  color = "hsl(var(--primary))",
  trend = "neutral",
}: D3SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 2, right: 2, bottom: 2, left: 2 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d")
    const processedData = data.map((d) => ({
      date: parseDate(d.date) as Date,
      value: d.value,
    }))

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(processedData, (d) => d.date) as [Date, Date])
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(processedData, (d) => d.value) as [number, number])
      .range([innerHeight, 0])

    // Create line generator
    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    // Create main group
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Determine color based on trend
    let strokeColor = color
    if (trend === "up") strokeColor = "hsl(var(--green-500))"
    if (trend === "down") strokeColor = "hsl(var(--red-500))"

    // Add the line
    g.append("path")
      .datum(processedData)
      .attr("fill", "none")
      .attr("stroke", strokeColor)
      .attr("stroke-width", 1.5)
      .attr("d", line)

    // Add area fill for positive trend
    if (trend === "up") {
      const area = d3
        .area<{ date: Date; value: number }>()
        .x((d) => xScale(d.date))
        .y0(innerHeight)
        .y1((d) => yScale(d.value))
        .curve(d3.curveMonotoneX)

      g.append("path").datum(processedData).attr("fill", strokeColor).attr("fill-opacity", 0.1).attr("d", area)
    }
  }, [data, width, height, color, trend])

  return <svg ref={svgRef} width={width} height={height} className="inline-block" />
}
