import BucketsPageComponent from "./Component"

function BucketsPageContainer() {
	const data = [
		{ label: "Furniture", objects: ["1"] },
		{ label: "massive ui-breaking bucket name", objects: [] },
		{ label: "dragons", objects: ["1", "1", "1"] },
	]
	return <BucketsPageComponent data={data} />
}

export default BucketsPageContainer
