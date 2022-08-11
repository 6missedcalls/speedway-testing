interface ArrowCircleDownSvgProps {
	fillColor: string
}

function ArrowCircleDownSvg({ fillColor }: ArrowCircleDownSvgProps) {
	return (
		<svg
			width="100%"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M7.99992 15.1667C4.04659 15.1667 0.833252 11.9534 0.833252 8.00004C0.833252 4.04671 4.04659 0.833374 7.99992 0.833374C11.9533 0.833374 15.1666 4.04671 15.1666 8.00004C15.1666 11.9534 11.9533 15.1667 7.99992 15.1667ZM7.99992 1.83337C4.59992 1.83337 1.83325 4.60004 1.83325 8.00004C1.83325 11.4 4.59992 14.1667 7.99992 14.1667C11.3999 14.1667 14.1666 11.4 14.1666 8.00004C14.1666 4.60004 11.3999 1.83337 7.99992 1.83337Z"
				className={fillColor}
			/>
			<path
				d="M7.99992 10.0067C7.87325 10.0067 7.74659 9.96004 7.64659 9.86004L5.29325 7.50671C5.09992 7.31337 5.09992 6.99337 5.29325 6.80004C5.48659 6.60671 5.80659 6.60671 5.99992 6.80004L7.99992 8.80004L9.99992 6.80004C10.1933 6.60671 10.5133 6.60671 10.7066 6.80004C10.8999 6.99337 10.8999 7.31337 10.7066 7.50671L8.35325 9.86004C8.25325 9.96004 8.12659 10.0067 7.99992 10.0067Z"
				className={fillColor}
			/>
		</svg>
	)
}
// #4F4A60
export default ArrowCircleDownSvg