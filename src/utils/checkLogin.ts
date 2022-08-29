import { getAccountInfo } from "../service/authentication"
import { getAppStateFromLocalCache } from "./localStorage"

export async function isLoggedInServer() {
	try {
		const cachedAddress = getAppStateFromLocalCache().authentication.Address
		const data = await getAccountInfo()
		if (data.Address === cachedAddress) {
			return true
		} else {
			return false
		}
	} catch (err) {
		return false
	}
}
