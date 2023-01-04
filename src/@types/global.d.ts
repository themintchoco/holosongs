declare module '*.scss' {
    const styles: { [key: string]: string }
    export default styles
}

declare module '*.svg' {
    import React from 'react'
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>
    export default SVG
}
