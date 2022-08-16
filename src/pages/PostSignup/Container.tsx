import copy from "copy-to-clipboard"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import PostSignupComponent from "./Component"

const PostSignupContainer = () => {
	const navigate = useNavigate()
	const Address = useSelector(selectAddress)

	return (
		<PostSignupComponent navigate={navigate} Address={Address} copy={copy} />
	)
}

export default PostSignupContainer
