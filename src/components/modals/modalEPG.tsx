import React from "react";
import '../../theme/components/modals/modalEPG.scss';
import { useSelectorT as useSelector, useDispatchT as useDispatch } from '../../redux/hooks';
import { setSelectedEvent } from '../../redux/reducers/mainSlice';
import ChannelInfo from "../core/channelInfo";
import EventCard from "../core/eventCard";
import { formatTime, formatDuration } from '../../utils/utils';

export interface Event {
  id?: string
  name?: string
  date_begin?: number
  date_end?: number
  onClick?: () => void
  selected?: boolean
  duration?: string
  description?: string
};

export interface Channel {
  id?: string
  name?: string
  image?: string
  number?: number
  events?: Array<Event>
};

export class ActiveEvent {
  channel_id?: string
  id?: string
  name?: string
  date_begin?: number
  date_end?: number
  duration?: string
  description?: string
  constructor(event: ActiveEvent) {
    this.channel_id = event.channel_id;
    this.id = event.id;
    this.name = event.name;
    this.date_begin = event.date_begin;
    this.date_end = event.date_end;
    this.duration = event.duration;
    this.description = event.description;
  }
}

const ModalEPG : React.FC = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.main.channels);
  const selectedEvent = useSelector<ActiveEvent>((state) => state.main.selectedEvent);

  const onClickEvent = (event: ActiveEvent) => {
    dispatch(setSelectedEvent(event));
  };

  const timeLine = [
    '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00',
    '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00'
  ]

  return (
    <div className="root">
      <div className="event-selected-info">
        <h1 className="text">
          {`${selectedEvent.name}`}
        </h1>
        <div className="text">
          <span>
            {`
              ${formatTime(selectedEvent.date_begin)}hrs a 
              ${formatTime(selectedEvent.date_end)}hrs 
              ${formatDuration(selectedEvent.duration)}
            `}
          </span>
        </div>
        <p className="text">
          {selectedEvent.description || `
            Event ${selectedEvent.id} channel ${selectedEvent.channel_id}. Lorem Ipsum is 
            simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap 
            into electronic typesetting, remaining essentially unchanged. It was popularised 
            in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
            and more recently with desktop publishing software like Aldus PageMaker including 
            versions of Lorem Ipsum.
          `}
        </p>
      </div>
      <div className="channels-container">
        <div className="channels">
          <div className="channel-header">
            <span>Hoy</span>
          </div>
          {channels.map(({ id, image, number } : Channel, pos) => (
            <ChannelInfo key={`${id}_${pos}`} image={image} number={number} />
          ))}
        </div>
        <div className="events-container" id="events-container">
          <div className="time-line">
            {timeLine.map((value) => (
              <div className="time-line-element">
                <span>{value}</span>
              </div>
            ))}
          </div>
          {channels.map(({ id: idChannel, events } : Channel, pos) => (
            <div key={`${idChannel}_${pos}_event`} className="events" >
              {events && events.map((event : Event, posEv) => (
                <EventCard
                  key={`${posEv}_${pos}`}
                  name={event.name}
                  date_begin={event.date_begin}
                  date_end={event.date_end}
                  selected={
                    selectedEvent.channel_id === idChannel && selectedEvent.id === posEv.toString()
                  }
                  onClick={() => onClickEvent.call(this, { ...event, id: posEv.toString() })}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalEPG;