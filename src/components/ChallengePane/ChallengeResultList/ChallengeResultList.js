import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import _map from 'lodash/map'
import _findIndex from 'lodash/findIndex'
import _isObject from 'lodash/isObject'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
import WithCurrentUser from '../../HOCs/WithCurrentUser/WithCurrentUser'
import WithChallengeFilters from '../../HOCs/WithChallengeFilters/WithChallengeFilters'
import WithStartChallenge from '../../HOCs/WithStartChallenge/WithStartChallenge'
import WithFilteredChallenges from '../../HOCs/WithFilteredChallenges/WithFilteredChallenges'
import WithSortedChallenges from '../../HOCs/WithSortedChallenges/WithSortedChallenges'
import WithSearchResults from '../../HOCs/WithSearchResults/WithSearchResults'
import ChallengeResultItem from '../ChallengeResultItem/ChallengeResultItem'
import SvgSymbol from '../../SvgSymbol/SvgSymbol'
import BusySpinner from '../../BusySpinner/BusySpinner'
import messages from './Messages'
import './ChallengeResultList.css'

/**
 * ChallengeResultList applies the current challenge filters and the given
 * search to the given challenges, displaying the results as a list of
 * ChallengeResultItems.
 *
 * @see See ChallengeResultItem
 *
 * @author [Neil Rotstan](https://github.com/nrotstan)
 */
export class ChallengeResultList extends Component {
  clearFilters = () => {
    this.props.clearChallengeFilters()
    this.props.searchQueries.challenges.clearSearch()
  }

  render() {
    const challengeResults = this.props.filteredChallenges

    // If the user is actively browsing a challenge, include that challenge even if
    // it didn't pass the filters.
    if (_isObject(this.props.browsedChallenge)) {
      if (_findIndex(challengeResults, {id: this.props.browsedChallenge.id}) === -1) {
        challengeResults.push(this.props.browsedChallenge)
      }
    }

    let clearFiltersControl = null
    if (this.props.challenges.length > this.props.filteredChallenges.length) {
      clearFiltersControl = (
        <button className="button is-clear has-svg-icon challenge-result-list__clear-filters-control"
                onClick={this.clearFilters}>
          <SvgSymbol viewBox='0 0 20 20' sym="close-icon" />
          <FormattedMessage {...messages.clearFiltersLabel} />
        </button>
      )
    }

    // If there are map-bounded tasks visible (and we're not browsing a
    // challenge), offer the user an option to start a virtual challenge to
    // work on those mapped tasks.
    let virtualChallengeOption = null
    if (_get(this.props, 'mapBoundedTasks.tasks.length', 0) > 0 &&
        !_isObject(this.props.browsedChallenge)) {
      virtualChallengeOption = (
        <div className="challenge-result-list__virtual-challenge-option">
          <button className={classNames("button is-outlined is-primary",
                                        {"is-loading": this.props.creatingVirtualChallenge})}
                  onClick={this.props.startMapBoundedTasks}>
            <FormattedMessage {...messages.createVirtualChallenge} />
          </button>
        </div>
      )
    }

    let results = null
    if (challengeResults.length === 0) {
      results = (
        <div className='challenge-result-list__challenge-list no-results'>
          <span><FormattedMessage {...messages.noResults} /></span>
          {_get(this.props, 'fetchingChallenges', []).length > 0 &&
           <BusySpinner />
          }
        </div>
      )
    }
    else {
      const challenges = _map(challengeResults, challenge => (
        <li key={challenge.id}>
          <ChallengeResultItem challenge={challenge} {...this.props} />
        </li>
      ))

      results = (
        <ul className="challenge-result-list__challenge-list">
          {challenges}
        </ul>
      )
    }

    return (
      <div className={classNames("challenge-result-list", this.props.className)}>
        <div className="level challenge-result-list--heading">
          <h2 className="title is-4">
            <FormattedMessage {...messages.heading} />
          </h2>

          {clearFiltersControl}
        </div>

        {virtualChallengeOption}
        {results}
      </div>
    )
  }
}

ChallengeResultList.propTypes = {
  /**
   * Candidate challenges to which any current filters, search, etc. should be
   * applied
   */
  challenges: PropTypes.array.isRequired,

  /** Remaining challenges after all filters, searches, etc. applied */
  filteredChallenges: PropTypes.array.isRequired,
}

export default WithCurrentUser(
  WithStartChallenge(
    WithChallengeFilters(
      WithFilteredChallenges(
        WithSearchResults(
          WithSortedChallenges(
            ChallengeResultList,
            'filteredChallenges'
          ),
          'challenges',
          'filteredChallenges'
        ),
        'challenges',
        'filteredChallenges'
      )
    )
  )
)
