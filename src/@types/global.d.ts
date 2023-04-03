declare module '*.scss' {
    const styles: { [key: string]: string }
    export default styles
}

declare module '*.svg' {
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>
    export default SVG
}
