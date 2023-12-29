import api from "@/store/api";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface AttachemntFiles {
  idProof: { loading: boolean; url: string };
  ageProof: { loading: boolean; url: string };
  residenceProof: { loading: boolean; url: string };
  guardianIdProof: { loading: boolean; url: string };
  categoryCertificates: { loading: boolean; url: string };
  incomeCertificate: { loading: boolean; url: string };
}

const attachemntFilesInitialData = {
  idProof: { loading: false, url: "" },
  ageProof: { loading: false, url: "" },
  residenceProof: { loading: false, url: "" },
  guardianIdProof: { loading: false, url: "" },
  categoryCertificates: { loading: false, url: "" },
  incomeCertificate: { loading: false, url: "" },
};

const DocumentUpload = ({ goToPage, existingData }: { existingData: any; goToPage: (pageNumber: number) => void }) => {
  const uploadFileApi = api((state) => state.uploadFile);
  const applicationNo = useParams()?.id;
  const admissionUpdateDocumentUploadApi = api((state) => state.admissionUpdateDocumentUpload);
  //
  const [attachmentFiles, setAttachmentsFiles] = useState<AttachemntFiles>(attachemntFilesInitialData);

  const svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
      <mask id="mask0_9495_49482" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="49">
        <rect y="0.5" width="48" height="48" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_9495_49482)">
        <path
          d="M12.6346 39.5C9.98582 39.5 7.71787 38.5546 5.8307 36.6639C3.94357 34.7733 3 32.5007 3 29.8462C3 27.3744 3.8282 25.2109 5.4846 23.3558C7.141 21.5007 9.17945 20.4565 11.6 20.2232C12.1128 17.1181 13.5416 14.5597 15.8865 12.5482C18.2313 10.5367 20.9627 9.53088 24.0806 9.53088C27.6072 9.53088 30.5677 10.7922 32.9621 13.3148C35.3565 15.8374 36.5537 18.8722 36.5537 22.4193V24.3116H37.1691C39.3511 24.2321 41.2018 24.9206 42.721 26.377C44.2402 27.8334 44.9999 29.6731 44.9999 31.8962C44.9999 33.9782 44.2595 35.766 42.7787 37.2596C41.2979 38.7532 39.5165 39.5 37.4345 39.5H25.7499C24.9656 39.5 24.2888 39.2153 23.7194 38.6459C23.15 38.0765 22.8653 37.3996 22.8653 36.6153V23.7538L18.4653 28.1731L16.8345 26.5616L23.9999 19.3962L31.1653 26.5616L29.5345 28.1731L25.1345 23.7538V36.6153C25.1345 36.7692 25.1986 36.9102 25.3268 37.0385C25.455 37.1667 25.5961 37.2308 25.7499 37.2308H37.396C38.8704 37.2308 40.1281 36.7092 41.1691 35.6661C42.2101 34.623 42.7306 33.3686 42.7306 31.9027C42.7306 30.4368 42.2101 29.1834 41.1691 28.1423C40.1281 27.1013 38.8681 26.5808 37.3892 26.5808H34.2845V22.4193C34.2845 19.5165 33.2858 17.0209 31.2883 14.9325C29.2909 12.8442 26.8377 11.8 23.9288 11.8C21.0198 11.8 18.5583 12.8442 16.5442 14.9325C14.5301 17.0209 13.523 19.5165 13.523 22.4193H12.5153C10.5256 22.4193 8.82043 23.1347 7.3999 24.5654C5.9794 25.9962 5.26915 27.7557 5.26915 29.844C5.26915 31.8656 5.98815 33.6021 7.42615 35.0536C8.86415 36.5051 10.6003 37.2308 12.6346 37.2308H19.096V39.5H12.6346Z"
          fill="#2760EA"
        />
      </g>
    </svg>
  );

  const uploadFile = async (key: keyof AttachemntFiles, file: File) => {
    if (!file) return;
    setAttachmentsFiles((pre) => ({ ...pre, [key]: { url: pre[key]?.url, loading: true } }));
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data: response_data } = await uploadFileApi(formData);
      setAttachmentsFiles((pre) => ({ ...pre, [key]: { url: response_data?.message, loading: false } }));
    } catch (error) {
      console.log(error);
    } finally {
      setAttachmentsFiles((pre) => ({ ...pre, [key]: { url: pre[key]?.url, loading: false } }));
    }
  };

  const submitData = async () => {
    const { data: response_data } = await admissionUpdateDocumentUploadApi({
      applicationNo: applicationNo,
      mandatoryAttachments: [
        attachmentFiles?.idProof?.url,
        attachmentFiles?.ageProof?.url,
        attachmentFiles?.residenceProof?.url,
      ],
      attachments: [
        attachmentFiles?.guardianIdProof?.url,
        attachmentFiles?.categoryCertificates?.url,
        attachmentFiles?.incomeCertificate?.url,
      ],
    });
    if (response_data?.success) goToPage(5);
  };

  useEffect(() => {
    setAttachmentsFiles((pre) => ({
      ...pre,
      idProof: { loading: false, url: existingData?.mandatoryAttachments?.[0] || "" },
      ageProof: { loading: false, url: existingData?.mandatoryAttachments?.[1] || "" },
      residenceProof: { loading: false, url: existingData?.mandatoryAttachments?.[2] || "" },
      guardianIdProof: { loading: false, url: existingData?.attachments?.[0] || "" },
      categoryCertificates: { loading: false, url: existingData?.attachments?.[1] || "" },
      incomeCertificate: { loading: false, url: existingData?.attachments?.[2] || "" },
    }));
  }, [existingData]);

  return (
    <Stack gap={3}>
      <Typography variant="h6">Document Upload</Typography>
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Typography fontWeight={"bold"}>Mandatory documents</Typography>
        <Divider />
        <Stack direction={"row"} gap={2}>
          <Stack gap={1}>
            <Typography>ID Proof</Typography>
            <label style={{ cursor: "pointer" }} htmlFor="attach_1">
              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  width: "200px",
                  height: "200px",
                  border: `3px dashed ${attachmentFiles?.idProof.url ? "green" : "#C5C5C5"}`,
                  borderRadius: 3,
                  backgroundColor: "#F6F8FE",
                }}
                gap={1}
              >
                {svg}
                <input
                  onChange={(e) => uploadFile("idProof", e.target?.files?.[0] as File)}
                  type="file"
                  hidden
                  id="attach_1"
                />
                <Typography color={"dimgray"}>
                  {attachmentFiles?.idProof.loading
                    ? "Uploading..."
                    : attachmentFiles?.idProof.url
                    ? "Click to re-upload"
                    : "Click here to upload file"}
                </Typography>
                <Typography color="blue" textTransform={"uppercase"}>
                  Browse
                </Typography>
              </Stack>
            </label>
          </Stack>
          {/*  */}
          <Stack gap={1}>
            <Typography>Age Proof</Typography>
            <label style={{ cursor: "pointer" }} htmlFor="attach_2">
              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  width: "200px",
                  height: "200px",
                  border: `3px dashed ${attachmentFiles?.ageProof.url ? "green" : "#C5C5C5"}`,
                  borderRadius: 3,
                  backgroundColor: "#F6F8FE",
                }}
                gap={1}
              >
                {svg}
                <Typography color={"dimgray"}>
                  {attachmentFiles?.ageProof.loading
                    ? "Uploading..."
                    : attachmentFiles?.ageProof.url
                    ? "Click to re-upload"
                    : "Click here to upload file"}
                </Typography>
                <input
                  onChange={(e) => uploadFile("ageProof", e.target?.files?.[0] as File)}
                  type="file"
                  hidden
                  id="attach_2"
                />
                <Typography color="blue" textTransform={"uppercase"}>
                  Browse
                </Typography>
              </Stack>
            </label>
          </Stack>
          {/*  */}
          <Stack gap={1}>
            <Typography>Residence Proof</Typography>
            <label style={{ cursor: "pointer" }} htmlFor="attach_3">
              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  width: "200px",
                  height: "200px",
                  border: `3px dashed ${attachmentFiles?.residenceProof.url ? "green" : "#C5C5C5"}`,
                  borderRadius: 3,
                  backgroundColor: "#F6F8FE",
                }}
                gap={1}
              >
                {svg}
                <Typography color={"dimgray"}>
                  {attachmentFiles?.residenceProof.loading
                    ? "Uploading..."
                    : attachmentFiles?.residenceProof.url
                    ? "Click to re-upload"
                    : "Click here to upload file"}
                </Typography>
                <input
                  onChange={(e) => uploadFile("residenceProof", e.target?.files?.[0] as File)}
                  type="file"
                  hidden
                  id="attach_3"
                />
                <Typography color="blue" textTransform={"uppercase"}>
                  Browse
                </Typography>
              </Stack>
            </label>
          </Stack>
        </Stack>
      </Stack>
      {/*  */}
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Typography fontWeight={"bold"}>Conditional</Typography>
        <Divider />
        <Stack direction={"row"} gap={2}>
          <Stack gap={1}>
            <Typography>Guardians ID Proof</Typography>
            <label style={{ cursor: "pointer" }} htmlFor="attach_4">
              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  width: "200px",
                  height: "200px",
                  border: `3px dashed ${attachmentFiles?.guardianIdProof.url ? "green" : "#C5C5C5"}`,
                  borderRadius: 3,
                  backgroundColor: "#F6F8FE",
                }}
                gap={1}
              >
                {svg}
                <Typography color={"dimgray"}>
                  {attachmentFiles?.guardianIdProof.loading
                    ? "Uploading..."
                    : attachmentFiles?.guardianIdProof.url
                    ? "Click to re-upload"
                    : "Click here to upload file"}
                </Typography>
                <input
                  onChange={(e) => uploadFile("guardianIdProof", e.target?.files?.[0] as File)}
                  type="file"
                  hidden
                  id="attach_4"
                />
                <Typography color="blue" textTransform={"uppercase"}>
                  Browse
                </Typography>
              </Stack>
            </label>
          </Stack>
          {/*  */}
          <Stack gap={1}>
            <Typography>Category certificate</Typography>
            <label style={{ cursor: "pointer" }} htmlFor="attach_5">
              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  width: "200px",
                  height: "200px",
                  border: `3px dashed ${attachmentFiles?.categoryCertificates.url ? "green" : "#C5C5C5"}`,
                  borderRadius: 3,
                  backgroundColor: "#F6F8FE",
                }}
                gap={1}
              >
                {svg}
                <Typography color={"dimgray"}>
                  {attachmentFiles?.categoryCertificates.loading
                    ? "Uploading..."
                    : attachmentFiles?.categoryCertificates.url
                    ? "Click to re-upload"
                    : "Click here to upload file"}
                </Typography>
                <input
                  onChange={(e) => uploadFile("categoryCertificates", e.target?.files?.[0] as File)}
                  type="file"
                  hidden
                  id="attach_5"
                />
                <Typography color="blue" textTransform={"uppercase"}>
                  Browse
                </Typography>
              </Stack>
            </label>
          </Stack>
          {/*  */}
          <Stack gap={1}>
            <Typography>Income certificate</Typography>
            <label style={{ cursor: "pointer" }} htmlFor="attach_6">
              <Stack
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                  width: "200px",
                  height: "200px",
                  border: `3px dashed ${attachmentFiles?.incomeCertificate.url ? "green" : "#C5C5C5"}`,
                  borderRadius: 3,
                  backgroundColor: "#F6F8FE",
                }}
                gap={1}
              >
                {svg}
                <Typography color={"dimgray"}>
                  {attachmentFiles?.incomeCertificate.loading
                    ? "Uploading..."
                    : attachmentFiles?.incomeCertificate.url
                    ? "Click to re-upload"
                    : "Click here to upload file"}
                </Typography>
                <input
                  onChange={(e) => uploadFile("incomeCertificate", e.target?.files?.[0] as File)}
                  type="file"
                  hidden
                  id="attach_6"
                />
                <Typography color="blue" textTransform={"uppercase"}>
                  Browse
                </Typography>
              </Stack>
            </label>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={"row"} justifyContent={"end"} gap={1}>
        <Button
          variant="outlined"
          onClick={() => {
            goToPage(3);
          }}
        >
          Go back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            submitData();
          }}
        >
          Save and continue
        </Button>
      </Stack>
    </Stack>
  );
};

export default DocumentUpload;
