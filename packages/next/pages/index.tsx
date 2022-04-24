import React from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Row, Col, Typography, Steps, Space, Card } from 'antd'

import FocusedWoman from './bro.svg'

const HeroSection = styled.section`
  width: 100vw;
  min-height: 100vh;
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
    background-attachment: fixed;
    width: 100%;
    height: 100%;
  }
`

const HeroContent = styled.div`
  height: 100%;
  width: 100%;
  z-index: 1;
  position: absolute;
  padding: 0 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  a.ant-btn {
    margin-top: 30px;
    font-size: 18px;
    line-height: 50px;
    height: 50px;
    padding: 0px 16px;
  }
`

const Title = styled.h1`
  font-size: 80px;
  line-height: 1.5;
  margin: 0;
`

const DescriptionSection = styled.div`
  background: #fff;
  padding: 8% 10%;
`

const FeaturesSection = styled.div`
  background: var(--primaryColor);
  padding: 8% 10%;

  h2 {
    color: #fff;
  }
`

export default function IndexPage () {
  return (
    <Layout>
      <Head>
        <title>Pomoguru: focus on what&apso;s matter</title>
      </Head>
      <HeroSection>
        <HeroContent>
          <Row>
            <Col span={12}>
              <Title>Distract less</Title>
              <Title>Focus more</Title>

              <Link href='/login' passHref>
                <Button type='primary' shape='round' size='middle'>
                  Start using for free
                </Button>
              </Link>
            </Col>
            <Col span={12}>
              <Image
                src={FocusedWoman}
                alt='Woman focused on tasks'
                layout='fill'
              />
            </Col>
          </Row>
        </HeroContent>
      </HeroSection>
      <DescriptionSection>
        <Space size='large' direction='vertical'>
          <Space size='large' direction='vertical'>
            <Typography.Title level={2}>What is Pomoguru?</Typography.Title>
            <Typography.Paragraph type='secondary'>
              Pomoguru is timer which helps you focus on work. It’s based on
              Pomodoro technique, but in light implementation.
            </Typography.Paragraph>
          </Space>

          <Space size='large' direction='vertical'>
            <Typography.Title level={2}>How it works?</Typography.Title>
            <Steps direction='vertical' size='small'>
              <Steps.Step
                title='Plan'
                description='Choose 1 task to work on.'
              />
              <Steps.Step
                title='Focus'
                description='Start timer. From now on you focus only work. No Slack, no calls, no social media.'
              />
              <Steps.Step
                title='Break'
                description='Answer Slack, calls, make tea. Try to finish those in the timebox.'
              />
            </Steps>
          </Space>
        </Space>
      </DescriptionSection>
      <FeaturesSection>
        <Space size='large' direction='vertical'>
          <Typography.Title level={2}>What does it offer?</Typography.Title>
        </Space>

        <Space size='large' direction='vertical'>
          <Card title='Slack'>
            Every time you start timer your status is updated in Slack and{' '}
            <i>Do Not Distrub</i> mode is turned on. After you finish focusing
            status is changed to the previous one and Slack notifications are
            turned on again.
          </Card>

          <Card title='Notifications & Sounds'>
            You will be notified about your focus time and break time with sound
            and notification.
          </Card>

          <Card title='Pomodoros tracker'>
            Set your daily goal and see how many pomodoros you have done.
          </Card>

          <Card title='Statistics'>
            See how many pomodoros you have done in the past month.
          </Card>
        </Space>
      </FeaturesSection>
    </Layout>
  )
}
