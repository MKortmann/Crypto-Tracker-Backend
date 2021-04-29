import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { CreateTrade } from '../models/CreateTrade'
import { UpdateTradeRequest } from '../requests/UpdateTradeRequest'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('tradesAccess')
const portDynamoDB = process.env.DYNAMODB_OFFLINE_PORT

export class TradeAccess {
	constructor(
		private readonly docClient: DocumentClient = createDynamoDBClient(),
		private readonly tradesTable = process.env.TRADES_TABLE,
		private readonly s3 = new AWS.S3({ signatureVersion: 'v4' }),
		private readonly s3Bucket = process.env.USER_IMAGE_S3_BUCKET,
		private readonly urlExpiration = process.env.USER_SIGNED_URL_EXPIRATION
	) {}

	async getTrades(userId): Promise<CreateTrade[]> {
		const result = await this.docClient
			.query({
				TableName: this.tradesTable,
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					':userId': userId,
				},
			})
			.promise()

		logger.info('Result', result)

		const items = result.Items
		return items as CreateTrade[]
	}

	async deleteItem(userId: string, tradeId: string) {
		let result = {
			statusCode: 200,
			body: 'The item was deleted',
		}

		let tradeItem = await this.docClient
			.query({
				TableName: this.tradesTable,
				KeyConditionExpression: 'userId = :userId AND tradeId = :tradeId',
				ExpressionAttributeValues: {
					':userId': userId,
					':tradeId': tradeId,
				},
			})
			.promise()

		if (tradeItem.Items.length === 0) {
			result.statusCode = 404
			result.body = 'The item to be deleted was not found'
			return result
		}

		await this.docClient
			.delete({
				TableName: this.tradesTable,
				Key: {
					userId,
					tradeId,
				},
			})
			.promise()

		await this.s3
			.deleteObject({
				Bucket: this.s3Bucket,
				Key: tradeId,
			})
			.promise()

		return result
	}

	async createTrade(trade: CreateTrade): Promise<CreateTrade> {
		await this.docClient
			.put({
				TableName: this.tradesTable,
				Item: trade,
			})
			.promise()

		return trade
	}

	async updateTrade(
		userId: string,
		tradeId: string,
		parsedBody: UpdateTradeRequest
	) {
		let result = {
			statusCode: 200,
			body: `The item was updated`,
		}

		let tradeItem = await this.docClient
			.query({
				TableName: this.tradesTable,
				KeyConditionExpression: 'userId = :userId AND tradeId = :tradeId',
				ExpressionAttributeValues: {
					':userId': userId,
					':tradeId': tradeId,
				},
			})
			.promise()

		logger.info('Item to be updated', tradeItem)

		if (tradeItem.Items.length === 0) {
			result = {
				statusCode: 404,
				body: 'The item to be update was not found',
			}
			return result
		}

		// await this.docClient
		// 	.update({
		// 		TableName: this.tradesTable,
		// 		Key: {
		// 			userId,
		// 			tradeId,
		// 		},
		// 		UpdateExpression: 'set #crypto = if_not_exists(crypto, :crypto)',
		// 		ExpressionAttributeValues: {
		// 			':crypto': parsedBody.crypto,
		// 		},
		// 		ExpressionAttributeNames: {
		// 			'#crypto': 'crypto',
		// 		},
		// 		ReturnValues: 'UPDATED_NEW',
		// 	})
		// 	.promise()

		// only as an example that if the body does not contains crypto, we can update it to avoid error below as optionall... I wil let here as an example
		parsedBody.crypto = parsedBody.crypto
			? parsedBody.crypto
			: tradeItem.Items[0].crypto

		console.log(
			'cryptoItemToBeUpdate.Items[0].crypto',
			tradeItem.Items[0].crypto
		)

		await this.docClient
			.update({
				TableName: this.tradesTable,
				Key: {
					userId,
					tradeId,
				},
				UpdateExpression:
					'set #crypto =:crypto, #tradeDate=:tradeDate, #tradeType=:tradeType, #tradeCostPercent=:tradeCostPercent, #exchange=:exchange, #quantity=:quantity, #price=:price',
				ExpressionAttributeValues: {
					':crypto': parsedBody.crypto,
					':tradeDate': parsedBody.tradeDate,
					':tradeType': parsedBody.tradeDate,
					':tradeCostPercent': parsedBody.tradeDate,
					':exchange': parsedBody.tradeDate,
					':quantity': parsedBody.tradeDate,
					':price': parsedBody.tradeDate,
				},
				ExpressionAttributeNames: {
					'#crypto': 'crypto',
					'#tradeDate': 'tradeDate',
					'#tradeType': 'tradeType',
					'#tradeCostPercent': 'tradeCostPercent',
					'#exchange': 'exchange',
					'#quantity': 'quantity',
					'#price': 'price',
				},
				ReturnValues: 'UPDATED_NEW',
			})
			.promise()

		return result
	}

	async generateUploadUrl(userId, tradeId) {
		let result = {
			statusCode: 201,
			body: '',
		}

		let checkIfExist = await this.docClient
			.query({
				TableName: this.tradesTable,
				KeyConditionExpression: 'userId = :userId AND tradeId = :tradeId',
				ExpressionAttributeValues: {
					':userId': userId,
					':tradeId': tradeId,
				},
			})
			.promise()

		if (checkIfExist.Items.length === 0) {
			result = {
				statusCode: 404,
				body: 'The item to be update was not found',
			}
			return result
		}

		await this.docClient
			.update({
				TableName: this.tradesTable,
				Key: {
					userId,
					tradeId,
				},
				UpdateExpression: 'set #attachmentUrl =:attachmentUrl',
				ExpressionAttributeValues: {
					':attachmentUrl': `https://${this.s3Bucket}.s3.amazonaws.com/${tradeId}`,
				},
				ExpressionAttributeNames: { '#attachmentUrl': 'attachmentUrl' },
				ReturnValues: 'UPDATED_NEW',
			})
			.promise()

		result.body = this.s3.getSignedUrl('putObject', {
			Bucket: this.s3Bucket,
			Key: tradeId,
			Expires: parseInt(this.urlExpiration),
		})

		return result
	}
}
function createDynamoDBClient(): AWS.DynamoDB.DocumentClient {
	// if you are offline, serverless offline will set this variable IS_OFFLINE to true
	if (process.env.IS_OFFLINE) {
		logger.info('Creating a local DynamoDB instance')
		return new XAWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: `http://localhost:${portDynamoDB}`,
		})
	}

	return new XAWS.DynamoDB.DocumentClient()
}
