import { ReactNode } from "react"
import SonrLogoSvg from "../../assets/svgs/SonrLogo"
import { ROUTE_CREATE_PROFILE, ROUTE_LOGIN, ROUTE_SIGNUP } from "../../utils/constants"
import { useNavigate } from "react-router-dom"

type Props = {
	sidebarContent: ReactNode
	content: ReactNode
	route: string
}
const Component = ({ content, sidebarContent, route }: Props) => {
	const navigate = useNavigate()

	return (
		<div className="flex-1 flex flex-col min-h-screen">
			<div className="flex-1 flex flex-row">
				<div className="flex-1 dark text-default w-7/12 bg-surface-default">
					<div className="flex flex-col bg-black-gray-logo bg-no-repeat bg-right-bottom h-full p-16 bg-[length:548px_548px]">
						<div className="flex justify-between items-center">
							<div className="flex mr-4">
								<div className="w-11 h-11 mr-2.5">
									<SonrLogoSvg />
								</div>
								<div>
									<span className="font-extrabold tracking-custom-tighter text-custom-xl">
										Sonr
									</span>
								</div>
							</div>
							<div className="bg-gray-800 w-72 h-6 flex justify-between rounded-3xl">
								<div className="text-center text-custom-xs w-full flex items-center justify-center rounded-3xl">
									<button
										className={`
											block h-6 w-full text-white font-extrabold rounded-3xl
											${route === ROUTE_SIGNUP || route === ROUTE_CREATE_PROFILE ? "bg-primary-light" : "bg-transparent"}`}
										onClick={() => navigate(ROUTE_SIGNUP)}
									>
										Register
									</button>
								</div>
								<div className="text-center text-custom-xs w-full flex items-center justify-center rounded-3xl">
									<button
										className={`block h-6 w-full text-white font-extrabold rounded-3xl
											${route === ROUTE_LOGIN ? "bg-primary-light" : "bg-transparent"}`}
										onClick={() => navigate(ROUTE_LOGIN)}
									>
										Login
									</button>
								</div>
							</div>
						</div>
						{sidebarContent}
					</div>
				</div>

				<div className="flex flex-col justify-center items-center p-16 w-5/12">
					{content}
				</div>
			</div>
		</div>
	)
}

export default Component
