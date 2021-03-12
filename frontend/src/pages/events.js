
import React from 'react';

import './events.css';

import {
  Modal,
  EventItem
} from '../components';

import AuthContext from '../context/auth-context'

export class EventPage extends React.Component {

  static contextType = AuthContext;

  state = {
    loading: false,
    eventId: null,
    eventsData: [],
    isBooking: false,
    activeEvent: -1,
    showModal: false,
    fetchingEvents: false,
    showBookModal: false
  };

  dateRef = React.createRef();
  titleRef = React.createRef();
  priceRef = React.createRef();
  descriptionRef = React.createRef();
  isMountedComponent = false;

  getEvents = () => {

    const reqBody = {
      query: `
        query {
          events{
            _id
            title
            date
            price
            description
            creator {
              _id
              email
              createdEvents {
                title
                creator {
                  email
                }
              }
            }
          }
        }
      `
    };

    this.setState({
      fetchingEvents: true
    });

    fetch('http://localhost:4200/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Faild!');
      }

      return res.json();
    })
    .then(res => {

      if (res.data.events) {

        this.setState({
          fetchingEvents: false,
          eventsData: res.data.events
        });
        return;
      }

      this.setState({
        fetchingEvents: false
      });
    })
    .catch(err => {

      this.setState({
        fetchingEvents: false
      });

      console.error('events.getEvents', err);
    });
  };

  handleSubmit = () => {

    const title = this.titleRef.current.value;
    const date = this.dateRef.current.value;
    const price = parseInt(this.priceRef.current.value);
    const description = this.descriptionRef.current.value;

    if (!title || !price || !date || !description) {
      return;
    }

    const reqBody = {
      query: `
        mutation {
          createEvent(eventInput:{ title:"${title}", description: "${description}", price: ${price}, date:"${date}"}){
            _id
            date
            title
            price
            description
          }
        }
      `
    };

    this.setState({
      loading: true
    });

    console.log('>>', this.context.user);

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

      if (res.data) {

        this.setState({
          loading: false,
          showModal: false
        });
        return;
      }

      this.setState({
        loading: false
      });
    })
    .then(() => this.getEvents())
    .catch(err => {

      this.setState({
        loading: false
      });

      console.error('events.handleSubmit', err);
    });
  }

  toggleModal = () => {

    this.setState(state => ({
      showModal: !state.showModal
    }));
  };

  onEventClick = (index) => {

    this.setState(state => ({
      activeEvent: state.activeEvent !== index
        ? index
        : -1
    }));
  };

  bookEvent = () => {

    const { eventId } = this.state;

    const reqBody = {
      query: `
        mutation {
          bookEvent (eventId: "${eventId}"){
            _id
            createdAt
            user {
              _id
              email
            }
            event{
              _id
              title
              description
              price
              date
            }
          }
        }
      `
    };

    this.setState({
      isBooking: true
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

      if (res.data) {

        this.setState({
          eventId: null,
          isBooking: false,
          showBookModal: false
        });
        return;
      }

      this.setState({
        isBooking: false
      });
    })
    .catch(err => {

      this.setState({
        isBooking: false
      });

      console.error('events.bookEvent', err);
    });
  };

  handleCloseBookEvent = () => {

    this.setState({
      eventId: null,
      showBookModal: false
    });
  };

  handleBookEvent = (id) => {

    this.setState({
      eventId: id,
      showBookModal: true
    });
  };

  componentDidMount = () => {

    this.isMountedComponent = true;

    this.getEvents();
  };

  componentWillUnmount = () => {

    this.isMountedComponent = false;
  };

  render = () => {

    const {
      loading,
      showModal,
      isBooking,
      eventsData,
      activeEvent,
      showBookModal,
      fetchingEvents
    } = this.state;

    return (
      <>
        { showModal &&

          <Modal
            title='Add event'
            isLoading={loading}
            onCancel={this.toggleModal}
            onConfirm={this.handleSubmit}
          >

            <form>

              <div className='form-control'>
                <label htmlFor='email'>
                  Title
                </label>
                <input
                  id='title'
                  type='text'
                  ref={this.titleRef}
                />
              </div>

              <div className='form-control'>
                <label htmlFor='price'>
                  Price
                </label>
                <input
                  id='price'
                  type='number'
                  ref={this.priceRef}
                />
              </div>

              <div className='form-control'>
                <label htmlFor='date'>
                  Date
                </label>
                <input
                  id='date'
                  type='datetime-local'
                  ref={this.dateRef}
                />
              </div>

              <div className='form-control'>
                <label htmlFor='description'>
                  Description
                </label>
                <textarea
                  id='description'
                  rows={4}
                  ref={this.descriptionRef}
                ></textarea>
              </div>

            </form>

          </Modal>
        }

        { showBookModal &&

          <Modal
            title='Book event'
            isLoading={isBooking}
            onCancel={this.handleCloseBookEvent}
            onConfirm={this.bookEvent}
          >
            Are you sure you want to book this event?
          </Modal>
        }

        { this.context.user.isLoggedIn &&

        <div className='event-page'>

          <p>
            Share your events
          </p>

          <button
            className='btn'
            onClick={this.toggleModal}
          >
            Create event
          </button>

        </div>
        }

        <ul className='event-list'>

          { fetchingEvents && eventsData.length <= 0 && 'Fetching events...'}

          { !fetchingEvents && eventsData.length <= 0 && 'No available events.'}

          { (!fetchingEvents || eventsData.length > 0) &&

            eventsData.map((event, index) => (
              <EventItem
                key={index}
                { ...event }
                active={index === activeEvent}
                onLeftTextClick={this.handleBookEvent}
                onClick={() => this.onEventClick(index)}
                isLoggedIn={this.context.user.isLoggedIn}
                showLeftText={this.context.user.id !== event.creator._id}
                isOfUser={this.context.user.id === event.creator._id}
              />
            ))
          }

        </ul>

      </>
    );
  }
}