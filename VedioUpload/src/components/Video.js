import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

// Main component for uploading and managing videos
const VideoUpload = () => {
  // State to store the list of videos
  const [videos, setVideos] = useState([]);
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  // State to store the currently selected video
  const [currentVideo, setCurrentVideo] = useState(null);
  // State to control the filter for bookmarked videos
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  // Handle file input changes and store the uploaded videos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const videoFiles = files.map(file => ({
      url: URL.createObjectURL(file), // Create a URL for the video file
      name: file.name, // Store the name of the video file
      bookmarked: false, // Initial bookmark state
    }));
    setVideos([...videos, ...videoFiles]); // Update the video list state
  };

  // Handle click on a video thumbnail to open the modal
  const handleVideoClick = (video) => {
    setCurrentVideo(video); // Set the current video
    setShowModal(true); // Show the modal
  };

  // Close the modal and reset the current video
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setCurrentVideo(null); // Reset the current video
  };

  // Toggle bookmark status for the current video
  const handleBookmark = () => {
    const updatedVideos = videos.map(v => 
      v.url === currentVideo.url ? { ...v, bookmarked: !v.bookmarked } : v
    );
    setVideos(updatedVideos); // Update the video list with the new bookmark status
    setCurrentVideo({ ...currentVideo, bookmarked: !currentVideo.bookmarked }); // Update the current video
  };

  // Remove the current video from the list
  const handleRemoveVideo = () => {
    const updatedVideos = videos.filter(v => v.url !== currentVideo.url);
    setVideos(updatedVideos); // Update the video list
    handleCloseModal(); // Close the modal
  };

  // Toggle the filter for bookmarked videos
  const handleFilterChange = () => {
    setFilterBookmarked(!filterBookmarked); // Toggle the filter state
  };

  // Determine which videos to display based on the filter
  const videosToShow = filterBookmarked ? videos.filter(v => v.bookmarked) : videos;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Upload Videos</h1>
      {/* File input for uploading videos */}
      <input type="file" accept="video/*" multiple onChange={handleFileChange} className="form-control mb-3" />
      <div className="form-check mb-3">
        {/* Checkbox for filtering bookmarked videos */}
        <input 
          type="checkbox" 
          className="form-check-input" 
          id="filterBookmarked" 
          checked={filterBookmarked} 
          onChange={handleFilterChange} 
        />
        <label className="form-check-label" htmlFor="filterBookmarked">
          Show only bookmarked videos
        </label>
      </div>
      <div className="row">
        {/* Display video thumbnails */}
        {videosToShow.map((video, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="video-thumbnail">
              <img
                src={`https://img.youtube.com/vi/${video.url.split('/').pop()}/maxresdefault.jpg`}
                className="img-fluid"
                alt={video.name}
                onClick={() => handleVideoClick(video)}
                style={{ cursor: 'pointer' }}
              />
              <div className="overlay">
                <i className="fas fa-play"></i>
              </div>
            </div>
            <p className="video-name">{video.name}</p>
          </div>
        ))}
      </div>
      {currentVideo && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{currentVideo.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <video src={currentVideo.url} controls className="img-fluid mb-3" />
            <div className="d-flex justify-content-between">
              {/* Button to toggle bookmark status */}
              <Button variant={currentVideo.bookmarked ? 'danger' : 'primary'} onClick={handleBookmark}>
                {currentVideo.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </Button>
              {/* Button to remove the video */}
              <Button variant="secondary" onClick={handleRemoveVideo}>
                Remove Video
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default VideoUpload;
