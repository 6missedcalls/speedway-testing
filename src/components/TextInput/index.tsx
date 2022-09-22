import React, { useState } from "react"

interface TextInputProps {
	testId?: string
	LeftIcon?: React.FC
	RightIcon?: React.FC
	onHandleFocus?: Function
	handleOnClick?: Function
	handleOnChange: Function
	label?: string
	ariaLabel: string
	placeholder?: string
	type?: string
	error?: string | boolean
	value: string
	className?: string
	inputRef?: React.MutableRefObject<null>
	rightIconOnClick?: Function
}

function TextInputComponent({
	error,
	inputRef,
	type = "text",
	LeftIcon,
	RightIcon,
	onHandleFocus,
	handleOnClick,
	rightIconOnClick,
	handleOnChange,
	label,
	ariaLabel,
	placeholder,
	testId,
	value = "",
	className = "",
}: TextInputProps) {
	const [focused, setFocused] = useState(false)

	function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
		setFocused(true)
		onHandleFocus && onHandleFocus(event)
	}

	function handleBlur() {
		setFocused(false)
	}

	return (
		<div className={`${className} flex flex-col items-start`}>
			{label && (
				<div className="pb-1">
					<span className="block text-custom-xs text-subdued">{label}</span>
				</div>
			)}
			<div className="relative w-full ">
				{LeftIcon && (
					<div className="absolute w-4 m-3 left-0">
						<LeftIcon />
					</div>
				)}
				{RightIcon && (
					<div
						onClick={() => rightIconOnClick && rightIconOnClick()}
						className={`${
							rightIconOnClick ? "cursor-pointer" : ""
						} absolute w-4 m-3 right-0`}
					>
						<RightIcon />
					</div>
				)}
				<input
					data-testid={testId}
					ref={inputRef}
					className={`
                    bg-transparent appearance-none border rounded-md text-gray-900 w-full py-1 px-2 h-10 leading-tight focus:outline-none
                    ${LeftIcon ? "pl-8" : ""}
                    ${focused ? "border-gray-900" : "border-default-border"}
                    `}
					type={type}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholder={placeholder}
					aria-label={ariaLabel}
					onClick={(event) => handleOnClick && handleOnClick(event)}
					onChange={(event) => handleOnChange(event)}
					value={value}
				/>
			</div>
			{error && (
				<div className="mt-1.5">
					<span className="text-tertiary-red  block  text-xs">{error}</span>
				</div>
			)}
		</div>
	)
}

export default TextInputComponent
