import React from 'react'
import styled from 'styled-components'
import DocumentTitle from './DocumentTitle'
import { Layout } from 'antd'
import Header from './Header'

const { Content, Footer } = Layout

const Main = styled(Layout)`
  width: 100vw;
  height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    filter: contrast(0.5);
    background: url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=100');
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
  }
`

const Inner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
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
          Pomoguru ©2022 Created by Janigowski
        </Footer>
      </Inner>
    </Main>
  )
}
