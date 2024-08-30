import React from 'react';
import PropTypes from 'prop-types';

const ProfilePhoto = ({ src, alt }) => (
  <img src={src} alt={alt} className="home__profile-photo" />
);

ProfilePhoto.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ProfilePhoto;