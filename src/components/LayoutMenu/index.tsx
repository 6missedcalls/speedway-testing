import { FC, ReactNode, useContext, useRef } from "react"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import SideMenu from "../SideMenu"
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick"
import AppModal from "../AppModal"
import { AppSettingsContext } from "../../contexts/appSettingsContext/appSettingsContext"

type getModalParentType = () => HTMLElement

type Props = { children: ReactNode }
const Component: FC<Props> = ({ children }) => {
	const { menuIsCollapsed, setMenusIsCollapsed } = useContext(AppSettingsContext)
	const { closeModal } = useContext(AppModalContext)
	const modalParentRef = useRef(null)

	useDetectOutsideClick({ ref: modalParentRef, callback: closeModal })

	const getModalParent: getModalParentType = () => modalParentRef.current!

	function toggleMenuIsCollapsed(){
		setMenusIsCollapsed(!menuIsCollapsed)
	}

	return (
		<div className="flex">
			<SideMenu 
				toggleMenuIsCollapsed={toggleMenuIsCollapsed}
			/>
			<div 
				className={`
					${menuIsCollapsed ? 'pl-28' : 'pl-80'}
					w-full relative
				`} 
				ref={modalParentRef}
			>
				{children}
			</div>
			<AppModal getModalParent={getModalParent} />
		</div>
	)
}

export default Component
