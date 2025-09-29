"use client";

import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl = "/world-110m.json";

const markers = [
  { name: "Dhaka", coordinates: [90.4125, 23.8103], color: "bg-pink-500" },
];

export default function TeamMap() {
  return (
    <section className="relative pt-16 bg-background text-foreground">
      <div className="max-w-5xl mx-auto text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Meet the Team!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-10 text-muted-foreground"
        >
          We’re a passionate global crew building the next generation of project management. 
          Come join our mission to make work easier.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto">
        <ComposableMap
          projectionConfig={{ scale: 160 }}
          width={800}
          height={400}
          className="w-full h-auto"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "var(--switch-background)",
                      stroke: "var(--color-border)",
                      strokeWidth: 0.5,
                      transition: "fill 0.3s ease, stroke 0.3s ease",
                    },
                    hover: { fill: "var(--color-muted)" },
                    pressed: { fill: "var(--color-muted)" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map(({ name, coordinates, color }, i) => (
            <Marker key={name} coordinates={coordinates}>
              <motion.circle
                r={6}
                className={`${color} stroke-white dark:stroke-gray-800 transition-colors duration-300`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2, type: "spring", stiffness: 120 }}
              />
              <text
                textAnchor="middle"
                y={-10}
                className="fill-foreground text-[10px] font-medium transition-colors duration-300"
              >
                {name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </section>
  );
}
