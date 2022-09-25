function SuccessResponse(res, data, message = 'success', status = 200) {
	return res.json({ message: message, status: status, data: data })
}

function ErrorResponse(res, data = [], message = 'error', status = 500) {
	return res.json({ message: message, status: status, data: data })
}

module.exports = { SuccessResponse, ErrorResponse }
