import { useDispatch, useSelector } from "react-redux"
import { setIsLogged } from "../../redux/slices/authenticationSlice"
import { RootState } from "../../redux/store"

function HomeComponent(){
    const isLogged = useSelector((state: RootState) => state.authentication.isLogged)
    const dispatch = useDispatch()
  
    return (
        <div>
            <h1>Home</h1><br />
            User logged: {isLogged.toString()}<br />
            <button onClick={() => dispatch(setIsLogged(true))}>Click to Login</button><br />
            <button onClick={() => dispatch(setIsLogged(false))}>Click to Logout</button><br />
        </div>
    )
}

export default HomeComponent