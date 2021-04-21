import React, { useEffect } from 'react'

import { version } from '../../package.json'
import Button from 'core/components/Button'
import { Link } from 'react-router-dom'
import WindowContent from 'core/components/WindowContent'
import WindowTitle from 'core/components/WindowTitle'
import format from 'date-fns/format'
import slack from 'api/slack'
import styled from 'styled-components'
import { useMediator } from 'core/mediator'
import { useTimer } from 'core/timer'
import { Phase } from 'types/timer'

const { ipcRenderer } = window.require('electron')

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  width: 46%;
`

const Timer = styled.div`
  color: var(--text-color);
  font-size: 58px;
  font-weight: 600;
  line-height: 79px;
  text-align: center;
`

export default function Home () {
  const { onInit, onStartClick, onPauseClick, onStopClick } = useMediator()
  const [{ timeLeft, isActive, phase }] = useTimer()

  useEffect(() => {
    onInit()
  }, []) // eslint-disable-line

  function handleUpdateClick() {
    ipcRenderer.send('checkUpdateClicked')
  }

  return (
    <>
      <WindowTitle>
        Pomoguru <img src='icon-red-small.png' alt='Pomoguru icon' />
        {version}
        <button onClick={handleUpdateClick}>Check update</button>
      </WindowTitle>
      <WindowContent>
        {slack.isInstalled() ? (
          <>
            {phase === Phase.focus && 'Focus time'}
            {phase === Phase.break && 'Break time'}
            <Timer data-testid='timer'>
              {format(new Date(timeLeft * 1000), 'mm:ss')}
            </Timer>
            <Buttons>
              {isActive ? (
                <>
                  <Button onClick={onPauseClick} data-testid='pause'>
                    Pause
                  </Button>
                  <Button onClick={onStopClick} data-testid='stop'>
                    Stop
                  </Button>
                </>
              ) : (
                <Button onClick={onStartClick} data-testid='start'>
                  Start
                </Button>
              )}
            </Buttons>
          </>
        ) : (
          <Link to='/slack-installation' data-testid='connect-to-slack'>
            Connect to Slack
          </Link>
        )}
      </WindowContent>
    </>
  )
}
