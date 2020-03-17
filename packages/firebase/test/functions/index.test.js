const axios = require('axios')
const API_URL = 'http://localhost:5001'

describe('/slack-authorize', () => {
  it('should return success', async () => {
    const result = await axios.get(
      `${API_URL}/pomoguru-1da9b/us-central1/slackAuthorize`
    )
    expect(result.code).toBe(200)
  })
})
