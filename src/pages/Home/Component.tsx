import { useDispatch } from "react-redux";
import { setIsLogged } from "../../redux/slices/authenticationSlice";

interface HomeComponentProps {
    navigate: (page: string) => void;
}

function HomeComponent({
    navigate,
}: HomeComponentProps){
    const dispatch = useDispatch()
    
    return (
        <div>
            <h1>Home</h1><br />
            <ul>
                <li className="cursor-pointer" onClick={() => {
                    // Fake login
                    dispatch(setIsLogged(true))
                    navigate('/dashboard')
                }}>Click here to Login</li>
            </ul>
        </div>
    )
}

export default HomeComponent