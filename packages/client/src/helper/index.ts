import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 *  Formats the duration in seconds to a human readable format
 *
 * @param seconds
 * @returns
 */
export function formatDuration(duration: number) {
    const seconds = Math.floor(duration % 60)
    const minutes = Math.floor(duration / 60) % 60
    const hours = Math.floor(duration / 3600)
    if (hours === 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    } else {
        return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}`
    }
}

export function getCellCoords(index: number): { x: number; y: number } {
    // The dimensions of the grid
    const constants = {
        width: 800,
        height: 450,
        cellWidth: 80,
        cellHeight: 45,
    }

    // The number of columns the grid
    const cols = constants.width / constants.cellWidth

    // The column and row of the cell
    const cellCol = index % cols
    const cellRow = Math.floor(index / cols)

    // The x and y coordinates of the cell
    const x = cellCol * constants.cellWidth
    const y = cellRow * constants.cellHeight

    return { x, y }
}
