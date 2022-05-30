import styled from 'styled-components'

import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { app } from '../app'

const Content = styled.div`
  text-align: center;
  padding: 0 60px 120px;
`

export default function SlackPage () {
  const { query } = useRouter()
  const { code } = query
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (typeof code === 'string') {
      try {
        // @TODO: How to catch error properly?
        app.authorizeSlack(code)
      } catch (e) {
        setError(e)
      }
    }
  }, [code])

  return (
    <Layout>
      <Content>
        {error ? (
          'There was a problem with Slack auth:' + error.toString()
        ) : (
          <h1>Success! Slack installed</h1>
        )}
      </Content>
    </Layout>
  )
}
