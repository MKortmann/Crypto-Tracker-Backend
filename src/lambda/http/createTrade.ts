import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTradeRequest } from '../../requests/CreateTradeRequest'
import { createTrade } from '../../businessLogic/trades'
import { createLogger } from '../../utils/logger'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('createTrades')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		logger.info('Processing createTrade Event: ', {
			event
		})

		const parsedBody: CreateTradeRequest = JSON.parse(event.body)
		const jwtToken = getToken(event)

		const item = await createTrade(jwtToken, parsedBody)

		logger.info('item created', item)

		return {
			statusCode: 201,
			body: JSON.stringify({
				item
			})
		}
	}
)

handler.use(
	cors({
		credentials: true
	})
)
