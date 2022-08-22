const ModalCreateBucket = () => {
	return (
		<div>
			<div className="rounded-2xl p-8">
				<div className="flex flex-row mb-2">
					<span className="flex-1 uppercase font-semibold text-custom-sm text-default">New Bucket</span>
					<button className="font-extrabold text-button-transparent text-custom-sm">Cancel</button>
				</div>

				<input
					className="text-custom-xl text-default font-extrabold"
					type="text"
					placeholder="Bucket Name"
				/>
			</div>

			<div className="dark bg-surface-default py-6 px-8 text-right rounded-b-2xl">
				<button className="text-skin-primary bg-skin-primary font-extrabold rounded py-2 px-6 min-w-[200px]">
					Save
				</button>
			</div>
		</div>
	)
}

export default ModalCreateBucket
