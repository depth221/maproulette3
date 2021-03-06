import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import SearchBox from '../../SearchBox/SearchBox'
import messages from './Messages'

export default class OtherKeywordsOption extends Component {
  render() {
    return (
      <div className="mr-flex mr-items-center">
        <label
          className="mr-text-green-lighter mr-mr-4 mr-cursor-pointer"
        >
          <FormattedMessage {...messages.otherOption} />
        </label>
        <SearchBox
          {...this.props}
          suppressIcon
          showDoneButton
          leftAligned
          className="mr-appearance-none mr-outline-none mr-rounded-none mr-bg-transparent mr-text-white mr-border-b mr-border-green-lighter"
        />
      </div>
    )
  }
}
