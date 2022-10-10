export const isRejected = (
	input: PromiseSettledResult<unknown>
): input is PromiseRejectedResult => input.status === "rejected"

export const isFulfilled = <T>(
	input: PromiseSettledResult<T>
): input is PromiseFulfilledResult<T> => input.status === "fulfilled"

export function promiseAllSettledLogErrors<T>(
	results: PromiseSettledResult<T>[]
) {
	const rejectedResults = results.filter(isRejected)
	if (rejectedResults && rejectedResults.length > 0) {
		rejectedResults.forEach((item: PromiseRejectedResult) =>
			console.warn(item.reason)
		)
	}
}
