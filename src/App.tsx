import React from 'react';
import { connect } from 'react-redux'
import { startSearching, StartSearching } from './redux/actions';
import { AppState } from './redux/store';
import Layovers from './components/layovers/layovers';
import Tickets from './components/tickets/tickets';
import Header from './components/header/header';

interface Props {
  startSearching: typeof startSearching;
  tickets: AppState['tickets']
}

class App extends React.Component<Props> {
  componentDidMount() {
    const { startSearching } = this.props;

    startSearching();
  }

  render() {
    const { tickets } = this.props;

    return (
      <div className="app">
        <Header />
        <Layovers />
        {tickets && tickets.length > 0 &&
          <Tickets tickets={tickets} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    tickets: state.tickets
  };
}

const mapDispatchToProps = { startSearching };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
