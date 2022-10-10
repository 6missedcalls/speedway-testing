interface ByteTypeDownloadButtonComponentProps {
	download: () => void
}

function ByteTypeDownloadButtonComponent({
	download,
}: ByteTypeDownloadButtonComponentProps) {
	return (
		<div
			className="w-20 h-8 bg-button-subtle rounded cursor-pointer flex justify-center items-center"
			onClick={download}
		>
			<span className="block font-extrabold text-custom-xs text-button-subtle">
				Download
			</span>
		</div>
	)
}

export default ByteTypeDownloadButtonComponent
