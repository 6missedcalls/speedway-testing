interface HomeComponentProps {
    navigate: (page: string) => void;
}

function HomeComponent({
    navigate,
}: HomeComponentProps){
    return (
        <div>
            <h1>Home</h1><br />
            <ul>
                <li className="cursor-pointer" onClick={() => navigate('/login')}>Login</li>
                <li className="cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</li>
            </ul>
        </div>
    )
}

export default HomeComponent