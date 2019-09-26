import React from 'react';
import { connect } from 'react-redux'
import actions from './redux/actionsCombine';
import { AppState } from './redux/store';
import Layovers from './components/layovers/layovers';
import Tickets from './components/tickets/tickets';
import Header from './components/header/header';
import Plug from './components/plug/plug';

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
  system: AppState['system'];
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
      system: {
        endSearch
      },
      changeMostFilter,
      changeLayoverFilter,
      turnAllLayoverFiltersOn,
      turnAllLayoverFiltersOff
    } = this.props;

    return (
      <div className="app">
        <Header />
        {Object.keys(layovers).length > 0 &&
          <Layovers filters={layovers} onChange={changeLayoverFilter} onSwitchOn={turnAllLayoverFiltersOn} onSwitchOff={turnAllLayoverFiltersOff} />
        }
        {endSearch && tickets && tickets.length === 0 &&
            <Plug />
        }
        {tickets && tickets.length > 0 &&
            <Tickets tickets={tickets} cheapest={cheapest} onSelect={changeMostFilter} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    tickets: state.tickets.tickets,
    filters: state.filters,
    system: state.system
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
