import BucketsPageComponent from "./Component"

function BucketsPageContainer() {
	const data = [
		{ label: "Furniture" },
		{ label: "massive ui-breaking bucket name" },
		{ label: "dragons" },
	]
	return <BucketsPageComponent data={data} />
}

export default BucketsPageContainer
