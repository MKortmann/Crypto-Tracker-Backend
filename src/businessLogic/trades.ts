// Contains all business logic to work with groups in our application

import * as uuid from 'uuid'
import { CreateTrade } from '../models/CreateTrade'
import { TradeAccess } from '../dataLayer/tradesAccess'
import { CreateTradeRequest } from '../requests/CreateTradeRequest'
import { UpdateTradeRequest } from '../requests/UpdateTradeRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')

// all code that works with DynamoDB is encapsulated in the dataLayer called TodoAccess
const todoAccess = new TradeAccess()

export async function getTrades(jwtToken: string): Promise<CreateTrade[]> {
	const userId = parseUserId(jwtToken)

	return todoAccess.getTrades(userId)
}

export async function getTradesAtExchange(
	jwtToken: string,
	exchange: string
): Promise<CreateTrade[]> {
	const userId = parseUserId(jwtToken)

	return todoAccess.getTradesAtExchange(userId, exchange)
}

export async function getTradesWithCrypto(
	jwtToken: string,
	crypto: string
): Promise<CreateTrade[]> {
	const userId = parseUserId(jwtToken)

	return todoAccess.getTradesWithCrypto(userId, crypto)
}

export async function getTradesInDateScope(
	jwtToken: string,
	start: string,
	end: string
): Promise<CreateTrade[]> {
	const userId = parseUserId(jwtToken)

	return todoAccess.getTradesInDateScope(userId, start, end)
}

export async function deleteTrade(jwtToken: string, tradeId: string) {
	const userId = parseUserId(jwtToken)
	const toReturn = todoAccess.deleteItem(userId, tradeId)

	return toReturn
}

export async function createTrade(
	jwtToken: string,
	parsedBody: CreateTradeRequest
) {
	const userId = parseUserId(jwtToken)
	const tradeId = uuid.v4()

	logger.info('userId', userId)
	logger.info('tradeId', tradeId)

	const item = {
		userId,
		tradeId,
		createdAt: new Date().toISOString(),
		...parsedBody,
		attachmentUrl: '',
	}

	logger.info('Trade Item to be created at business logic', item)
	const result = todoAccess.createTrade(item)

	return result
}

export async function updateTrade(
	jwtToken: string,
	tradeId: string,
	parsedBody: UpdateTradeRequest
) {
	const userId = parseUserId(jwtToken)
	const result = todoAccess.updateTrade(userId, tradeId, parsedBody)

	return result
}

export async function generateUploadUrl(jwtToken: string, tradeId: string) {
	const userId = parseUserId(jwtToken)
	const result = todoAccess.generateUploadUrl(userId, tradeId)

	return result
}
