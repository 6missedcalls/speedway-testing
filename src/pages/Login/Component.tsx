interface LoginComponentProps {
	isLogged: boolean
	login: () => void
	logout: () => void
	goToDashboard: () => void
}

function LoginComponent({
	isLogged,
	login,
	logout,
	goToDashboard,
}: LoginComponentProps) {
	return (
		<div>
			<h1>Login page</h1>
		</div>
	)
}

export default LoginComponent
