import { useNavigate } from "react-router"
import HomeComponent from "./Component"

function HomeContainer() {
	const navigate = useNavigate()

	return <HomeComponent navigate={navigate} />
}

export default HomeContainer
