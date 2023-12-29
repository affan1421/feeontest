import { useEffect, useState } from "react";
import styles from "./CloseCollection.module.css";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CloseCollectionModel } from "@/models/CloseColletion";
import { closeCollectionSchema } from "@/FormSchema/FormValidation";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import api from "@/store/api";
import { Box, Button, Card, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  setDialogEnabled: (state: boolean) => void;
}

interface CloseCollectionData {
  closedAmounts: {
    cashAmount: number;
    expenseAmount: number;
  };
  income: {
    totalPaidAmount: number;
    totalAmountInCash: number;
  };
  expense: {
    expenseInCash: number;
  };
  toCloseAmounts: {
    totalAmountInCash: number;
    totalExpenseInCash: number;
  };
}

const CloseCollection = (props: Props) => {
  const initalCloseCollectionData = {
    closedAmounts: {
      cashAmount: 0,
      expenseAmount: 0,
    },
    income: {
      totalPaidAmount: 0,
      totalAmountInCash: 0,
    },
    expense: {
      expenseInCash: 0,
    },
    toCloseAmounts: {
      totalAmountInCash: 0,
      totalExpenseInCash: 0,
    },
  };

  const setError = api((state) => state.setError);
  const today = dayjs();
  const school_id = localStorage.getItem("school_id");
  const collectionValueEditable = localStorage.getItem("collection_editable");
  const [closeCollectionData, setCloseCollectionData] = useState<CloseCollectionData>(initalCloseCollectionData);
  const [uploadingFileStatus, setUploadingFileStatus] = useState("Add attachment");
  const [closeCollection, setCloseCollection] = useState<CloseCollectionModel>({
    name: "",
    date: today,
    bankName: "",
    cashAmount: 0,
    expenseAmount: 0,
    attachments: [],
    schoolId: school_id || "",
  });

  const getTodaysTotalFeesApi = api((state) => state.todaysTotalFees);
  const addClosingCollection = api((state) => state.addClosingCollection);
  const uploadAttachmentApi = api((state) => state.uploadFile);

  useEffect(() => {
    (async () => {
      const data = (await getTodaysTotalFeesApi(school_id, getFormattedDate(closeCollection?.date)))
        ?.data as CloseCollectionData;
      setCloseCollectionData(data);
      setCloseCollection((pre) => ({
        ...pre,
        cashAmount: data?.toCloseAmounts?.totalAmountInCash,
        expenseAmount: data?.toCloseAmounts?.totalExpenseInCash,
      }));
    })();
  }, [closeCollection?.date]);

  function getFormattedDate(date: string) {
    const dateObject = new Date(date);

    if (!isNaN(dateObject.getTime())) {
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();

      setError(false, "");
      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    } else {
      setError(true, "Invalid date");
    }
  }

  const handleSubmit = async () => {
    try {
      await closeCollectionSchema.validate(closeCollection, { abortEarly: false });
      await addClosingCollection(closeCollection);
      handleModalClose();
    } catch (error: any) {
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  const handleDelete = (index: number) => {
    if (index >= 0 && index < closeCollection.attachments.length) {
      const updatedAttachments = closeCollection.attachments.filter((_, i) => i !== index);
      setCloseCollection({
        ...closeCollection,
        attachments: updatedAttachments,
      });
    }
  };

  const handleAddAttachments = async (event: any) => {
    setUploadingFileStatus("Uploading Attachment...");
    try {
      if (event.target?.files?.[0]) {
        const formData = new FormData();
        formData.append("file", event.target?.files?.[0]);
        const {
          data: { message },
        } = await uploadAttachmentApi(formData);
        setUploadingFileStatus("Add attachment");
        setCloseCollection({
          ...closeCollection,
          attachments: [...closeCollection.attachments, message],
        });
      }
    } catch (error: any) {
      setUploadingFileStatus("Add attachment");
      const errorMessage = error.errors.join("\n");
      setError(true, errorMessage);
      setTimeout(() => {
        setError(false, "");
      }, 2000);
    }
  };

  function truncateLabel(label: string, maxLength = 12) {
    const url = decodeURI(`${label?.split("/").pop()}`);
    if (url.length > maxLength) {
      return url.substring(0, maxLength) + "...";
    } else {
      return url;
    }
  }

  const handleModalClose = () => {
    props.setDialogEnabled(false);
  };

  const validateForInputError = (amount: number | string, totalAmount: number | string) => {
    amount = Number(amount);
    totalAmount = Number(totalAmount);
    return !((amount > 0 && amount < totalAmount) || amount == totalAmount);
  };

  return (
    <Box p={4}>
      <Stack pb={2} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Typography variant="h5">Closing Collection</Typography>
        <CloseIcon onClick={handleModalClose} sx={{ cursor: "pointer" }} />
      </Stack>
      <Stack py={1} direction={"row"} gap={3} justifyContent={"space-between"}>
        <Stack direction={"row"} gap={3}>
          <Box>
            <Typography variant="h6">Todays Collection</Typography>
            <Typography variant="subtitle1">₹ {closeCollectionData?.income?.totalPaidAmount?.toFixed(2)}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Cash collected</Typography>
            <Typography variant="subtitle1">₹ {closeCollectionData?.income?.totalAmountInCash?.toFixed(2)}</Typography>
          </Box>
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={closeCollection.date}
            format="DD/MM/YYYY"
            slotProps={{ textField: { variant: "outlined" } }}
            onChange={(event) => setCloseCollection({ ...closeCollection, date: event })}
          />
        </LocalizationProvider>
      </Stack>
      <Stack py={2} direction={"row"} gap={1} alignItems={"center"}>
        <TextField
          id="outlined-basic"
          value={closeCollection.name}
          onChange={(e) => setCloseCollection({ ...closeCollection, name: e.target.value })}
          label="Name of the depositor"
          variant="outlined"
          error={closeCollection?.name?.trim().length == 0 || !closeCollection?.name}
          fullWidth
          required
        />
      </Stack>
      <Stack py={1} direction={"row"} gap={2}>
        <TextField
          id="outlined-basic"
          type="number"
          value={closeCollection.cashAmount}
          onChange={(e) => setCloseCollection({ ...closeCollection, cashAmount: e.target.value })}
          label="Enter Amount"
          variant="outlined"
          error={validateForInputError(
            closeCollection?.cashAmount,
            closeCollectionData?.toCloseAmounts?.totalAmountInCash
          )}
          disabled={collectionValueEditable == "false"}
        />
        <TextField
          id="outlined-basic"
          type="number"
          value={closeCollection.expenseAmount}
          onChange={(e) => setCloseCollection({ ...closeCollection, expenseAmount: e.target.value })}
          label={`Expense Amount`}
          variant="outlined"
          error={validateForInputError(
            closeCollection?.expenseAmount,
            closeCollectionData?.toCloseAmounts?.totalExpenseInCash
          )}
          disabled={collectionValueEditable == "false"}
        />
        <TextField
          id="outlined-basic"
          type="text"
          value={closeCollection.bankName}
          onChange={(e) => setCloseCollection({ ...closeCollection, bankName: e.target.value })}
          label="Enter Bank name"
          variant="outlined"
          error={closeCollection?.bankName?.trim().length == 0 || !closeCollection?.bankName}
          required
        />
      </Stack>
      <Stack py={3} direction={"row"} justifyContent={"space-between"} alignItems={"center"} gap={2}>
        <Box sx={{ color: "blue" }}>
          <input id="attachments" onChange={handleAddAttachments} type="file" hidden />
          <label htmlFor="attachments" className={styles.addAttachments}>
            <AttachFileIcon /> <span>{uploadingFileStatus}</span>
          </label>
        </Box>
        <span className={styles.attachments}>
          {closeCollection?.attachments?.length > 0 &&
            closeCollection?.attachments?.map((item, index) => (
              <Chip
                key={index}
                label={truncateLabel(item)}
                sx={{ color: "#000000DE", borderColor: "#000000DE" }}
                variant="outlined"
                onDelete={() => handleDelete(index)}
              />
            ))}
        </span>
      </Stack>
      <Stack pt={1} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Button variant="outlined" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Send for Approval
        </Button>
      </Stack>
    </Box>
  );
};

export default CloseCollection;
