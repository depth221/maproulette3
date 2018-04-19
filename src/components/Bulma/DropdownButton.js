import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SimpleDropdown from './SimpleDropdown'

/**
 * DropdownButton is an optionally self-managed component that sets up a Bulma
 * dropdown menu that is intended to be activated by a button passed a child
 * component, though it can also be determined by the `isActive` prop. Menu
 * options to be displayed should be passed as an `options` prop array, each
 * with at least `key` and `text` fields. The `onSelect` prop function is
 * invoked when a menu option is selected.
 *
 * If no isActive prop is given, it will self-manage its own state. Otherwise,
 * a toggleActive prop must also be provided in addition to isActive.
 *
 * @author [Neil Rotstan](https://github.com/nrotstan)
 */
export default class DropdownButton extends Component {
  state = {
    isActive: false,
  }

  toggleActive = () => {
    this.setState({isActive: !this.state.isActive})
  }

  selectOption = (e, option) => {
    e.preventDefault()
    this.props.onSelect && this.props.onSelect(option)
    this.toggleActive()
  }

  render() {
    const options = this.props.options.map(option => (
      <a key={option.key}
         className={classNames('dropdown-item', option.className)}
         onClick={(e) => this.selectOption(e, option)}>
        {option.text}
      </a>
    ))

    return (
      <SimpleDropdown {...this.props}
                      label={this.props.children}
                      isActive={this.state.isActive}
                      toggleActive={this.toggleActive}>
        {options}
      </SimpleDropdown>
    )
  }
}

DropdownButton.propTypes = {
  /** Determines whether the dropdown is active/open or inactive/closed */
  isActive: PropTypes.bool,
  /** Array of menu options, each with at least key and text fields */
  options: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.node.isRequired,
    text: PropTypes.node.isRequired,
  })),
  /** Invoked when a menu option is selected by the user */
  onSelect: PropTypes.func,
  /** Invoked to toggle the current active/inactive state of the dropdown */
  toggleActive: PropTypes.func,
  /** Invoked to deactivate/close the menu */
  deactivate: PropTypes.func,
}
