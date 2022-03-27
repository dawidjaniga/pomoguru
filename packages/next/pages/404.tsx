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
      <Title>404 Not found</Title>
      <Typography>
        There is no page you're looking for. But maybe you want to know more
        about{' '}
        <a
          href='https://en.wikipedia.org/wiki/Pomodoro_Technique'
          target='_blank'
        >
          Pomodoro Technique
        </a>
      </Typography>
    </Layout>
  )
}
