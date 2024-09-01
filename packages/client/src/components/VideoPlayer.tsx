import React from 'react'
import {
    AnimatedLoadingSpinner,
    CaptionOffIcon,
    CaptionOnIcon,
    FastForwardIcon,
    FullScreenIcon,
    MinimizeIcon,
    PauseIcon,
    PlayIcon,
    RewindIcon,
} from '../assets/Icons'
import { cn, formatDuration, getCellCoords } from '../helper'

interface VideoPlayerProps {
    className?: string
    src: string
    captionURL?: string
    previewURL: string
    metaData: {
        title: string
        description: string
    }
}

const initialState = {
    isPlaying: false,
    isBuffering: false,
    isCaptionOn: true,
    isFullScreen: false,
}

type State = typeof initialState

type Action = {
    type:
        | 'play'
        | 'pause'
        | 'buffer'
        | 'endBuffer'
        | 'toggleCaption'
        | 'toggleFullScreen'
}

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'play':
            return { ...state, isPlaying: true }
        case 'pause':
            return { ...state, isPlaying: false }
        case 'buffer':
            return { ...state, isBuffering: true }
        case 'endBuffer':
            return { ...state, isBuffering: false }
        case 'toggleCaption':
            return { ...state, isCaptionOn: !state.isCaptionOn }
        case 'toggleFullScreen':
            return { ...state, isFullScreen: !state.isFullScreen }
        default:
            return state
    }
}

