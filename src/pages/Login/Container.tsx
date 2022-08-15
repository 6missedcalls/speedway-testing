import { useDispatch, useSelector } from "react-redux"
import { selectIsLogged, userLogin } from "../../redux/slices/authenticationSlice"
import LoginComponent from "./Component"

const Container = () => {
	const dispatch = useDispatch<any>()
	
	function login(walletAddress: string, password: string){
		if(!walletAddress || !password) {
			console.error('Wallet address and password are required.')
			return
		}
		dispatch(userLogin({ walletAddress, password }));
	}

	const state = useSelector(selectIsLogged)
	console.log('logged', state)
	
	return <LoginComponent onSubmit={login} />
}

export default Container
