import React from 'react';
import { connect } from 'react-redux'
import actions from './redux/actionsCombine';
import { AppState } from './redux/store';
import Layovers from './components/layovers/layovers';
import Tickets from './components/tickets/tickets';
import Header from './components/header/header';

const {
  startSearching,
  changeMostFilter,
  changeLayoverFilter,
  turnAllLayoverFiltersOn,
  turnAllLayoverFiltersOff
} = actions;

interface Props {
  startSearching: typeof startSearching;
  changeMostFilter: typeof changeMostFilter;
  changeLayoverFilter: typeof changeLayoverFilter;
  turnAllLayoverFiltersOn: typeof turnAllLayoverFiltersOn;
  turnAllLayoverFiltersOff: typeof turnAllLayoverFiltersOff;
  tickets: AppState['tickets']['tickets'];
  filters: AppState['filters'];
}

class App extends React.Component<Props> {
  componentDidMount() {
    const { startSearching } = this.props;

    startSearching();
  }

  render() {
    const {
      tickets,
      filters: {
        cheapest,
        layovers
      },
      changeMostFilter,
      changeLayoverFilter,
      turnAllLayoverFiltersOn,
      turnAllLayoverFiltersOff
    } = this.props;

    return (
      <div className="app">
        <Header />
        <Layovers filters={layovers} onChange={changeLayoverFilter} onSwitchOn={turnAllLayoverFiltersOn} onSwitchOff={turnAllLayoverFiltersOff} />
        {tickets && tickets.length > 0 &&
          <React.Fragment>
            {/* <Layovers filters={layovers} /> */}
            <Tickets tickets={tickets} cheapest={cheapest} onSelect={changeMostFilter} />
          </React.Fragment>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    tickets: state.tickets.tickets,
    filters: state.filters
  };
}

const mapDispatchToProps = {
  startSearching,
  changeLayoverFilter,
  changeMostFilter,
  turnAllLayoverFiltersOn,
  turnAllLayoverFiltersOff
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
