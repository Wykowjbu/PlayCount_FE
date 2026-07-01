'use client'

import type { ReactNode } from 'react'
import { useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'motion/react'

const AUTH_EASE = [0.22, 1, 0.36, 1] as const
const AUTH_TRANSITION = { duration: 0.26, ease: AUTH_EASE }
const AUTH_HEIGHT_TRANSITION = { duration: 0.28, ease: AUTH_EASE }

type Direction = 1 | -1

const formVariants: Variants = {
  enter: (direction: Direction) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: Direction) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
  }),
}

function isPrimaryAuthRoute(pathname: string) {
  return pathname === '/login' || pathname === '/register'
}

function getAuthIndex(pathname: string) {
  return pathname === '/register' ? 1 : 0
}

function MobileBrand() {
  return (
    <Link
      href="/"
      aria-label="Về trang chủ"
      className="lg:hidden flex items-center gap-3 mb-8"
    >
      <div className="w-8 h-8 rounded-lg border border-gray-800 bg-gray-900 relative overflow-hidden">
        <div className="absolute w-3 h-3 left-[13px] top-1 bg-[#c7f227] rounded-full" />
        <div className="absolute w-[11px] h-[11px] left-1 top-3.5 bg-white rounded-full" />
      </div>
      <span className="text-lg font-semibold tracking-tight">PlayCourt</span>
    </Link>
  )
}

export function AuthFormPanel({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const activeAuthRoute = isPrimaryAuthRoute(pathname)

  if (!activeAuthRoute) {
    return (
      <main className="grid h-full min-h-0 place-items-center overflow-y-auto scrollbar-gutter-stable bg-white px-6 py-6">
        {children}
      </main>
    )
  }

  return (
    <main className="h-full min-h-0 overflow-y-auto scrollbar-gutter-stable bg-white px-6 py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[420px]">
        <MobileBrand />
        <AuthRouteTransition pathname={pathname}>{children}</AuthRouteTransition>
      </div>
    </main>
  )
}

function AuthRouteTransition({
  children,
  pathname,
}: {
  children: ReactNode
  pathname: string
}) {
  const currentIndex = getAuthIndex(pathname)
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(
    null,
  )
  const [height, setHeight] = useState<number>()
  const direction: Direction = currentIndex === 1 ? 1 : -1

  useLayoutEffect(() => {
    if (!contentElement) {
      return
    }

    const updateHeight = () => {
      setHeight(contentElement.offsetHeight)
    }

    updateHeight()
    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(contentElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [contentElement])

  return (
    <motion.div
      initial={false}
      animate={height === undefined ? undefined : { height }}
      transition={AUTH_HEIGHT_TRANSITION}
      className="overflow-hidden"
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={pathname}
          ref={setContentElement}
          custom={direction}
          variants={formVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={AUTH_TRANSITION}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
