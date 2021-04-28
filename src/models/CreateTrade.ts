/**
 * Contains a structure of the data that we store in our DynamoDB table
 */
export interface CreateTrade {
	userId: string
	tradeId: string
	tradeDate: string
	tradeType: string
	tradeCostPercent: number
	crypto: string
	createdAt: string
	quantity: number
	exchange: string
	attachmentUrl?: string
}
