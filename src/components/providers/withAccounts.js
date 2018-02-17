import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import { hasAccounts } from '../../state/constants/selectors'
import { setAccounts } from '../../state/constants/actionCreators'

const withAccounts = Cmp => class extends Component {
  componentDidMount () {
    const { accountsExist, web3, setAccounts } = this.props
    if (!accountsExist) web3.eth.getAccountsAsync().then(setAccounts)
  }

  render () {
    const { accountsExist, accounts, setAccounts, ...props } = this.props
    return accountsExist
      ? <Cmp accounts={accounts} {...props} />
      : <p>Getting accounts...</p>
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  accounts: state.accounts,
  accountsExist: hasAccounts(state)
})

const mapDispatchToProps = dispatch => ({
  setAccounts: bindActionCreators(setAccounts, dispatch)
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAccounts
)
