import React from 'react'
import Menu from './Menu'
import { Layout } from 'antd'
import User from './User'
import Link from 'next/link'

import styled from 'styled-components'
import { useUser } from '../glue'

const Wrapper = styled(Layout.Header)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default function HeaderComponent () {
  const { loaded, data } = useUser()

  console.log(loaded, data)

  return (
    <Wrapper>
      <Menu />
      {loaded && data.id ? (
        <User fullName={data.email} avatarUrl={data.avatarUrl} />
      ) : (
        <Link href='/login'>Login</Link>
      )}
    </Wrapper>
  )
}
