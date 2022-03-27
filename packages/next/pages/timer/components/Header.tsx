import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.header``
const AppName = styled.h1`
  font-size: 48px;
  text-align: center;
  font-family: Helvetica;
  font-weight: 800;
  padding: 40px;
  margin: 0;
`

export default function Header (props: React.PropsWithChildren<{}>) {
  return (
    <Wrapper>
      <AppName>Pomoguru</AppName>
      {props.children}
    </Wrapper>
  )
}
