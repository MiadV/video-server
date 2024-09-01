import { SVGProps } from 'react'

export const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <path d="m6 3 14 9-14 9V3z" />
    </svg>
)

export const FastForwardIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <path d="m13 19 9-7-9-7v14zM2 19l9-7-9-7v14z" />
    </svg>
)

export const RewindIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <path d="m11 19-9-7 9-7v14zM22 19l-9-7 9-7v14z" />
    </svg>
)

export const PauseIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <rect width={4} height={16} x={14} y={4} rx={1} />
        <rect width={4} height={16} x={6} y={4} rx={1} />
    </svg>
)

export const CaptionOnIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <rect width={18} height={14} x={3} y={5} rx={2} ry={2} />
        <path d="M7 15h4m4 0h2M7 11h2m4 0h4" />
    </svg>
)

export const CaptionOffIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <path d="M10.5 5H19a2 2 0 0 1 2 2v8.5M17 11h-.5M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2M2 2l20 20M7 11h4M7 15h2.5" />
    </svg>
)

export const FullScreenIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <rect width={10} height={8} x={7} y={8} rx={1} />
    </svg>
)

export const MinimizeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        {...props}
    >
        <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
)

export const AnimatedLoadingSpinner = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
        <radialGradient
            id="a"
            cx={0.66}
            cy={0.313}
            fx={0.66}
            fy={0.313}
            gradientTransform="scale(1.5)"
        >
            <stop offset={0} stopColor="#FFF" />
            <stop offset={0.3} stopColor="#FFF" stopOpacity={0.9} />
            <stop offset={0.6} stopColor="#FFF" stopOpacity={0.6} />
            <stop offset={0.8} stopColor="#FFF" stopOpacity={0.3} />
            <stop offset={1} stopColor="#FFF" stopOpacity={0} />
        </radialGradient>
        <circle
            cx={100}
            cy={100}
            r={70}
            fill="none"
            stroke="url(#a)"
            strokeDasharray="200 1000"
            strokeLinecap="round"
            strokeWidth={24}
            transform-origin="center"
        >
            <animateTransform
                attributeName="transform"
                calcMode="spline"
                dur={2}
                keySplines="0 0 1 1"
                keyTimes="0;1"
                repeatCount="indefinite"
                type="rotate"
                values="360;0"
            />
        </circle>
        <circle
            cx={100}
            cy={100}
            r={70}
            fill="none"
            stroke="#FFF"
            strokeLinecap="round"
            strokeWidth={24}
            opacity={0.2}
            transform-origin="center"
        />
    </svg>
)
