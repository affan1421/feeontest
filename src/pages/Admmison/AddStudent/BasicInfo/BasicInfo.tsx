import Selector from "@/Elements/Selector/Selector";
import { dateFormatter } from "@/helpers/dateFormatter";
import api from "@/store/api";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const religionList = [
  { value: "Hindu", name: "Hindu" },
  { value: "Muslim", name: "Muslim" },
  { value: "Christian", name: "Christian" },
  { value: "Jain", name: "Jain" },
  { value: "Sikh", name: "Sikh" },
  { value: "Parsi", name: "Parsi" },
];

const bloodGroupsList = [
  { value: "A+", name: "A+" },
  { value: "A-", name: "A-" },
  { value: "B+", name: "B+" },
  { value: "B-", name: "B-" },
  { value: "O+", name: "O+" },
  { value: "O-", name: "O-" },
  { value: "AB+", name: "AB+" },
  { value: "AB-", name: "AB-" },
];

interface StudentDetails {
  name?: string;
  photoURL?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  joiningClass?: string;
  religion?: string;
  section?: string;
  aadharNumber?: string;
  email?: string;
  mobile?: number;
}

const studentDetailsInitalValue = {
  name: "",
  photoURL: "",
  dob: "",
  gender: "",
  bloodGroup: "default",
  joiningClass: "",
  religion: "default",
  section: "",
  aadharNumber: "",
  email: "",
  mobile: 0,
};

interface ParentDetails {
  fathersName?: string;
  fathersContactNumber?: string;
  fathersOccupation?: string;
  fathersEmailId?: string;
  fathersHightestEducation?: string;
  mothersName?: string;
  mothersContactNumber?: string;
  mothersOccupation?: string;
  mothersEmailId?: string;
  mothersHightestEducation?: string;
  residentialAddress?: string;
  permanentAddress?: string;
  guardian?: string;
  guardianName?: string;
  guardianContactNumber?: string;
  guardianOccupation?: string;
  guardianEmailId?: string;
  guardianHightestEducation?: string;
}

const parentDetailsInitalValue = {
  fathersName: "",
  fathersContactNumber: "",
  fathersOccupation: "",
  fathersEmailId: "",
  fathersHightestEducation: "",
  mothersName: "",
  mothersContactNumber: "",
  mothersOccupation: "",
  mothersEmailId: "",
  mothersHightestEducation: "",
  residentialAddress: "",
  permanentAddress: "",
  gaurdian: "",
  guardianName: "",
  guardianContactNumber: "",
  guardianOccupation: "",
  guardianEmailId: "",
  guardianHightestEducation: "",
};

interface MedicalInfo {
  healthCondition?: string;
  height?: number;
  weight?: number;
  specialNeeds?: string;
  disability?: boolean;
}

const mediaclInfoInitalValue = {
  healthCondition: "",
  height: 0,
  weight: 0,
  specialNeeds: "",
  disability: false,
};

const BasicInfo = ({
  goToPage,
  existingData,
}: {
  existingData: any;
  goToPage: (pageNumber: number) => void;
}) => {
  const applicationId = useParams()?.id;
  const uploadFileApi = api((state) => state.uploadFile);
  const admissionUpdateBasicLeadsInfoApi = api((state) => state.admissionUpdateBasicLeadsInfo);

  const [file, setFile] = useState<File | null>(null);

  const [studentDetails, setStudentDetails] = useState<StudentDetails>(studentDetailsInitalValue);
  const [parentDetails, setParentDetails] = useState<ParentDetails>(parentDetailsInitalValue);
  const [userAddressRadio, setUserAddressRadio] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>(mediaclInfoInitalValue);
  //----------------------
  const [showParentInfo, setShowParentInfo] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);

  // ... (other state variables and useEffect)

  const handleParentInfoToggle = () => {
    setShowParentInfo(!showParentInfo);
  };

  const handleMedicalInfoToggle = () => {
    setShowMedicalInfo(!showMedicalInfo);
  };
  //---------------------------------
  const handleImageUpload = async () => {
    if (file == null) return;
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await uploadFileApi(formData);
    setStudentDetails((pre) => ({ ...pre, photoURL: data?.message }));
  };

  useEffect(() => {
    file && handleImageUpload();
  }, [file]);

  useEffect(() => {
    setStudentDetails((pre) => ({
      ...pre,
      name: existingData?.studentName,
      dob: dateFormatter(new Date(existingData?.dob), { format: "yyyy-mm-dd" }),
      email: existingData?.email,
      gender: existingData?.gender,
      joiningClass: existingData?.className,
      section: existingData?.sectionName,
      mobile: existingData?.mobile,
      aadharNumber: existingData?.aadhar,
      photoURL: existingData?.photoURL,
      bloodGroup: existingData?.bloodGroup,
      religion: existingData?.religion,
    }));
    setParentDetails((pre) => ({
      ...pre,
      fathersName: existingData?.parentsInfo?.fatherName,
      fathersEmailId: existingData?.parentsInfo?.fatherEmail,
      fathersContactNumber: existingData?.parentsInfo?.fatherMobileNo,
      fathersHightestEducation: existingData?.parentsInfo?.fatherHighestQualification,
      fathersOccupation: existingData?.parentsInfo?.fatherOccupation,
      mothersName: existingData?.parentsInfo?.motherName,
      mothersEmailId: existingData?.parentsInfo?.mothersEmailId,
      mothersContactNumber: existingData?.parentsInfo?.motherMobileNo,
      mothersHightestEducation: existingData?.parentsInfo?.motherHighestQualification,
      mothersOccupation: existingData?.parentsInfo?.motherOccupation,
      guardian: existingData?.parentsInfo?.guardian,
      guardianName: existingData?.parentsInfo?.guardianName,
      guardianContactNumber: existingData?.parentsInfo?.guardianContactNumber,
      guardianOccupation: existingData?.parentsInfo?.guardianOccupation,
      guardianEmailId: existingData?.parentsInfo?.guardianEmailId,
      guardianHightestEducation: existingData?.parentsInfo?.guardianHightestEducation,
      residentialAddress: existingData?.residentialAddress,
      permanentAddress: existingData?.permanentAddress,
    }));
    setMedicalInfo((pre) => ({
      ...pre,
      healthCondition: existingData?.medical?.healthCondition,
      height: existingData?.medical?.height,
      weight: existingData?.medical?.weight,
      disability: existingData?.medical?.disability,
    }));
  }, [existingData]);

  const handleSubmit = async () => {
    const data = {
      photoURL: studentDetails?.photoURL,
      applicationNo: applicationId,
      aadhar: studentDetails?.aadharNumber,
      religion: studentDetails?.religion,
      bloodGroup: studentDetails?.bloodGroup,
      //
      fatherName: parentDetails?.fathersName,
      fatherOccupation: parentDetails?.fathersOccupation,
      fatherHighestQualification: parentDetails?.fathersHightestEducation,
      fatherMobileNo: parentDetails?.fathersContactNumber,
      fatherEmail: parentDetails?.fathersEmailId,
      //
      motherName: parentDetails?.mothersName,
      motherOccupation: parentDetails?.mothersOccupation,
      motherHighestQualification: parentDetails?.mothersHightestEducation,
      motherMobileNo: parentDetails?.mothersContactNumber,
      motherEmail: parentDetails?.mothersEmailId,
      //
      guardian: parentDetails?.guardian,
      guardianName: parentDetails?.guardianName,
      guardianContactNumber: parentDetails?.guardianContactNumber,
      guardianOccupation: parentDetails?.guardianOccupation,
      guardianEmailId: parentDetails?.guardianEmailId,
      guardianHightestEducation: parentDetails?.guardianHightestEducation,
      //
      residentialAddress: parentDetails?.residentialAddress,
      permanentAddress: parentDetails?.permanentAddress,
      healthCondition: medicalInfo?.healthCondition,
      height: medicalInfo?.height,
      weight: medicalInfo?.weight,
      disability: medicalInfo?.disability,
      specialNeeds: medicalInfo?.specialNeeds,
    };
    //
    console.log(studentDetails, parentDetails, medicalInfo, data);
    const { data: response_data } = await admissionUpdateBasicLeadsInfoApi(data);
    if (response_data?.success) goToPage(2);
  };

  return (
    <Stack gap={3}>
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          border: "1px solid var(--border-color-1)",
        }}
        gap={2}
      >
        <Typography fontWeight={"bold"} variant="h6">
          Student Details
        </Typography>
        <Divider />
        <Stack direction={"row"} alignItems={"center"} gap={2} py={2}>
          <Stack
            sx={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px dashed gray",
            }}
          >
            {studentDetails?.photoURL && (
              <img
                style={{ height: "100%", width: "100%" }}
                src={studentDetails?.photoURL}
                alt=""
              />
            )}
          </Stack>
          <Stack alignItems={"start"}>
            <Typography>Profile Picture</Typography>
            <input
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] as File)}
              type="file"
              hidden
              id="profileImage"
            />
            <label htmlFor={"profileImage"}>
              <Typography
                textTransform={"uppercase"}
                color={"blue"}
                fontWeight={"bold"}
                sx={{ cursor: "pointer" }}
              >
                Upload
              </Typography>
            </label>
          </Stack>
        </Stack>
        <Stack gap={3} width={"100%"}>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Name of Student</Typography>
              <TextField
                value={studentDetails?.name}
                onChange={(e) => setStudentDetails((pre) => ({ ...pre, name: e.target.value }))}
                placeholder="Student name"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Date of Birth</Typography>
              <TextField
                value={studentDetails?.dob}
                onChange={(e) => setStudentDetails((pre) => ({ ...pre, dob: e.target.value }))}
                type="date"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Gender</Typography>
              <RadioGroup
                value={studentDetails?.gender}
                onChange={(e) => setStudentDetails((pre) => ({ ...pre, gender: e.target.value }))}
              >
                <Stack direction="row">
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                </Stack>
              </RadioGroup>
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Blood Group</Typography>
              <Selector
                value={studentDetails?.bloodGroup as string}
                onChange={(value) => setStudentDetails((pre) => ({ ...pre, bloodGroup: value }))}
                items={bloodGroupsList}
                defaultValue="Select blood group"
                hideClearButton
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Joining Class</Typography>
              <TextField
                disabled
                value={studentDetails?.joiningClass}
                onChange={(e) =>
                  setStudentDetails((pre) => ({ ...pre, joiningClass: e.target.value }))
                }
                placeholder="joining class"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Section</Typography>
              <TextField
                disabled
                value={studentDetails?.section}
                onChange={(e) => setStudentDetails((pre) => ({ ...pre, section: e.target.value }))}
                placeholder="section"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Religion</Typography>
              <Selector
                value={(studentDetails?.religion as string) || "default"}
                onChange={(value) => setStudentDetails((pre) => ({ ...pre, religion: value }))}
                items={religionList}
                defaultValue="Select religion"
                hideClearButton
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Aadhar Card Number</Typography>
              <TextField
                value={studentDetails?.aadharNumber}
                onChange={(e) =>
                  setStudentDetails((pre) => ({ ...pre, aadharNumber: e.target.value }))
                }
                placeholder="Aadhar No."
                size="small"
                type="number"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Email</Typography>
              <TextField
                value={studentDetails?.email}
                onChange={(e) => setStudentDetails((pre) => ({ ...pre, email: e.target.value }))}
                placeholder="email"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Mobile Number</Typography>
              <TextField
                value={studentDetails?.mobile}
                onChange={(e) =>
                  setStudentDetails((pre) => ({
                    ...pre,
                    mobile: e.target.value as unknown as number,
                  }))
                }
                placeholder="email"
                size="small"
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {/*  */}
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          border: "1px solid var(--border-color-1)",
        }}
        gap={2}
      >
        <Typography
          fontWeight={"bold"}
          variant="h6"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          Parent's Information{" "}
          <Button variant="contained" onClick={handleParentInfoToggle}>
            {showParentInfo ? "Hide Parent Info" : "Add Parent Info"}
          </Button>
        </Typography>

        <Divider />

        <Stack
          sx={{
            display: showParentInfo ? "flex" : "none",
          }}
          gap={3}
          width={"100%"}
        >
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Father's Name</Typography>
              <TextField
                value={parentDetails?.fathersName}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, fathersName: e.target.value }))
                }
                placeholder="Father's Name"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Father's Contact Number</Typography>
              <TextField
                value={parentDetails?.fathersContactNumber}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, fathersContactNumber: e.target.value }))
                }
                placeholder="Father's Contact number"
                size="small"
                type="number"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Father's Occupation</Typography>
              <TextField
                value={parentDetails?.fathersOccupation}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, fathersOccupation: e.target.value }))
                }
                placeholder="Father's occupation"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Father's Mail ID</Typography>
              <TextField
                value={parentDetails?.fathersEmailId}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, fathersEmailId: e.target.value }))
                }
                placeholder="Father's mail ID"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"49.2%"} gap={1}>
              <Typography>Father's Highest Education</Typography>
              <TextField
                value={parentDetails?.fathersHightestEducation}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, fathersHightestEducation: e.target.value }))
                }
                placeholder="Father's highest education"
                size="small"
              />
            </Stack>
          </Stack>
          <br />
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Mother's Name</Typography>
              <TextField
                value={parentDetails?.mothersName}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, mothersName: e.target.value }))
                }
                placeholder="Mother's Name"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Mother's Contact Number</Typography>
              <TextField
                value={parentDetails?.mothersContactNumber}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, mothersContactNumber: e.target.value }))
                }
                placeholder="Mother's Contact number"
                size="small"
                type="number"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Mother's Occupation</Typography>
              <TextField
                value={parentDetails?.mothersOccupation}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, mothersOccupation: e.target.value }))
                }
                placeholder="Mother's occupation"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Mother's Mail ID</Typography>
              <TextField
                value={parentDetails?.mothersEmailId}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, mothersEmailId: e.target.value }))
                }
                placeholder="Mother's mail ID"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"49.2%"} gap={1}>
              <Typography>Mother's Highest Education</Typography>
              <TextField
                value={parentDetails?.mothersHightestEducation}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, mothersHightestEducation: e.target.value }))
                }
                placeholder="Mother's highest education"
                size="small"
              />
            </Stack>
          </Stack>
          <br />

          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Guardian</Typography>
              <TextField
                value={parentDetails?.guardian}
                onChange={(e) => setParentDetails((pre) => ({ ...pre, guardian: e.target.value }))}
                placeholder="Eg: Father or Mother"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Guardian's Name</Typography>
              <TextField
                value={parentDetails?.guardianName}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, guardianName: e.target.value }))
                }
                placeholder="Guardian's Name"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Guardian's Contact Number</Typography>
              <TextField
                value={parentDetails?.guardianContactNumber}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, guardianContactNumber: e.target.value }))
                }
                placeholder="Guardian's Contact number"
                size="small"
                type="number"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Guardian's Occupation</Typography>
              <TextField
                value={parentDetails?.guardianOccupation}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, guardianOccupation: e.target.value }))
                }
                placeholder="Guardian's occupation"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Guardian's Mail ID</Typography>
              <TextField
                value={parentDetails?.guardianEmailId}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, guardianEmailId: e.target.value }))
                }
                placeholder="Guardian's mail ID"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Guardian's Highest Education</Typography>
              <TextField
                value={parentDetails?.guardianHightestEducation}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, guardianHightestEducation: e.target.value }))
                }
                placeholder="Guardian's highest education"
                size="small"
              />
            </Stack>
          </Stack>
          <br />

          <Stack direction={"row"} gap={2}>
            <Stack width={"49.2%"} gap={1}>
              <Typography>Residential Address</Typography>
              <TextField
                value={parentDetails?.residentialAddress}
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, residentialAddress: e.target.value }))
                }
                placeholder="Residential address"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"49.2%"} gap={1}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <Typography>Permanent Address</Typography>
                <Stack direction={"row"} alignItems={"center"}>
                  <Checkbox
                    value={userAddressRadio}
                    onChange={(e) => {
                      setUserAddressRadio(e.target.checked);
                      if (e.target.checked)
                        setParentDetails((pre) => ({
                          ...pre,
                          permanentAddress: parentDetails?.residentialAddress,
                        }));
                    }}
                    id="permenent_address"
                  />
                  <label htmlFor="permenent_address">
                    <Typography color={"dimgray"}>Same as Residential Address</Typography>
                  </label>
                </Stack>
              </Stack>
              <TextField
                disabled={userAddressRadio}
                value={
                  userAddressRadio
                    ? parentDetails?.residentialAddress
                    : parentDetails?.permanentAddress
                }
                onChange={(e) =>
                  setParentDetails((pre) => ({ ...pre, permanentAddress: e.target.value }))
                }
                placeholder="Permanent Address"
                size="small"
              />
            </Stack>
          </Stack>
        </Stack>
        {/* ---- */}
      </Stack>
      {/*  */}
      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          border: "1px solid var(--border-color-1)",
        }}
        gap={2}
      >
        <Typography
          fontWeight={"bold"}
          variant="h6"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          Medical Information
          <Button variant="contained" onClick={handleMedicalInfoToggle}>
            {showMedicalInfo ? "Hide Medical Info" : "Add Medical Info"}
          </Button>
        </Typography>
        <Divider />
        <Stack
          sx={{
            backgroundColor: "white",
            display: showMedicalInfo ? "flex" : "none",
          }}
          gap={3}
          width={"49.2%"}
        >
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Overall Health Condition</Typography>
              <TextField
                value={medicalInfo?.healthCondition}
                onChange={(e) =>
                  setMedicalInfo((pre) => ({ ...pre, healthCondition: e.target.value }))
                }
                placeholder="Eg: Good"
                size="small"
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Stack width={"100%"} gap={1}>
              <Typography>Height {"(cm)"}</Typography>
              <TextField
                type="number"
                value={medicalInfo?.height}
                onChange={(e) =>
                  setMedicalInfo((pre) => ({ ...pre, height: e.target.value as unknown as number }))
                }
                placeholder="height in cm"
                size="small"
              />
            </Stack>
            <Stack width={"100%"} gap={1}>
              <Typography>Weight {"(kg)"}</Typography>
              <TextField
                type="number"
                value={medicalInfo?.weight}
                onChange={(e) =>
                  setMedicalInfo((pre) => ({ ...pre, weight: e.target.value as unknown as number }))
                }
                placeholder="Weight in kg"
                size="small"
              />
            </Stack>
          </Stack>

          <Stack width={"49.2%"} gap={1} direction={"row"} alignItems={"center"}>
            <Checkbox
              id="studentDiabled"
              checked={medicalInfo?.disability}
              onChange={(e) => setMedicalInfo((pre) => ({ ...pre, disability: e.target.checked }))}
            />
            <label htmlFor="studentDiabled">
              <Typography>Is the Student Differently Abled?</Typography>
            </label>
          </Stack>
          <Stack width={"100%"} gap={1}>
            <Typography>Does the Student require any Special Needs?</Typography>
            <TextField
              value={medicalInfo?.specialNeeds}
              onChange={(e) => setMedicalInfo((pre) => ({ ...pre, specialNeeds: e.target.value }))}
              placeholder="Eg: Scribe for writing exams etc.."
              size="small"
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction={"row"} justifyContent={"end"}>
        <Button
          variant="contained"
          onClick={() => {
            handleSubmit();
          }}
        >
          Save & Continue
        </Button>
      </Stack>
      {/*  */}
      <Stack height={"300px"}></Stack>
    </Stack>
  );
};

export default BasicInfo;
