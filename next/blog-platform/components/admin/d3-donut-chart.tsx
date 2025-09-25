"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface DataPoint {
  name: string
  value: number
  color?: string
}

interface D3DonutChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  innerRadius?: number
  outerRadius?: number
}

export function D3DonutChart({
  data,
  width = 200,
  height = 200,
  innerRadius = 40,
  outerRadius = 80,
}: D3DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const radius = Math.min(width, height) / 2
    const adjustedInnerRadius = innerRadius
    const adjustedOuterRadius = outerRadius

    // Create pie generator
    const pie = d3
      .pie<DataPoint>()
      .value((d) => d.value)
      .sort(null)

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<DataPoint>>().innerRadius(adjustedInnerRadius).outerRadius(adjustedOuterRadius)

    // Create hover arc
    const hoverArc = d3
      .arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(adjustedInnerRadius)
      .outerRadius(adjustedOuterRadius + 5)

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(data.map((d) => d.color || d3.schemeCategory10[data.indexOf(d) % 10]))

    // Create main group
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`)

    // Create arcs
    const arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")

    // Add paths
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.name) as string)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", hoverArc)
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arc)
      })

    // Add labels
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "hsl(var(--foreground))")
      .text((d) => (d.data.value > 0 ? `${Math.round((d.data.value / d3.sum(data, (d) => d.value)) * 100)}%` : ""))

    // Add center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "hsl(var(--foreground))")
      .text(d3.sum(data, (d) => d.value).toLocaleString())

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "hsl(var(--muted-foreground))")
      .attr("dy", "1.2em")
      .text("Total")
  }, [data, width, height, innerRadius, outerRadius])

  return <svg ref={svgRef} width={width} height={height} className="w-full h-auto" style={{ maxWidth: "100%" }} />
}
