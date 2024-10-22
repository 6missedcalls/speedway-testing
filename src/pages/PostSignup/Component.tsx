interface PostSignupComponentProps {
	address: string
	onCopy: () => void
	onContinue: () => void
}

const PostSignupComponent = ({
	address,
	onCopy,
	onContinue,
}: PostSignupComponentProps) => {
	return (
		<div className="flex items-center dark text-default bg-surface-default h-screen">
			<div className="ml-32 w-[480px]">
				<h1 className="text-4xl font-extrabold mb-10 break-words leading-tight">
					{address}
				</h1>

				<p className="text-xl mb-10">
					Welcome! This is your SonrID. Copy it or write it down, and store it
					somewhere where you will not lose it.
				</p>

				<p className="text-xl mb-10">
					If you lose or forget your SonrID you will lose access to your account
					forever.
				</p>

				<button
					onClick={onCopy}
					className="block py-3 rounded border border-primary w-full text-xl text-button-outlined font-semibold mb-4 active:opacity-60"
				>
					Copy SonrID to Clipboard
				</button>

				<button
					onClick={onContinue}
					className="block py-3 rounded bg-primary w-full text-xl font-semibold"
				>
					Complete Registration
				</button>
			</div>
		</div>
	)
}

export default PostSignupComponent
