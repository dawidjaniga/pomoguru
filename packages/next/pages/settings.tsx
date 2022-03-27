import { Typography } from 'antd'

import styled from 'styled-components'

import Layout from '../components/Layout'

const Title = styled.h1`
  text-align: center;
  padding: 0 60px 120px;
`

export default function Page404 () {
  return (
    <Layout>
      <Title>Settings</Title>
      <Typography>Set set set</Typography>
    </Layout>
  )
}
