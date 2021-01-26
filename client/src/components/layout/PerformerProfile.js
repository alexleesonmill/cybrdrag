import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

const PerformerProfile = ({ performer: { _id, name, worth, avatar } }) => {
  return (
    <div className='performerCard'>
      <img src={avatar} className='performerAvatar' alt='Avatar'></img>
      <div className='performerName'>{name}</div>
      <h1 className='performerWorth'>
        {worth.toLocaleString()}
        <i className='fas fa-dice-d20'></i>
      </h1>
    </div>
  );
};

PerformerCard.propTypes = {
  performer: PropTypes.object.isRequired,
};

export default PerformerProfile;
