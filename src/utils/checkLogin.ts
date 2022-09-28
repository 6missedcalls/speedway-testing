import getAccountInfo from "../service/getAccountInfo"
import { getAppStateFromLocalCache } from "./localStorage"

export async function isLoggedInServer() {
	try {
		const cachedAddress = getAppStateFromLocalCache().authentication.address
		const address = await getAccountInfo()
		if (address === cachedAddress) {
			return true
		} else {
			return false
		}
	} catch (err) {
		return false
	}
}
