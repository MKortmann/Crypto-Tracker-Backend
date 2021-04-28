import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteTrade } from '../../businessLogic/trades'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('deleteTrade')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		const tradeId = event.pathParameters.tradeId

		logger.info('At delete lambda function', {
			event
		})

		const jwtToken = getToken(event)
		const result = await deleteTrade(jwtToken, tradeId)

		return {
			statusCode: result.statusCode,
			body: result.body
		}
	}
)

handler.use(
	cors({
		credentials: true
	})
)
