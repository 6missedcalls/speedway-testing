import AuthenticationLoadingComponent from "./Component"

interface AuthenticationLoadingProps {
	route: string
}

function AuthenticationLoadingContainer({ route }: AuthenticationLoadingProps) {
	return <AuthenticationLoadingComponent route={route} />
}

export default AuthenticationLoadingContainer
