import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTradeRequest } from '../../requests/UpdateTradeRequest'
import { updateTrade } from '../../businessLogic/trades'
import { createLogger } from '../../utils/logger'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('updateTrades')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		const tradeId = event.pathParameters.tradeId
		const parsedBody: UpdateTradeRequest = JSON.parse(event.body)

		logger.info('Getting an item to be updated: ', {
			event
		})
		logger.info('Item to be updated: ', {
			updateTrade
		})

		const jwtToken = getToken(event)

		const result = await updateTrade(jwtToken, tradeId, parsedBody)

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
