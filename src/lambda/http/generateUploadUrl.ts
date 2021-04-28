import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/trades'
import { createLogger } from '../../utils/logger'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('generateUploadUrls')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		logger.info('Processing generateUploadUrl Event: ', {
			event
		})

		const tradeId = event.pathParameters.tradeId

		const jwtToken = getToken(event)

		const result = await generateUploadUrl(jwtToken, tradeId)

		// return a presigned URL to upload a file for a TODO item with the provided id
		return {
			statusCode: result.statusCode,
			body: JSON.stringify({
				uploadUrl: result.body
			})
		}
	}
)

handler.use(
	cors({
		credentials: true
	})
)
