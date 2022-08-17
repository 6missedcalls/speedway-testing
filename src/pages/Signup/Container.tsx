import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import {
	selectAddress,
	userCreateAccount,
	userLogin,
} from "../../redux/slices/authenticationSlice"
import Signup from "./Component"

const Container = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch<any>()

	async function createAccountAndLogin(password: string) {
		const createAccountResponse = await dispatch(
			userCreateAccount({ password })
		)
		const { payload } = createAccountResponse

		await dispatch(userLogin({ walletAddress: payload.Address, password }))
		navigate("/post-signup")
	}

	return <Signup onSubmit={createAccountAndLogin} />
}

export default Container
