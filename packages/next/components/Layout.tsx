import React from 'react'
import styled from 'styled-components'
import DocumentTitle from './DocumentTitle'
import { Layout } from 'antd'
import Header from './Header'
import ErrorBoundary from './ErrorBoundary'

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

// @TODO: Ensure Error Boundary works as intended on production
export default function LayoutComponent (
  props: React.PropsWithChildren<unknown>
) {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}
