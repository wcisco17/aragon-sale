import React from 'react'
import {
  AragonApp,
  Button,
  Text,
  Countdown,
  Card,
  observe
} from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'

const DAY_IN_MS = 1000 * 60 * 60 * 24
const endDate = new Date(Date.now() + 5 * DAY_IN_MS)


const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {
  render () {
    return (
      <AppContainer>
        <div>
          <ObservedCount observable={this.props.observable} />
          <Button onClick={() => this.props.app.decrement(1)}>Decrement</Button>
          <Button onClick={() => this.props.app.increment(1)}>Increment</Button>
        </div>
</AppContainer>
    )
  }
}

const ObservedCount = observe(
  (state$) => state$,
  { count: 0 }
)(
  ({ count }) => <Text.Block style={{ textAlign: 'center' }} size='xxlarge'>{count}</Text.Block>
)
