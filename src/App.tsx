import React from 'react';
import { connect } from 'react-redux'
import actions from './redux/actionsCombine';
import { AppState } from './redux/store';
import Layovers from './components/layovers/layovers';
import Tickets from './components/tickets/tickets';
import Header from './components/header/header';

const { startSearching, changeMostFilter } = actions;

interface Props {
  startSearching: typeof startSearching;
  changeMostFilter: typeof changeMostFilter;
  tickets: AppState['tickets']['tickets'];
  filters: AppState['filters'];
}

class App extends React.Component<Props> {
  componentDidMount() {
    const { startSearching } = this.props;

    startSearching();
  }

  render() {
    const { tickets, filters: {cheapest}, changeMostFilter } = this.props;

    return (
      <div className="app">
        <Header />
        <Layovers />
        {tickets && tickets.length > 0 &&
          <Tickets tickets={tickets.slice(0, 10)} cheapest={cheapest} onSelect={changeMostFilter} />
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
  changeMostFilter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
