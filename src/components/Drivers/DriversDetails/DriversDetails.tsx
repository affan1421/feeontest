import React, { useState } from "react";
import styles from "./DriversDetails.module.css";
import { Close, HomeMax } from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";
import user from "@/assests/user.png";
import gender from "@/assests/fi-rr-venus-mars.svg";
import dob from "@/assests/Vector (1).svg";
import home from "@/assests/Vector (2).svg";
import bloodgrp from "@/assests/fi-rr-humidity.svg";
import phone from "@/assests/fi-rr-phone-call.svg";
import salary from "@/assests/fi-rr-money-bills-simple.svg";
import dl from "@/assests/fi-rr-id-badge.svg";
import route from "@/assests/route (1).svg";
import vector from "@/assests/directions_bus.svg";

const DriversDetails = (props: any) => {
  const drivers = props.drivers;

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleClose = () => {
    props.setDriverDialog(false);
  };

  const handleOpenPreviewDialog = (attachmentIndex: number) => {
    setSelectedAttachmentIndex(attachmentIndex);
    setPreviewDialogOpen(true);
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialogOpen(false);
  };

  const handleDownloadImage = () => {
    const attachmentUrl = drivers?.attachments[selectedAttachmentIndex];
    const link = document.createElement("a");
    link.href = attachmentUrl;
    link.download = `attachment_${selectedAttachmentIndex}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageClick = (index: number) => {
    setSelectedAttachmentIndex(index);
    setSelectedImage(index);
  };

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="xl">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Details</h1>
          <IconButton sx={{ p: "10px" }} onClick={() => props.setDriverDialog(false)}>
            <Close />
          </IconButton>
        </div>
        <div className={styles.row}>
          <div className={styles.profile}>
            <img className={styles.user} src={user} />
            <div className={styles.details}>
              <span className={styles.label}>{drivers?.name}</span>
              <span>Driver</span>
            </div>
          </div>
          <button className={styles.preview} onClick={() => handleOpenPreviewDialog(selectedAttachmentIndex)}>Preview Proof</button>
        </div>
        <div className={styles.border}></div>
        <div>
          <span className={styles.detailheader}>PERSONAL DETAILS</span>
        </div>
        <div className={styles.detailrow}>
          <div className={styles.grouper}>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={salary} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Salary</span>
                <span className={styles.Dlabel}>{formatter.format(drivers?.salary)}</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={phone} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Contact Number</span>
                <span className={styles.Dlabel}>{drivers?.contactNumber}</span>
              </div>
            </div>
          </div>
          <div className={styles.grouper}>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={dl} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>DL Number</span>
                <span className={styles.Dlabel}>{drivers?.drivingLicense}</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={phone} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Emergency Number</span>
                <span className={styles.Dlabel}>{drivers?.emergencyNumber}</span>
              </div>
            </div>
          </div>
          <div className={styles.grouper}>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={vector} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Assigned Vehicle</span>
                <span className={styles.Dlabel}>{drivers?.assignedVehicle}</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={route} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Assigned Trips</span>
                <span className={styles.Dlabel}>{drivers?.assignedTrips}</span>
              </div>
            </div>
          </div>
          <div className={styles.grouper}>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={dl} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Aadhar Number</span>
                <span className={styles.Dlabel}>{drivers?.aadharNumber}</span>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={route} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Route</span>
                <span className={styles.Dlabel}>{drivers?.selectedRoute?.routeName}</span>
              </div>
            </div>
          </div>
          <div className={styles.grouper}>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={gender} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Blood Group</span>
                <span className={styles.Dlabel}>{drivers?.bloodGroup}</span>
              </div>
            </div>
          </div>
          <div className={styles.grouper}>
            <div className={styles.card}>
              <div className={styles.img}>
                <img src={home} />
              </div>
              <div className={styles.name}>
                <span className={styles.detailheader}>Address</span>
                <span className={styles.Dlabel}>{drivers?.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={previewDialogOpen} onClose={handleClosePreviewDialog} maxWidth="xl">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Proof Preview</h1>
            <IconButton sx={{ p: "10px" }} onClick={handleClosePreviewDialog}>
              <Close />
            </IconButton>
          </div>
          <div className={styles.imagePreview}>
            {drivers?.attachments.map((attachment: string, index: number) => (
              <div key={index} className={styles.displayImage}>
                <img
                  src={attachment}
                  alt={`Attachment ${index}`}
                  onClick={() => handleImageClick(index)}
                  className={selectedImage === index ? styles.selectedImage : ''}
                />
              </div>
            ))}
          </div>
          <div className={styles.downloadButtonContainer}>
            <button className={styles.downloadButton} onClick={handleDownloadImage}>Download</button>
          </div>
        </div>
      </Dialog>
    </Dialog>
  );
};

export default DriversDetails;
