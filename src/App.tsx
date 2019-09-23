import React from 'react';
import { connect } from 'react-redux'
import { startSearching, StartSearching } from './redux/actions';
import Layovers from './components/layovers/layovers';
import Tickets from './components/tickets/tickets';
import Header from './components/header/header';

interface Props {
  startSearching: typeof startSearching;
}

class App extends React.Component<Props> {
  componentDidMount() {
    const { startSearching } = this.props;

    startSearching();
  }

  render() {
    return (
      <div className="app">
        <Header />
        <Layovers />
        <Tickets />
      </div>
    );
  }
}

const mapStateToProps = (state: {}) => {
  return {

  }
}

const mapDispatchToProps = { startSearching }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
