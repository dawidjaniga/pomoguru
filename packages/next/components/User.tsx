import { Avatar } from 'antd'
import React from 'react'
import styled from 'styled-components'

interface UserProps {
  fullName: string
  avatarUrl: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const UserName = styled.span`
  color: #fff;
`
export default function User (props: UserProps) {
  return (
    <Wrapper>
      <UserName>{props.fullName}</UserName>
      <Avatar src={props.avatarUrl} />
    </Wrapper>
  )
}
