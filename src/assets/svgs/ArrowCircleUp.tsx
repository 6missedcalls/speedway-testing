interface ArrowCircleUpSvgProps {
    fillColor: string;
}

function ArrowCircleUpSvg({ fillColor }: ArrowCircleUpSvgProps){
    return (
        <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" className={fillColor}/>
        <path d="M15.53 14.01C15.34 14.01 15.15 13.94 15 13.79L12 10.79L9 13.79C8.71 14.08 8.23 14.08 7.94 13.79C7.65 13.5 7.65 13.02 7.94 12.73L11.47 9.2C11.76 8.91 12.24 8.91 12.53 9.2L16.06 12.73C16.35 13.02 16.35 13.5 16.06 13.79C15.91 13.94 15.72 14.01 15.53 14.01Z" className={fillColor}/>
        </svg>
    )
}

export default ArrowCircleUpSvg