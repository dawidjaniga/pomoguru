import React from 'react'
import styled from 'styled-components'

const { remote } = window.require('electron')

const Title = styled.div`
  color: var(--text-color);
  padding-bottom: 20px;
  border-bottom: 1px solid var(--title-border-color);
  display: flex;
  justify-content: space-between;
`

const CloseLink = styled.a`
  color: var(--text-color);
  cursor: pointer;
`

function onCloseClick () {
  remote.getCurrentWindow().hide()
}

export default function WindowTitle ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Title>
      <div>{children}</div>
      <CloseLink onClick={onCloseClick}>x</CloseLink>
    </Title>
  )
}
