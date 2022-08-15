import { FC, ReactNode } from "react"
import SideMenu from "../SideMenu"

type Props = { children: ReactNode }
const Component: FC<Props> = ({ children }) => {
	return (
		<div className="flex">
			<SideMenu />
			{children}
		</div>
	)
}

export default Component
