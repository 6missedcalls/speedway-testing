import { useDispatch } from "react-redux"
import { userGetObject } from "../redux/slices/objectsSlice"
import { downloadFileFromBase64 } from "../utils/files"
import { parseJsonFromBase64String } from "../utils/object"

function useBytes() {
	const dispatch: Function = useDispatch()
	async function getBytesAndDownload({
		cid,
		key,
		schemaDid,
	}: {
		cid: string
		key: string
		schemaDid: string
	}) {
		const { payload } = await dispatch(
			userGetObject({
				schemaDid,
				objectCid: cid,
			})
		)
		const bytes = payload?.object[key]?.["/"]?.bytes
		if (!bytes) return

		const parsedData = parseJsonFromBase64String(bytes)
		const { base64File, fileName } = parsedData
		downloadFileFromBase64(base64File, fileName)
	}

	return {
		getBytesAndDownload,
	}
}

export default useBytes
