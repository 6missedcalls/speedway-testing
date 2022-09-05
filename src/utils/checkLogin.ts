import getAccountInfo from "../service/getAccountInfo"
import { getAppStateFromLocalCache } from "./localStorage"

export async function isLoggedInServer() {
	try {
		const cachedAddress = getAppStateFromLocalCache().authentication.Address
		const data = await getAccountInfo()
		if (data.address === cachedAddress) {
			return true
		} else {
			return false
		}
	} catch (err) {
		return false
	}
}
