import React from 'react'
import Menu from './Menu'
import { Layout } from 'antd'
import User from './User'
import Link from 'next/link'
import { useUser } from '../pomoguru/pomoguru-react'
import styled from 'styled-components'

const Wrapper = styled(Layout.Header)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default function HeaderComponent () {
  const user = useUser()

  return (
    <Wrapper>
      <Menu />
      {user ? (
        <User fullName={user.fullName} avatarUrl={user.avatarUrl} />
      ) : (
        <Link href='/login'>Login</Link>
      )}
    </Wrapper>
  )
}
