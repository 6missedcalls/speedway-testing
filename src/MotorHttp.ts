import { BASE_API } from "./utils/constants"

import { QueryWhereIsByCreatorRequest } from "../gen/ts/motor/v1/request"
import { QueryWhereIsByCreatorResponse } from "../gen/ts/motor/v1/response"

export const QueryWhereIsByCreator = async (
	body: QueryWhereIsByCreatorRequest
): Promise<QueryWhereIsByCreatorResponse> => {
	return fetch(`${BASE_API}/api/v1/bucket/get-from-creator`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
	}).then((response) => response.json())
}

const MotorHttp = {
	QueryWhereIsByCreator,
}

export default MotorHttp
