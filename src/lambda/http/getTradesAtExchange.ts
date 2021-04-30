import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getTradesAtExchange } from '../../businessLogic/trades'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getTradesAtExchange')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		logger.info('Processing getTrades Event: ', {
			event,
		})

		const exchange: string = event.pathParameters.exchange
		const jwtToken = getToken(event)
		const items = await getTradesAtExchange(jwtToken, exchange)

		logger.info('returning the result items', items)

		return {
			statusCode: 200,
			body: JSON.stringify({
				items,
			}),
		}
	}
)

handler.use(
	cors({
		credentials: true,
	})
)
