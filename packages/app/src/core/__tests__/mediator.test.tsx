import React from 'react'
import { render, screen } from '@testing-library/react'
import { useMediator } from '../mediator'

function Wrapper () {
  const {} = useMediator()

  return <div></div>
}

describe('Mediator', () => {
  it('should run timer', () => {
    render(<Wrapper />)
    console.log('timer run')
    screen.debug()
  })
})
