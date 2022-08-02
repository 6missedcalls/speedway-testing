interface HomeComponentProps {
    isLogged: boolean;
    login: () => void;
    logout: () => void;
    goToDashboard: () => void;
}

function HomeComponent({
    isLogged,
    login,
    logout,
    goToDashboard
}: HomeComponentProps){
    return (
        <div>
            <h1>Home</h1><br />
            User logged: {isLogged.toString()}
            <br /><br />
            <button onClick={login}>Click to Login</button><br />
            <button onClick={logout}>Click to Logout</button><br />
            <br /><br />
            <button onClick={goToDashboard}>Click to go to Dashboard</button><br />
        </div>
    )
}

export default HomeComponent