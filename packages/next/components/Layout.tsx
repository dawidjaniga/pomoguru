import React from 'react'
import styled from 'styled-components'
import DocumentTitle from './DocumentTitle'
import { Layout } from 'antd'
import Header from './Header'

const { Content, Footer } = Layout

const Main = styled(Layout)`
  width: 100vw;
  min-height: 100vh;
  position: relative;
  background: var(--primaryColor);
`

const Inner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const ContentWrapper = styled(Content)`
  flex: 1;
`

export default function LayoutComponent (props: React.PropsWithChildren<{}>) {
  return (
    <Main>
      <DocumentTitle />
      <Inner>
        <Header />

        <ContentWrapper>
          <div>{props.children}</div>
        </ContentWrapper>

        <Footer style={{ textAlign: 'center' }}>
          Pomoguru ©2022 Created by{' '}
          <a href='https://www.dawidjaniga.pl'>Janigowski</a>
        </Footer>
      </Inner>
    </Main>
  )
}
