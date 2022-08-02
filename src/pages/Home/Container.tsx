import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { selectIsLogged, setIsLogged } from "../../redux/slices/authenticationSlice"
import HomeComponent from "./Component"

function HomeContainer(){
    const navigate = useNavigate()
    const isLogged = useSelector(selectIsLogged)
    const dispatch = useDispatch()

    function login(){
        dispatch(setIsLogged(true))
    }

    function logout(){
        dispatch(setIsLogged(false))
    }

    function goToDashboard(){
        navigate('/dashboard')
    }

    return (
        <HomeComponent 
            login={login}
            logout={logout}
            goToDashboard={goToDashboard}
            isLogged={isLogged}
        />
    )
}

export default HomeContainer