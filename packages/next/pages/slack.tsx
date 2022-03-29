import styled from 'styled-components'

import Layout from '../components/Layout'
import { controller } from '@pomoguru/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Content = styled.div`
  text-align: center;
  padding: 0 60px 120px;
`

export default function SlackPage () {
  const { query } = useRouter()
  const { code } = query

  useEffect(() => {
    if (typeof code === 'string') {
      controller.authorizeSlack(code)
    } else {
      // @TODO: Use Application notifications
      console.error('Slack authorization: incorrect code', code)
    }
  }, [code])

  return (
    <Layout>
      <Content>
        <h1>Success! Slack installed</h1>
      </Content>
    </Layout>
  )
}
