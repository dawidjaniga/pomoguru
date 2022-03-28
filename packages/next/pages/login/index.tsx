import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

import Layout from '../../components/Layout'
import { renderLoginButton } from '@pomoguru/client'

const Wrapper = styled.section`
  max-width: 400px;
  margin: 100px auto;
`

export default function LoginPage () {
  useEffect(() => {
    renderLoginButton('#google-login')
  }, [])

  return (
    <Layout>
      <Wrapper>
        <Typography.Title>Login</Typography.Title>

        <div id='google-login' />
      </Wrapper>
    </Layout>
  )
}
