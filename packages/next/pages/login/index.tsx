import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'

import Layout from '../../components/Layout'
import Button from '../../components/Button'
const Wrapper = styled.section`
  max-width: 400px;
  margin: 100px auto;
`

// @TODO: Regenerate clientId and pass it through ENV
const clientId =
  '287690471181-8kitbg5dc6ugfgtrb08a52cfe6sohbgg.apps.googleusercontent.com'

declare global {
  const google: typeof import('google-one-tap')
}

export default function LoginPage () {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = function () {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
      })
      google.accounts.id.renderButton(
        document.querySelector('#google-button'),
        {
          theme: 'outline',
          size: 'large'
        }
      )
    }
    document.head.append(script)

    async function handleCredentialResponse (
      response: google.CredentialResponse
    ) {
      await fetch('http://localhost:4000/login/google', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jwtToken: response.credential
        })
      })
    }
  }, [])

  return (
    <Layout>
      <Wrapper>
        <Typography.Title>Login</Typography.Title>

        <div id='google-button' />
      </Wrapper>
    </Layout>
  )
}
