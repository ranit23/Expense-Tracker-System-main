import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Camera, X } from "lucide-react";
import { useGlobalContext } from "../../context/globalContext";
import { useNavigate } from "react-router-dom";

const CameraButton = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { uploadBillImage } = useGlobalContext();

  // State Management
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ New: Loading state

  // Load position from local storage on component mount
  useEffect(() => {
    const storedPosition = localStorage.getItem("cameraButtonPosition");
    if (storedPosition) {
      setPosition(JSON.parse(storedPosition));
    }
  }, []);

  // Handle file capture
  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setShowPreview(true);
    }
  };

  // Open file input on double click
  const handleDoubleClick = () => {
    fileInputRef.current.click();
  };

  // Handle dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
        localStorage.setItem("cameraButtonPosition", JSON.stringify(position));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startPos, position]);

  // ✅ Handle file upload with loader
  const handleUpload = async () => {
    try {
      const file = fileInputRef.current.files[0];
      if (!file) return;

      setIsLoading(true); // Start loader
      await uploadBillImage(file);
      setNotification({ message: "Image uploaded successfully!", type: "success" });
      
      setTimeout(() => {
        setNotification(null);
        setShowPreview(false);
        setImage(null);
        setIsLoading(false); // Stop loader
        navigate("/dashboard");

        // ✅ Refresh the page after 1 second
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 1000);
    } catch (error) {
      setIsLoading(false); // Stop loader on error
      setNotification({ message: "Failed to upload image.", type: "error" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <>
      {/* Show notifications */}
      {notification && <Notification type={notification.type}>{notification.message}</Notification>}

      {/* Camera Button */}
      <StyledButton
        onDoubleClick={handleDoubleClick}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Camera size={24} />
        {showTooltip && <Tooltip>Double click to select an image</Tooltip>}
      </StyledButton>

      {/* Hidden File Input */}
      <input type="file" accept="image/*" capture="environment" ref={fileInputRef} style={{ display: "none" }} onChange={handleCapture} />

      {/* Preview and Upload */}
      {showPreview && (
        <PreviewContainer>
          <CloseButton onClick={() => setShowPreview(false)}>
            <X size={24} />
          </CloseButton>
          <PreviewImage src={image} alt="Captured bill" />

          {/* Show Loader or Upload Button */}
          {isLoading ? (
            <Loader>Uploading...</Loader> // ✅ Show loading text
          ) : (
            <UploadButton onClick={handleUpload}>Upload</UploadButton>
          )}
        </PreviewContainer>
      )}
    </>
  );
};

const StyledButton = styled.button`
  position: fixed;
  z-index: 999;
  background: rgb(228, 225, 227);
  color: black;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: grab;
  &:active {
    cursor: grabbing;
    transform: scale(1.1);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 60px;
  background: black;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 10px;
  white-space: nowrap;
`;

const PreviewContainer = styled.div`
  position: fixed;
  z-index: 998;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 10px;
`;

const UploadButton = styled.button`
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #218838;
  }
`;

const Loader = styled.div`
  font-size: 16px;
  color: #28a745;
  margin-top: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ type }) => (type === "success" ? "#28a745" : "#dc3545")};
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  z-index: 1000;
`;

export default CameraButton;
