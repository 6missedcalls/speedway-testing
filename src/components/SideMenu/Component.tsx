import SonrLogoSvg from "../../assets/svgs/SonrLogo"
import ButtonGroup from "./components/ButtonsGroup"
import { NavigateFunction } from "react-router-dom"
import {
	ROUTE_OBJECTS,
	ROUTE_SCHEMAS,
	ROUTE_BUCKETS,
} from "../../utils/constants"
import { useSelector } from "react-redux"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import IconLinkAccessApi from "../../assets/svgs/LinkAccessApi"
import IconLinkDocsSupport from "../../assets/svgs/LinkDocsSupport"

interface SideMenuComponentProps {
	navigate: NavigateFunction
	currentPath: string
}

const modulesButtons = [
	{
		label: "Schemas",
		iconName: "Note1",
		route: ROUTE_SCHEMAS,
	},
	{
		label: "Objects",
		iconName: "Box1",
		route: ROUTE_OBJECTS,
	},
	{
		label: "Buckets",
		iconName: "Bag2",
		route: ROUTE_BUCKETS,
	},
]

function SideMenuComponent({ navigate, currentPath }: SideMenuComponentProps) {
	const Address = useSelector(selectAddress)
	return (
		<div className="dark text-default flex flex-col w-80 bg-brand-tertiary h-full px-6 py-[42px] shrink-0 fixed z-10">
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

				<div className="text-custom-2xs uppercase font-semibold text-subdued mb-6">
					Tools
				</div>

				<a
					className="flex px-2 h-10 font-extrabold"
					href="https://github.com/sonr-io/speedway/blob/dev/docs/swagger.yaml"
					target="_blank"
					rel="noreferrer"
				>
					<span className="mr-2">
						<IconLinkAccessApi />
					</span>
					<span>Access API</span>
				</a>

				<a
					className="flex px-2 h-10 font-extrabold"
					href="https://docs.sonr.io/"
					target="_blank"
					rel="noreferrer"
				>
					<span className="mr-2">
						<IconLinkDocsSupport />
					</span>
					<span>Docs & Support</span>
				</a>
				<a
					className="flex px-2 h-10 font-extrabold"
					href="mailto:speedway@sonr.io"
					target="_blank"
					rel="noreferrer"
				>
					<span className="mr-2">
						<IconLinkDocsSupport />
					</span>
					<span>Report Bugs</span>
				</a>
			</div>

			<div className="border-b border-outlined-disabled mb-10 w-full h-px" />

			<div className="break-words text-ellipsis overflow-hidden whitespace-nowrap uppercase">
				{Address}
			</div>
		</div>
	)
}

export default SideMenuComponent
