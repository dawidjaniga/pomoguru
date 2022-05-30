import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

import { app } from '../../app'
import Layout from '../../components/Layout'

const Wrapper = styled.section`
  max-width: 400px;
  margin: 100px auto;
`

export default function LoginPage () {
  useEffect(() => {
    app.renderGoogleLoginButton('#google-login')
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
