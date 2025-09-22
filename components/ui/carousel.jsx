"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

function Carousel({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  React.useEffect(() => {
    if (setApi && api) setApi(api)
  }, [api, setApi])
  return (
    <CarouselContext.Provider value={{ carouselRef, api, orientation, opts, setApi, plugins }}>
      <div ref={carouselRef} className={cn("carousel", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export { Carousel, useCarousel }
