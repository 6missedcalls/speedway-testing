import SonrLogoSvg from "../../assets/svgs/SonrLogo"
import ButtonGroup from "./components/ButtonsGroup"
import { NavigateFunction } from "react-router-dom"
import {
	ROUTE_SCHEMAS,
	// ROUTE_OBJECTS,
	// ROUTE_BUCKETS,
	// ROUTE_ACCESS_API,
	// ROUTE_DID_UTILITY,
	// ROUTE_DOCS_AND_SUPPORT,
	// ROUTE_BLOCK_EXPLORER,
} from "../../utils/constants"
import { useSelector } from "react-redux"
import { selectAddress } from "../../redux/slices/authenticationSlice"

interface SideMenuComponentProps {
	navigate: NavigateFunction
	currentPath: string
}

const modulesButtons = [
	{
		label: "Schemas",
		iconName: "Document",
		route: ROUTE_SCHEMAS,
	},
	// {
	// 	label: "Objects",
	// 	iconName: "Document",
	// 	route: ROUTE_OBJECTS,
	// },
	// {
	// 	label: "Buckets",
	// 	iconName: "Document",
	// 	route: ROUTE_BUCKETS,
	// },
]

// const toolsButtons = [
// 	{
// 		label: "Access API",
// 		iconName: "Document",
// 		route: ROUTE_ACCESS_API,
// 	},
// 	{
// 		label: "DID Utility",
// 		iconName: "Document",
// 		route: ROUTE_DID_UTILITY,
// 	},
// 	{
// 		label: "Docs & Support",
// 		iconName: "Document",
// 		route: ROUTE_DOCS_AND_SUPPORT,
// 	},
// 	{
// 		label: "Block Explorer",
// 		iconName: "Document",
// 		route: ROUTE_BLOCK_EXPLORER,
// 	},
// ]

function SideMenuComponent({ navigate, currentPath }: SideMenuComponentProps) {
	const Address = useSelector(selectAddress)
	return (
		<div className="dark text-default flex flex-col w-80 bg-brand-tertiary h-screen px-6 py-[42px] shrink-0">
			<div className="flex w-full mb-10">
				<div className="w-11 h-11 mr-2.5">
					<SonrLogoSvg />
				</div>
				<span className="font-extrabold tracking-custom-tighter text-custom-xl">
					Speedway
				</span>
			</div>

			<div className="border-b border-outlined-disabled mb-10 w-full h-px" />

			<div className="flex-1">
				<ButtonGroup
					title="Modules"
					navigate={navigate}
					currentPath={currentPath}
					buttons={modulesButtons}
					className="mb-10"
				/>
				{/* <ButtonGroup
					title="Tools"
					navigate={navigate}
					currentPath={currentPath}
					buttons={toolsButtons}
				/> */}
			</div>

			<div className="border-b border-outlined-disabled mb-10 w-full h-px" />

			<div className="break-words text-ellipsis overflow-hidden whitespace-nowrap uppercase">
				{Address}
			</div>
		</div>
	)
}

export default SideMenuComponent
