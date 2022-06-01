import styled from 'styled-components'
import Button from '../components/Button'
import Layout from '../components/Layout'

const Content = styled.div`
  text-align: center;
  padding: 0 60px 120px;
`

export default function SettingsPage () {
  const notificationsAllowed = false
  // @TODO: Extract to client
  const redirectUri = 'https://localhost:4200/slack'

  return (
    <Layout>
      <Content>
        {notificationsAllowed ? (
          'Notifications are allowed'
        ) : (
          <Button onClick={() => console.log('Connect to App Notifications')}>
            Allow notifications
          </Button>
        )}
        <a
          href={`https://slack.com/oauth/v2/authorize?client_id=866674528645.977369566150&scope=&user_scope=dnd:write,users.profile:write,chat:write&redirect_uri=${redirectUri}`}
        >
          <img
            alt='Add to Slack'
            height='40'
            width='139'
            src='https://platform.slack-edge.com/img/add_to_slack.png'
            srcSet='https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x'
          />
        </a>
      </Content>
    </Layout>
  )
}
