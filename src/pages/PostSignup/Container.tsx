import copy from "copy-to-clipboard"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import PostSignupComponent from "./Component"

const PostSignupContainer = () => {
	const navigate = useNavigate()

	const address = useSelector(selectAddress)
	const onCopy = () => copy(address)
	const onContinue = () => navigate("/schema")

	return (
		<PostSignupComponent
			address={address}
			onCopy={onCopy}
			onContinue={onContinue}
		/>
	)
}

export default PostSignupContainer
