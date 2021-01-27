import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Home from './../Home'
import Slack from 'api/slack'

jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn()
  }
}))

const onInitMock = jest.fn()
const onStartClickMock = jest.fn()
const onPauseClickMock = jest.fn()
const onStopClickMock = jest.fn()

jest.mock('core/mediator', () => ({
  useMediator: () => ({
    onInit: onInitMock,
    onStartClick: onStartClickMock,
    onPauseClick: onPauseClickMock,
    onStopClick: onStopClickMock
  })
}))

const timerMinutes = 10
const secondsInMinutes = 60
let timeLeft = secondsInMinutes * timerMinutes
let isActive: boolean

jest.mock('core/timer', () => ({
  useTimer: () => [
    {
      isActive,
      timeLeft
    }
  ]
}))

describe('Home View', () => {
  it('should run Mediator.onInit when loaded', () => {
    render(
      <Router>
        <Route path='/'>
          <Home />
        </Route>
      </Router>
    )

    expect(onInitMock).toBeCalled()
  })

  describe('when Slack is not initialized', () => {
    beforeEach(() => {
      Slack.isInstalled = () => false
    })

    it('should show "Connect to Slack" button', () => {
      const { container } = render(
        <Router>
          <Route path='/'>
            <Home />
          </Route>
        </Router>
      )

      expect(screen.getByTestId('connect-to-slack')).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })
  })

  describe('when Slack is initialzied', () => {
    beforeEach(() => {
      Slack.isInstalled = () => true
    })

    describe('when Timer is not active', () => {
      beforeEach(() => {
        isActive = false
      })

      it('should display: Timer in minutes, Start button and hide "Connect to Slack"', () => {
        render(
          <Router>
            <Route path='/'>
              <Home />
            </Route>
          </Router>
        )

        expect(screen.getByTestId('timer')).toHaveTextContent(
          timerMinutes + ':00'
        )
        expect(screen.getByTestId('start')).toBeInTheDocument()
        expect(screen.queryByTestId('connect-to-slack')).toBeNull()
      })

      it('should have onStartClick attached', () => {
        render(
          <Router>
            <Route path='/'>
              <Home />
            </Route>
          </Router>
        )

        userEvent.click(screen.getByTestId('start'))
        expect(onStartClickMock).toBeCalled()
      })
    })

    describe('when Timer is active', () => {
      beforeEach(() => {
        isActive = true
      })

      it('should have onPauseClick and onStopClick attached  ', () => {
        render(
          <Router>
            <Route path='/'>
              <Home />
            </Route>
          </Router>
        )

        userEvent.click(screen.getByTestId('pause'))
        userEvent.click(screen.getByTestId('stop'))
        expect(onPauseClickMock).toBeCalled()
        expect(onStopClickMock).toBeCalled()
      })
    })
  })
})
