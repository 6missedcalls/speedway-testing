import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import {
	selectAddress,
	selectIsLogged,
	userCreateAccount,
} from "../../redux/slices/authenticationSlice"
import Signup from "./Component"

const Container = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch<any>()
	const isLogged = useSelector(selectIsLogged)
	const Address = useSelector(selectAddress)

	useEffect(() => {
		if (isLogged) {
			navigate("/post-signup", { state: { Address } })
		}
	}, [isLogged, navigate, Address])

	function createAccount(password: string) {
		dispatch(userCreateAccount({ password }))
	}

	return <Signup onSubmit={createAccount} />
}

export default Container
