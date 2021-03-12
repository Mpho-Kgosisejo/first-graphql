
import React from 'react';

import {
  Modal,
  EventItem
} from '../components';

import AuthContext from '../context/auth-context';

import '../pages/events.css';

export class BookingsPage extends React.Component {

  static contextType = AuthContext;

  state = {
    bookings: [],
    bookingId: null,
    isLoading: false,
    isDeleting: false,
    showDeleteBookingsModal: false,
  };

  isMountedComponent = false;

  fetchBookings = () => {

    const reqBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              date
              title
              price
              description
              creator {
                _id
                email
              }
            }
          }
        }
      `
    };

    this.setState({
      isLoading: true
    });

    fetch('http://localhost:4200/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.context.user.token}`
      }
    })
    .then(res => {

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Faild!');
      }

      return res.json();
    })
    .then(res => {

      if (!this.isMountedComponent) {
        return;
      }

      if (res.data) {

        this.setState({
          isLoading: false,
          bookings: res.data.bookings,
        });
        return;
      }

      this.setState({
        isLoading: false
      });
    })
    .catch(err => {

      if (!this.isMountedComponent) {
        return;
      }

      this.setState({
        isLoading: false
      });

      console.error('bookings.fetchBookings', err);
    });
  };

  deleteBooking = () => {

    const {
      bookingId
    } = this.state;

    const reqBody = {
      query: `
        mutation CancelBooking($bookingId: ID!) {
          cancelBooking(bookingId: $bookingId) {
            title
          }
        }
      `,
      variables: {
        bookingId: bookingId
      }
    };

    this.setState({
      isDeleting: true
    });

    fetch('http://localhost:4200/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.context.user.token}`
      }
    })
    .then(res => {

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Faild!');
      }

      return res.json();
    })
    .then(res => {

      if (!this.isMountedComponent) {
        return;
      }

      if (res.data) {

        this.setState({
          isDeleting: false,
          showDeleteBookingsModal: false
        });
        return;
      }

      this.setState({
        isDeleting: false
      });
    })
    .then(() => this.fetchBookings())
    .catch(err => {

      if (!this.isMountedComponent) {
        return;
      }

      this.setState({
        isLoading: false
      });

      console.error('bookings.deleteBooking', err);
    });
  };

  handleShowModal = (id) => {

    this.setState({
      bookingId: id,
      showDeleteBookingsModal: true
    });
  };

  handleCloseModal = () => {

    this.setState({
      bookingId: null,
      showDeleteBookingsModal: false
    });
  };

  componentDidMount = () => {

    this.isMountedComponent = true;

    this.fetchBookings();
  };

  componentWillUnmount = () => {

    this.isMountedComponent = false;
  };

  render = () => {

    const {
      bookings,
      isLoading,
      isDeleting,
      showDeleteBookingsModal
    } = this.state;

    return (
      <div className='auth-page'>

        { showDeleteBookingsModal &&

          <Modal
            title='Delete booking'
            isLoading={isDeleting}
            onConfirm={this.deleteBooking}
            onCancel={this.handleCloseModal}
          >
            Are you sure you want to delete this booking?
          </Modal>
        }

        { isLoading && 'Fetching booked events...' }

        { !isLoading && bookings.length <= 0 && 'You have not booked any event.' }

        { (!isLoading || bookings.length > 0) && (

          <>

          <ul className='event-list'>

            { bookings.map(booking => (
              <EventItem
                active={true}
                isDelete={true}
                leftText='Cancel'
                key={booking._id}
                { ...booking.event }
                _id={booking._id}
                showLeftText={true}
                onLeftTextClick={this.handleShowModal}
                isLoggedIn={this.context.user.isLoggedIn}
                isOfUser={this.context.user.id === booking.event.creator._id}
              />
            )) }
          </ul>

          </>
        )}

      </div>
    );
  }
}