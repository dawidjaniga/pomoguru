import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.button`
  border: 1px solid #ffffff80;
  background: transparent;
  border-radius: 20px;
  font-size: 21px;
  line-height: 1;
  padding: 8px 22px;
  font-variant: all-small-caps;
  font-weight: 300;
  cursor: pointer;
`
const AppName = styled.h1`
  font-size: 48px;
  text-align: center;
  font-weight: 800;
  padding: 40px;
`

interface ButtonProps {
  onClick: (e: React.MouseEvent) => void
}

export default function Button (props: React.PropsWithChildren<ButtonProps>) {
  return <Wrapper onClick={props.onClick}>{props.children}</Wrapper>
}
