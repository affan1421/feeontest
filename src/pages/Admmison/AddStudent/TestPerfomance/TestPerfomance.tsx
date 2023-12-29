import api from "@/store/api";
import { Delete } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface SubTopic {
  name: string;
  totalMarks: number;
  markScored: number;
}

const initialSubtopicData: SubTopic = {
  name: "",
  markScored: 0,
  totalMarks: 0,
};

interface Topic {
  topic: string;
  subtopics: SubTopic[];
}

const initialTopicData: Topic = {
  topic: "",
  subtopics: [initialSubtopicData],
};

const TestPerfomance = ({ goToPage, existingData }: { existingData: any; goToPage: (pageNumber: number) => void }) => {
  const applicationNo = useParams()?.id;
  const admissionUpdateTestInfoApi = api((state) => state.admissionUpdateTestInfo);

  const [topics, setTopics] = useState<Topic[]>([initialTopicData]);
  const [teachersFeedback, setTeachersFeedback] = useState({ strengths: "", improvementNeeded: "" });

  const addSubTopic = (topicIndex: number) => {
    setTopics((pre) => {
      const copy = [...pre];
      copy[topicIndex] = {
        ...copy[topicIndex],
        subtopics: [...(copy[topicIndex]?.subtopics || []), initialSubtopicData],
      };
      return copy;
    });
  };

  const deleteSubtopics = (topicIndex: number, subtopicIndex: number) => {
    setTopics((pre) => {
      const copy = [...pre];
      const subtopic = copy[topicIndex]?.subtopics?.filter((_, i) => i != subtopicIndex);
      copy[topicIndex] = { ...copy[topicIndex], subtopics: subtopic };
      return copy;
    });
  };

  const addTopic = () => {
    setTopics((pre) => [...pre, initialTopicData]);
  };

  const editSubtopicField = (
    topicIndex: number,
    subtopicIndex: number,
    subtopicKeyToUpdate: keyof SubTopic,
    value: string | number
  ) => {
    setTopics((pre) => {
      const copy = [...pre];
      const subtopic = [...copy[topicIndex]?.subtopics];
      subtopic[subtopicIndex] = { ...subtopic[subtopicIndex], [subtopicKeyToUpdate]: value };
      copy[topicIndex] = { ...copy[topicIndex], subtopics: subtopic };
      return copy;
    });
  };

  const editTopicTitle = (topicIndex: number, value: string) => {
    setTopics((pre) => {
      const copy = [...pre];
      copy[topicIndex] = { ...copy[topicIndex], topic: value };
      return copy;
    });
  };

  const submitData = async () => {
    const data = {
      applicationNo: applicationNo,
      testPerformance: topics,
      teachersFeedback: teachersFeedback,
    };
    const { data: response_data } = await admissionUpdateTestInfoApi(data);
    if (response_data?.success) goToPage(3);
  };

  const deleteTopic = (topicIndex: number) => {
    setTopics((pre) => pre?.filter((_, i) => i != topicIndex));
  };

  useEffect(() => {
    setTeachersFeedback(existingData?.teachersFeedback);
    setTopics(existingData?.testPerformance || []);
  }, [existingData]);

  return (
    <Stack gap={3}>
      <Typography variant="h6">Test performance</Typography>
      {topics?.map((topic, topicIndex) => {
        return (
          <Stack
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: 3,
            }}
            gap={2}
          >
            <Stack direction={"row"} alignItems="center" justifyContent={"space-between"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <Typography fontWeight={"bold"}>Topic {topicIndex + 1}</Typography>
                <TextField
                  onChange={(e) => editTopicTitle(topicIndex, e.target.value)}
                  value={topic?.topic}
                  placeholder="eg. Maths"
                  size="small"
                />
              </Stack>
              <IconButton onClick={() => deleteTopic(topicIndex)}>
                <Delete />
              </IconButton>
            </Stack>
            <Divider />

            {(topic?.subtopics || [])?.map((subtopic, subtopicIndex) => (
              <Stack gap={3} direction={"row"} alignItems={"center"}>
                <Stack gap={1} width={"100%"}>
                  <Typography>Sub-topic {subtopicIndex + 1}</Typography>
                  <TextField
                    onChange={(e) => editSubtopicField(topicIndex, subtopicIndex, "name", e.target.value)}
                    value={subtopic?.name}
                    size="small"
                    placeholder="Enter topic name"
                  />
                </Stack>
                <Stack gap={1} width={"100%"}>
                  <Typography>Total marks</Typography>
                  <TextField
                    type="number"
                    onChange={(e) => editSubtopicField(topicIndex, subtopicIndex, "totalMarks", e.target.value)}
                    value={subtopic?.totalMarks}
                    size="small"
                    placeholder="eg. 10"
                  />
                </Stack>
                <Stack gap={1} width={"100%"}>
                  <Typography>Marks scored</Typography>
                  <TextField
                    type="number"
                    onChange={(e) => editSubtopicField(topicIndex, subtopicIndex, "markScored", e.target.value)}
                    value={subtopic?.markScored}
                    size="small"
                    placeholder="eg. 10"
                  />
                </Stack>
                <Stack mt={3}>
                  <IconButton onClick={() => deleteSubtopics(topicIndex, subtopicIndex)}>
                    <Delete />
                  </IconButton>
                </Stack>
              </Stack>
            ))}

            <Stack direction={"row"}>
              <Button disabled={(topic?.subtopics || [])?.length >= 5} onClick={() => addSubTopic(topicIndex)}>
                Add sub-topic {(topic?.subtopics || [])?.length + 1}
              </Button>
            </Stack>
          </Stack>
        );
      })}

      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography color={topics?.length >= 5 ? "dimgray" : "black"} fontWeight={"bold"}>
          Add Topic {topics?.length + 1}
        </Typography>
        <Button disabled={topics?.length >= 5} variant="outlined" onClick={() => addTopic()}>
          Add topic
        </Button>
      </Stack>

      <Stack
        sx={{
          p: 3,
          backgroundColor: "white",
          borderRadius: 3,
        }}
        gap={2}
      >
        <Typography typography={"h6"} fontWeight={"bold"}>
          Teachers feedback
        </Typography>
        <Divider />
        <Stack direction={"row"} gap={2}>
          <Stack gap={1} width={"100%"}>
            <Typography>Strengths of the child</Typography>
            <TextField
              value={teachersFeedback?.strengths}
              onChange={(e) => setTeachersFeedback((pre) => ({ ...pre, strengths: e.target.value }))}
              size="small"
              placeholder="Type something.."
            />
          </Stack>
          <Stack gap={1} width={"100%"}>
            <Typography>Areas of Improvement</Typography>
            <TextField
              value={teachersFeedback?.improvementNeeded}
              onChange={(e) => setTeachersFeedback((pre) => ({ ...pre, improvementNeeded: e.target.value }))}
              size="small"
              placeholder="Type something.."
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack direction={"row"} justifyContent={"end"} gap={1}>
        <Button
          variant="outlined"
          onClick={() => {
            goToPage(1);
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

export default TestPerfomance;
