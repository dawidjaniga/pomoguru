import React from 'react'
import styled from 'styled-components'

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin-top: 1em;
`

export default function WindowTitle ({
  children
}: {
  children: React.ReactNode
}) {
  return <Content>{children}</Content>
}
