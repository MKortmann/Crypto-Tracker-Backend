import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getTradesInDateScope } from '../../businessLogic/trades'
import { getToken } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('getTradesInSpecificDateScope')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		logger.info('Processing getTradesDateScope Event: ', {
			event,
		})

		const start: string = event.pathParameters.start
		const end: string = event.pathParameters.end
		const jwtToken = getToken(event)
		const items = await getTradesInDateScope(jwtToken, start, end)

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
