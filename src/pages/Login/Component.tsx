interface LoginComponentProps {
    isLogged: boolean;
    login: () => void;
    logout: () => void;
    goToDashboard: () => void;
}

function LoginComponent({
    isLogged,
    login,
    logout,
    goToDashboard
}: LoginComponentProps){
    return (
        <div>
            <h1>Login</h1><br />
            User logged: {isLogged.toString()}
            <br /><br />
            <button onClick={login}>Click to Login</button><br />
            <button onClick={logout}>Click to Logout</button><br />
            <br /><br />
            <button onClick={goToDashboard}>Click to go to Dashboard</button><br />
        </div>
    )
}

export default LoginComponent