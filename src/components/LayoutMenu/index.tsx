import { FC, ReactNode, useContext, useRef } from "react"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import SideMenu from "../SideMenu"
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick"
import AppModal from "../AppModal"

type getModalParentType = () => HTMLElement

type Props = { children: ReactNode }
const Component: FC<Props> = ({ children }) => {
	const { closeModal } = useContext(AppModalContext)
	const modalParentRef = useRef(null)

	useDetectOutsideClick({ ref: modalParentRef, callback: closeModal })

	const getModalParent: getModalParentType = () => modalParentRef.current!

	return (
		<div className="flex">
			<SideMenu />
			<div className="w-full relative" ref={modalParentRef}>
				{children}
			</div>
			<AppModal getModalParent={getModalParent} />
		</div>
	)
}

export default Component
