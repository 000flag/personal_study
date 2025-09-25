"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface DataPoint {
  date: string
  value: number
}

interface D3LineChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  color?: string
  title?: string
}

export function D3LineChart({
  data,
  width = 400,
  height = 200,
  color = "hsl(var(--primary))",
  title,
}: D3LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous render

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
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
      .nice()
      .range([innerHeight, 0])

    // Create line generator
    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    // Create main group
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => ""),
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)

    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => ""),
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d")))
      .style("color", "hsl(var(--muted-foreground))")

    g.append("g").call(d3.axisLeft(yScale)).style("color", "hsl(var(--muted-foreground))")

    // Add the line
    g.append("path")
      .datum(processedData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line)

    // Add dots
    g.selectAll(".dot")
      .data(processedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 3)
      .attr("fill", color)

    // Add hover effects
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "hsl(var(--popover))")
      .style("border", "1px solid hsl(var(--border))")
      .style("border-radius", "6px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("box-shadow", "0 4px 6px -1px rgb(0 0 0 / 0.1)")
      .style("z-index", "1000")

    g.selectAll(".dot")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 5)
        tooltip
          .style("visibility", "visible")
          .html(`Date: ${d3.timeFormat("%m/%d/%Y")(d.date)}<br/>Value: ${d.value.toLocaleString()}`)
      })
      .on("mousemove", (event) => {
        tooltip.style("top", event.pageY - 10 + "px").style("left", event.pageX + 10 + "px")
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 3)
        tooltip.style("visibility", "hidden")
      })

    // Cleanup tooltip on unmount
    return () => {
      d3.select("body").selectAll(".d3-tooltip").remove()
    }
  }, [data, width, height, color])

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <svg ref={svgRef} width={width} height={height} className="w-full h-auto" style={{ maxWidth: "100%" }} />
    </div>
  )
}
