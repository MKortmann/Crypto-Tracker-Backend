// Contains all business logic to work with groups in our application

import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTradeRequest } from '../requests/CreateTradeRequest'
import { UpdateTradeRequest } from '../requests/UpdateTradeRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')

// all code that works with DynamoDB is encapsulated in the dataLayer called TodoAccess
const todoAccess = new TodoAccess()

export async function getTrades(jwtToken: string): Promise<TodoItem[]> {
	const userId = parseUserId(jwtToken)

	return todoAccess.getTrades(userId)
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
		done: false,
		...parsedBody,
		attachmentUrl: ''
	}

	logger.info('Item to be created at business logic', item)
	const toReturn = todoAccess.createTrade(item)

	return toReturn
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
