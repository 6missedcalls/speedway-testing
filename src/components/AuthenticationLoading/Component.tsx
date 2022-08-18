import RefreshSvg from "../../assets/svgs/Refresh"
import SonrLogoSvg from "../../assets/svgs/SonrLogo"
import { ROUTE_SIGNUP } from "../../utils/constants"

interface AuthenticationLoadingComponentProps {
	route: string
}

function AuthenticationLoadingComponent({
	route,
}: AuthenticationLoadingComponentProps) {
	return (
		<div className="flex-1 flex flex-col min-h-screen">
			<div className="flex-1 flex flex-row">
				<div className="flex-1 dark text-default w-full bg-surface-default">
					<div className="flex flex-col bg-black-gray-logo bg-no-repeat bg-right-bottom h-full p-16 bg-[length:548px_548px]">
						<div className="flex justify-between items-center">
							<div className="flex">
								<div className="w-11 h-11 mr-2.5">
									<SonrLogoSvg />
								</div>
								<div>
									<span className="font-extrabold tracking-custom-tighter text-custom-xl">
										Sonr
									</span>
								</div>
							</div>
						</div>
						<div className=" max-w-[479px] flex flex-col mt-40 ml-14">
							<div className="text-custom-3xl font-extrabold tracking-custom-x2tighter mb-6">
								Almost There!
							</div>
							<div className="text-custom-md font-normal tracking-custom-tight mb-10">
								{route === ROUTE_SIGNUP
									? "We're setting up your new account now. This may take a moment or two."
									: "You are being authenticated now. This may take a moment or two."}
							</div>
							<div className="w-28 animate-reverse-spin">
								<RefreshSvg />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthenticationLoadingComponent
