import { Close } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import api from "@/store/api";
import Selector from "@/Elements/Selector/Selector";

export default function AddLeadModal({ handleModalClose }: any) {
  const [uploadingFileStatus, setUploadFileStatus] = useState("Add Attachment");
  const [file, setFile] = useState(null);
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [data, setData] = useState<any>({
    classId: "",
    section: "",
    applicationNo: null,
    studentName: "",
    gender: "Female",
    dob: "",
    mobile: "",
    email: "",
    fatherName: "",
    motherName: "",
    leadSource: "",
    prevSchoolName: "",
    comment: "",
    attachments: [],
  });

  const uploadAttachmentApi = api((state) => state.uploadFile);
  const getAdmissionClassApi = api((state) => state.getAdmissionClass);
  const getAdmissionSectionsApi = api((state) => state.getAdmissionSections);
  const AddLeadApi = api((state) => state.AddLead);

  const uploadAttachment = async (): Promise<string> => {
    setUploadFileStatus("Uploading Attachment...");
    try {
      if (file == null) throw "Attachment file is requred";
      const formData = new FormData();
      formData.append("file", file);
      const {
        data: { message },
      } = await uploadAttachmentApi(formData);

      //   setAttachments((pre: any) => [...pre, message]);
      setData((prev: any) => ({ ...prev, attachments: [...prev?.attachments, message] }));
      setUploadFileStatus("Add another attachment");
      return message;
    } catch (error) {
      setUploadFileStatus("Failed to upload retry ?");
      throw "Error while uploading file";
    }
  };

  const handleSave = async () => {
    const { data: response_data } = await AddLeadApi(data);
    if (response_data?.success == true) handleModalClose();
  };
  const handleChange = () => {};

  const fetchClassList = async () => {
    const { data } = await getAdmissionClassApi();
    console.log("class list", data);
    setClassList(data?.data || []);
  };

  const fetchSectionList = async () => {
    console.log("called");
    const result = await getAdmissionSectionsApi(data?.classId);
    console.log("section list", result);
    setSectionList(result?.data?.data || []);
  };

  useEffect(() => {
    fetchClassList();
  }, []);

  useEffect(() => {
    data?.classId !== "default" && data?.classId && fetchSectionList();
  }, [data?.classId]);

  useEffect(() => {
    file && uploadAttachment();
  }, [file]);

  return (
    <Stack p={3}>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Typography fontSize={16} textTransform={"uppercase"} fontWeight={500}>
          Lead details
        </Typography>
        <IconButton>
          <Close onClick={handleModalClose} />
        </IconButton>
      </Stack>
      <Divider />

      <Stack gap={2} py={1}>
        <TextField
          onChange={(e: any) =>
            setData((prev: any) => ({ ...prev, studentName: e?.target?.value }))
          }
          label={"Name of Student"}
          size="small"
          id="name"
        />

        <Stack width={"100%"} direction={"row"} gap={2}>
          <TextField
            onChange={(e: any) =>
              setData((prev: any) => ({ ...prev, applicationNo: Number(e?.target?.value) }))
            }
            fullWidth
            size="small"
            type="number"
            label={"Application number"}
          />
          <TextField
            onChange={(e: any) => setData((prev: any) => ({ ...prev, dob: e?.target?.value }))}
            fullWidth
            size="small"
            type="date"
          />
        </Stack>

        <FormControl sx={{ width: "570px" }}>
          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            row
            value={data?.gender}
            onChange={(e: any) => setData((prev: any) => ({ ...prev, gender: e?.target?.value }))}
          >
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <TextField
            onChange={(e: any) =>
              setData((prev: any) => ({ ...prev, fatherName: e?.target?.value }))
            }
            fullWidth
            size="small"
            label={"Father's name"}
          />
          <TextField
            onChange={(e: any) =>
              setData((prev: any) => ({ ...prev, motherName: e?.target?.value }))
            }
            fullWidth
            size="small"
            label={"Mother's Name"}
          />
        </Stack>

        <Stack width={"100%"} direction={"row"} gap={2}>
          {/* <TextField fullWidth size="small" label={"Joining Class"} /> */}
          <Selector
            value={data?.classId ? data?.classId : "default"}
            disabled={classList?.length > 0 ? false : true}
            items={classList}
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, classId: e === "default" ? "" : e }))
            }
            defaultValue="Select Class"
          />
          <Selector
            value={data?.section ? data?.section : "default"}
            items={sectionList}
            onChange={(e: any) =>
              setData((prev: any) => ({ ...prev, section: e === "default" ? "" : e }))
            }
            disabled={data?.classId ? false : true}
            defaultValue="Select Section"
          />
        </Stack>

        <Stack width={"100%"} direction={"row"} gap={2}>
          <TextField
            onChange={(e: any) => setData((prev: any) => ({ ...prev, mobile: e?.target?.value }))}
            fullWidth
            size="small"
            label={"Contact number"}
          />
          <TextField
            onChange={(e: any) => setData((prev: any) => ({ ...prev, email: e?.target?.value }))}
            fullWidth
            size="small"
            label={"Mail address"}
          />
        </Stack>

        <Stack width={"100%"} direction={"row"} gap={2}>
          <TextField
            onChange={(e: any) =>
              setData((prev: any) => ({ ...prev, leadSource: e?.target?.value }))
            }
            fullWidth
            size="small"
            label={"Lead source"}
          />
          <TextField
            onChange={(e: any) =>
              setData((prev: any) => ({ ...prev, prevSchoolName: e?.target?.value }))
            }
            fullWidth
            size="small"
            label={"Previous school"}
          />
        </Stack>
        <TextField
          onChange={(e: any) => setData((prev: any) => ({ ...prev, comment: e?.target?.value }))}
          fullWidth
          size="small"
          multiline
          rows={3}
          label={"Comment"}
        />

        <Stack>
          <Stack pb={1} direction={"row"} gap={1} alignItems={"center"}>
            <label style={{ alignItems: "center" }} htmlFor="attachment">
              <input
                onChange={(e: any) => setFile(e?.target?.files?.[0] || null)}
                id="attachment"
                type="file"
                hidden
              />
              <Stack
                alignItems={"center"}
                sx={{ cursor: "pointer" }}
                direction={"row"}
                color={"blue"}
              >
                <AttachFileIcon />
                <Typography noWrap>{uploadingFileStatus}</Typography>
              </Stack>
            </label>
            <Stack
              direction={"row"}
              gap={1}
              overflow={"auto"}
              className="custom-scroll-bar custom-hidden-scroll-bar"
            >
              {data?.attachments?.length > 0 &&
                data?.attachments?.map((attachment: any) => {
                  const name = decodeURI(attachment?.split("/")?.pop() as string);
                  return (
                    <Chip
                      label={name}
                      onDelete={() =>
                        setData((prev: any) => {
                          return {
                            ...prev,
                            attachments: prev.attachments?.filter((e: any) => e !== attachment),
                          };
                        })
                      }
                      variant="outlined"
                    />
                  );
                })}
            </Stack>
          </Stack>
          <Stack>
            <Button variant="contained" onClick={handleSave}>
              Save Lead Details
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
