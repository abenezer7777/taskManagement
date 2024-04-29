import React, { useState } from "react";
import { useGlobalState } from "../../context/GlobalProvider";
import axios from "axios";
import toast from "react-hot-toast";
import styled from "styled-components";
import Button from "../Button/Button";
import { add } from "@/app/utils/icons";
import { any, z } from "zod"; // Import Zod
import { useQueryClient } from "react-query";

// Define your validation schema using Zod
const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task Title is Required")
    .min(3, "Task Title must be at least 3 characters")
    .max(50),
  description: z
    .string()
    .min(1, "Task Description is Required")
    .min(10, "Task description must be at least 10 characters")
    .max(200),
  date: z.date().refine((value) => value !== null && value !== undefined, {
    message: "Date is required",
  }),
  completed: z.boolean(),
  important: z.boolean(),
});

type TaskType = z.infer<typeof taskSchema>;

function CreateContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [important, setImportant] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null); // Track validation errors
  const { theme, closeModal } = useGlobalState();

  const handleChange =
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setErrors(null); // Clear previous errors when input changes
      const target = e.target as HTMLInputElement;
      switch (name) {
        case "title":
          setTitle(target.value);
          break;
        case "description":
          setDescription(target.value);
          break;
        case "date":
          setDate(target.value);
          break;
        case "completed":
          setCompleted(target.checked);
          break;
        case "important":
          setImportant(target.checked);
          break;
        default:
          break;
      }
    };
  const queryClient = useQueryClient();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const task: TaskType = {
      title,
      description,
      date: new Date(date),
      completed,
      important,
    };

    try {
      taskSchema.parse(task);
      const res = await axios.post("/api/tasks", task);

      if (res.data.error) {
        toast.error(res.data.error);
      }
      if (!res.data.error) {
        toast.success("Task created successfully.");
        // Invalidate and refetch the tasks query to update the cache
        queryClient.invalidateQueries("tasks");
        closeModal();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.errors.reduce((acc: any, err: any) => {
            acc[err.path[0]] = err.message;
            return acc;
          }, {})
        );
      } else {
        toast.error("Something went wrong.");
        console.log(error);
      }
    }
  };
  const handleBlur = (name: string) => () => {
    const task: TaskType = {
      title,
      description,
      date: new Date(date),
      completed,
      important,
    };

    try {
      taskSchema.pick({ [name]: true }).parse(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((err) => err.message).join(", ");
        setErrors({ [name]: errorMessage });
      }
    }
  };

  return (
    <CreateContentStyled onSubmit={handleSubmit} theme={theme}>
      <h1>Create a task</h1>
      <div
        className={`input-control ${
          errors && errors.title ? "input-error" : ""
        }`}
      >
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          name="title"
          onChange={handleChange("title")}
          onBlur={handleBlur("title")}
          placeholder="e.g, Watch a video from Fireship."
        />
        {errors && errors.title && (
          <span className="error">{errors.title}</span>
        )}
      </div>
      <div
        className={`input-control ${
          errors && errors.description ? "input-error" : ""
        }`}
      >
        <label htmlFor="description">Description</label>
        <textarea
          value={description}
          onChange={handleChange("description")}
          onBlur={handleBlur("description")}
          name="description"
          id="description"
          rows={4}
          placeholder="e.g, Watch a video about Next.js Auth"
        ></textarea>
        {errors && errors.description && (
          <span className="error">{errors.description}</span>
        )}
      </div>
      <div
        className={`input-control ${
          errors && errors.date ? "input-error" : ""
        }`}
      >
        <label htmlFor="date">Date</label>
        <input
          value={date}
          onChange={handleChange("date")}
          onBlur={handleBlur("date")}
          type="date"
          name="date"
          id="date"
        />
        {errors && errors.date && <span className="error">{errors.date}</span>}
      </div>
      <div className="input-control toggler">
        <label htmlFor="completed">Toggle Completed</label>
        <input
          value={completed.toString()}
          onChange={handleChange("completed")}
          type="checkbox"
          name="completed"
          id="completed"
        />
      </div>
      <div className="input-control toggler">
        <label htmlFor="important">Toggle Important</label>
        <input
          value={important.toString()}
          onChange={handleChange("important")}
          type="checkbox"
          name="important"
          id="important"
        />
      </div>
      <div className="submit-btn flex justify-end">
        <Button
          type="submit"
          name="Create Task"
          icon={add}
          padding={"0.5rem 1rem"}
          borderRad={"0.8rem"}
          fw={"500"}
          fs={"1.2rem"}
          background={"rgb(0, 163, 255)"}
        />
      </div>
    </CreateContentStyled>
  );
}
const CreateContentStyled = styled.form`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${(props) => props.theme.colorGrey1};

  .input-control {
    position: relative;
    margin: 0.6rem 0;
    font-weight: 400;

    @media screen and (max-width: 450px) {
      margin: 0.8rem 0;
    }

    label {
      margin-bottom: 0.1rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${(props) => props.theme.colorGrey3};
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 0.2rem;

      resize: none;
      background-color: ${(props) => props.theme.colorGreyDark};
      color: ${(props) => props.theme.colorGrey2};
      border-radius: 0.5rem;
    }
  }
  .error {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.1rem;
  }
  input-error input,
  .input-error textarea {
    border-color: red !important;
  }

  .input-success input,
  .input-success textarea {
    border-color: green !important;
  }
  .submit-btn button {
    transition: all 0.35s ease-in-out;

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6rem 1rem !important;

      i {
        font-size: 1.2rem !important;
        margin-right: 0.5rem !important;
      }
    }

    i {
      color: ${(props) => props.theme.colorGrey0};
    }

    &:hover {
      background: ${(props) => props.theme.colorPrimaryGreen} !important;
      color: ${(props) => props.theme.colorWhite} !important;
    }
  }

  .toggler {
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;

    label {
      flex: 1;
    }

    input {
      width: initial;
    }
  }
`;
export default CreateContent;
