import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getTrades } from '../../businessLogic/trades'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getTrades')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		logger.info('Processing getTrades Event: ', {
			event,
		})

		const jwtToken = getToken(event)
		const items = await getTrades(jwtToken)

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