export function VideoPlayer({
    className,
    src,
    captionURL,
    previewURL,
    metaData,
}: VideoPlayerProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    const { isPlaying, isBuffering, isCaptionOn, isFullScreen } = state

    const containerRef = React.useRef<HTMLDivElement>(null)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const timelineRef = React.useRef<HTMLDivElement>(null)
    const durationRef = React.useRef<HTMLSpanElement>(null)
    const elapsedTimeRef = React.useRef<HTMLSpanElement>(null)
    const elapsedBarRef = React.useRef<HTMLDivElement>(null)
    const knobRef = React.useRef<HTMLDivElement>(null)
    const bufferBarRef = React.useRef<HTMLDivElement>(null)
    const thumbsRef = React.useRef<HTMLImageElement>(null)

    React.useEffect(() => {
        const video = videoRef.current

        if (!video) return

        const onWaiting = () => {
            dispatch({ type: 'buffer' })
        }
        video.addEventListener('waiting', onWaiting)

        const onPlaying = () => {
            dispatch({ type: 'play' })
            dispatch({ type: 'endBuffer' })
        }
        video.addEventListener('playing', onPlaying)

        const onPause = () => {
            dispatch({ type: 'pause' })
        }
        video.addEventListener('pause', onPause)

        const onLoadedMetadata = () => {
            const durationPlaceholder = durationRef?.current
            if (!durationPlaceholder) return
            durationPlaceholder.textContent = formatDuration(video.duration)

            const elapsedBar = elapsedBarRef?.current
            if (!elapsedBar) return
            elapsedBar.setAttribute('aria-valuemax', video.duration.toString())
        }
        video.addEventListener('loadedmetadata', onLoadedMetadata)

        const onTimeUpdate = () => {
            const elapsedTimePlaceholder = elapsedTimeRef?.current
            if (!elapsedTimePlaceholder) return
            elapsedTimePlaceholder.textContent = formatDuration(
                video.currentTime
            )

            const elapsedPercentage = (video.currentTime / video.duration) * 100

            const elapsedBar = elapsedBarRef?.current
            if (!elapsedBar) return
            elapsedBar.style.width = `${elapsedPercentage}%`
            elapsedBar.setAttribute(
                'aria-valuenow',
                video.currentTime.toString()
            )

            const knob = knobRef?.current
            if (!knob) return
            knob.style.left = `${elapsedPercentage}%`
        }
        video.addEventListener('timeupdate', onTimeUpdate)

        const onEnded = () => {
            dispatch({ type: 'pause' })
        }
        video.addEventListener('ended', onEnded)

        const handleBuffering = () => {
            if (video.buffered.length === 0) return
            const bufferedEnd = video.buffered.end(video.buffered.length - 1)
            if (video.duration > 0) {
                const bufferBar = bufferBarRef.current
                if (!bufferBar) return
                bufferBar.style.width = `${
                    (bufferedEnd / video.duration) * 100
                }%`
            }
        }
        video.addEventListener('progress', handleBuffering)

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case ' ':
                    if (video.paused) {
                        video.play()
                    } else {
                        video.pause()
                    }

                    break
                case 'f':
                    if (document.fullscreenElement) {
                        document.exitFullscreen()
                    } else {
                        containerRef.current?.requestFullscreen()
                    }

                    dispatch({ type: 'toggleFullScreen' })
                    break
                case 'ArrowRight':
                    video.currentTime += 5
                    break
                case 'ArrowLeft':
                    video.currentTime -= 5
                    break
            }
        }
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            video.removeEventListener('waiting', onWaiting)
            video.removeEventListener('playing', onPlaying)
            video.removeEventListener('pause', onPause)
            video.removeEventListener('loadedmetadata', onLoadedMetadata)
            video.removeEventListener('timeupdate', onTimeUpdate)
            video.removeEventListener('ended', onEnded)
            video.removeEventListener('progress', handleBuffering)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    /**
     * Handle timeline drag
     */
    React.useEffect(() => {
        const video = videoRef.current
        const timeline = timelineRef.current

        if (!video || !timeline) return

        const handleDrag = (e: MouseEvent) => {
            const rect = timeline.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = (x / rect.width) * 100
            const time = (percentage / 100) * video.duration
            video.currentTime = time
        }

        timeline.addEventListener('mousedown', (e) => {
            handleDrag(e)
            window.addEventListener('mousemove', handleDrag)
        })

        window.addEventListener('mouseup', () => {
            window.removeEventListener('mousemove', handleDrag)
        })

        return () => {
            window.removeEventListener('mouseup', () => {
                window.removeEventListener('mousemove', handleDrag)
            })

            timeline.removeEventListener('mousedown', (e) => {
                handleDrag(e)
                window.removeEventListener('mousemove', handleDrag)
            })
        }
    }, [])

    /**
     * handle thumbnail on timeline hover
     */
    React.useEffect(() => {
        const timeline = timelineRef.current
        const thumbs = thumbsRef.current

        if (!timeline || !thumbs) return

        const mouseEnter = () => {
            thumbs.style.display = 'block'
        }
        timeline.addEventListener('mouseenter', mouseEnter)

        const mouseMove = (e: MouseEvent) => {
            const rect = timeline.getBoundingClientRect()
            const percentage =
                (Math.min(Math.max(0, e.clientX - rect.x), rect.width) /
                    rect.width) *
                100

            thumbs.style.left = `${percentage}%`

            const cellCoords = getCellCoords(Number(percentage.toFixed(0)))
            thumbs.style.objectPosition = `-${cellCoords.x}px -${cellCoords.y}px`
        }
        timeline.addEventListener('mousemove', mouseMove)

        const mouseLeave = () => {
            thumbs.style.display = 'none'
        }
        timeline.addEventListener('mouseleave', mouseLeave)

        return () => {
            timeline.removeEventListener('mouseenter', mouseEnter)
            timeline.removeEventListener('mousemove', mouseMove)
            timeline.removeEventListener('mouseleave', mouseLeave)
        }
    }, [])

    /**
     * Load video on src change
     */
    React.useEffect(() => {
        videoRef.current?.load()

        const knob = knobRef?.current
        if (!knob) return
        knob.style.left = `${0}%`

        const elapsedBar = elapsedBarRef?.current
        if (!elapsedBar) return
        elapsedBar.style.width = `${0}%`
        elapsedBar.setAttribute('aria-valuenow', '0')

        dispatch({ type: 'pause' })
    }, [src])

    function handlePlayPause() {
        if (isPlaying) {
            videoRef.current?.pause()
        } else {
            videoRef.current?.play()
        }

        dispatch({ type: isPlaying ? 'pause' : 'play' })
    }

    function handleToggleFullScreen() {
        if (isFullScreen) {
            document.exitFullscreen()
        } else {
            containerRef.current?.requestFullscreen()
        }

        dispatch({ type: 'toggleFullScreen' })
    }

    function handleFastForward() {
        const video = videoRef.current
        if (!video) return

        video.currentTime += 5
    }

    function handleRewind() {
        const video = videoRef.current
        if (!video) return

        video.currentTime -= 5
    }

    function handleToggleCaption() {
        const video = videoRef.current
        if (!video || !captionURL) return

        if (isCaptionOn) {
            video.textTracks[0].mode = 'hidden'
        } else {
            video.textTracks[0].mode = 'showing'
        }

        dispatch({ type: 'toggleCaption' })
    }

    return (
        <div
            ref={containerRef}
            id="player-wrapper"
            className={cn(
                'group relative grid place-items-center overflow-hidden rounded-lg bg-gray-800 shadow-2xl shadow-slate-400',
                className
            )}
        >
            <video
                className="block aspect-auto w-full"
                crossOrigin="anonymous"
                ref={videoRef}
            >
                <source src={src} type="video/mp4" />
                {captionURL && (
                    <track
                        src={captionURL}
                        kind="captions"
                        srcLang="en"
                        label="English"
                        draggable="true"
                        default={isCaptionOn}
                    />
                )}
                Browser does not support video tag
            </video>

            {/* Backdrop */}
            <span
                id="backdrop"
                className={cn(
                    'absolute inset-0 bg-gray-900/20',
                    isPlaying &&
                        'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                )}
            ></span>

            {/* Info */}
            <div
                id="info"
                className={cn(
                    'absolute left-4 top-4 max-w-xs rounded-lg bg-slate-900/40 p-3 text-white/90 backdrop-blur-md',
                    isPlaying &&
                        'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                )}
            >
                <p id="title" className="text-sm font-bold">
                    {metaData.title}
                </p>
                <p id="description" className="text-xs">
                    {metaData.description}
                </p>
            </div>

            {/* Center Controls */}
            <div
                id="controls-center"
                className={cn(
                    'absolute inset-0 flex items-center justify-center gap-4',
                    isPlaying &&
                        'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                )}
            >
                {isBuffering ? (
                    <AnimatedLoadingSpinner width={48} height={48} />
                ) : (
                    <>
                        <PrimaryButton onClick={handleRewind}>
                            <RewindIcon />
                            <span className="sr-only">rewind</span>
                        </PrimaryButton>
                        <PrimaryButton
                            className="scale-125"
                            onClick={handlePlayPause}
                        >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            <span className="sr-only">play/pause</span>
                        </PrimaryButton>
                        <PrimaryButton onClick={handleFastForward}>
                            <FastForwardIcon />
                            <span className="sr-only">fast-forward</span>
                        </PrimaryButton>
                    </>
                )}
            </div>

            {/* Bottom Controls */}
            <div
                id="controls-bottom"
                className={cn(
                    'absolute inset-x-0 bottom-0 flex w-full gap-4 bg-slate-900/40 p-3 text-white/90 backdrop-blur-md',
                    isPlaying &&
                        'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                )}
            >
                <div
                    id="control-timeline"
                    className="flex flex-1 items-center justify-between gap-2 text-sm"
                >
                    <span ref={elapsedTimeRef} className="min-w-8 select-none">
                        0:00
                    </span>

                    <div
                        ref={timelineRef}
                        className="relative w-full cursor-pointer py-1"
                    >
                        <img
                            ref={thumbsRef}
                            id="thumbs"
                            src={previewURL}
                            alt="preview"
                            width={80}
                            height={45}
                            className="absolute bottom-8 z-20 hidden h-[45px] w-[80px] scale-150 select-none rounded-sm border object-none"
                        />
                        <div className="relative h-1 w-full rounded-full bg-slate-500">
                            <div
                                ref={bufferBarRef}
                                id="buffer-bar"
                                className="absolute inset-y-0 h-1 rounded-full bg-slate-200"
                            ></div>

                            <div
                                ref={elapsedBarRef}
                                className="absolute inset-y-0 h-1 rounded-full bg-gradient-to-r from-purple-800 to-fuchsia-600"
                                role="progressbar"
                                aria-label="video progress"
                                aria-valuenow={0}
                                aria-valuemin={0}
                                aria-valuemax={0}
                            ></div>
                        </div>

                        <div
                            ref={knobRef}
                            className="absolute top-1/2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow ring-2 ring-indigo-500"
                        >
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 ring-1 ring-inset ring-slate-900/5"></div>
                        </div>
                    </div>

                    <span
                        ref={durationRef}
                        className="min-w-10 select-none text-right"
                    >
                        0:00
                    </span>
                </div>

                <button
                    id="caption"
                    type="button"
                    onClick={handleToggleCaption}
                >
                    {captionURL && isCaptionOn ? (
                        <CaptionOnIcon />
                    ) : (
                        <CaptionOffIcon />
                    )}
                    <span className="sr-only">toggle caption</span>
                </button>

                <button
                    id="full-screen"
                    type="button"
                    onClick={handleToggleFullScreen}
                >
                    {isFullScreen ? <MinimizeIcon /> : <FullScreenIcon />}
                    <span className="sr-only">toggle fullscreen</span>
                </button>
            </div>
        </div>
    )
}

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

function PrimaryButton({ children, className, ...props }: PrimaryButtonProps) {
    return (
        <button
            className={cn(
                'flex items-center justify-center rounded-full border border-slate-400 bg-slate-900/40 p-2 text-white/90 backdrop-blur-md transition-all hover:bg-slate-700',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
