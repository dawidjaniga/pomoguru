import React from 'react'
import styled from 'styled-components'

const Title = styled.div`
  color: var(--text-color);
  padding-bottom: 20px;
  border-bottom: 1px solid var(--title-border-color);
  display: flex;
  justify-content: space-between;
`

export default function WindowTitle ({
  children
}: {
  children: React.ReactNode
}) {
  return <Title>{children}</Title>
}
