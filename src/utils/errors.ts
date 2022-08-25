interface formatApiErrorProps {
	error: any
	url: string
	options: RequestInit | undefined
}

export function formatApiError({ error, url, options }: formatApiErrorProps) {
	if (typeof error === "string") return error
	if (error?.message && typeof error.message === "string") return error.message
	return `Error calling ${url} with options: ${JSON.stringify(
		options,
		null,
		2
	)}`
}
