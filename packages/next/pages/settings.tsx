import styled from 'styled-components'
import Button from '../components/Button'
import Layout from '../components/Layout'
import { controller, useNotificationsAllowed } from '@pomoguru/client'

const Content = styled.div`
  text-align: center;
  padding: 0 60px 120px;
`

export default function SettingsPage () {
  const notificationsAllowed = useNotificationsAllowed()

  return (
    <Layout>
      <Content>
        {notificationsAllowed ? (
          'Notifications are allowed'
        ) : (
          <Button onClick={() => controller.allowNotifications()}>
            Allow notifications
          </Button>
        )}
      </Content>
    </Layout>
  )
}
