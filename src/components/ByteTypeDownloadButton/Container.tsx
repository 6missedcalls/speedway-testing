import useBytes from "../../hooks/useBytes"
import ByteTypeDownloadButtonComponent from "./Component"

interface ByteTypeDownloadButtonContainerProps {
	cid: string
	itemKey: string
	schemaDid: string
}

function ByteTypeDownloadButtonContainer({
	cid,
	itemKey,
	schemaDid,
}: ByteTypeDownloadButtonContainerProps) {
	const { getBytesAndDownload } = useBytes()

	const download = () =>
		getBytesAndDownload({ cid, key: itemKey, schemaDid: schemaDid })

	return <ByteTypeDownloadButtonComponent download={download} />
}

export default ByteTypeDownloadButtonContainer
