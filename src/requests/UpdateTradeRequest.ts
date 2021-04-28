/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTradeRequest {
	name: string
	dueDate: string
	done: boolean
}
