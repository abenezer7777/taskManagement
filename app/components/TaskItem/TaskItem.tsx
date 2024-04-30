"use client";
import { useState } from "react";
import { useGlobalState, useGlobalUpdate } from "../../context/GlobalProvider";
import { edit, trash } from "../../utils/icons";
import React from "react";
import styled from "styled-components";
import formatDate from "@/app/utils/formatDate";
import Button from "../Button/Button";
import { add } from "@/app/utils/icons";
import Modal from "../Modals/Modal";
import { z } from "zod";

interface Props {
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  id: string;
}
const taskSchema = z.object({
  title: z.string().min(3).max(50),
  description: z
    .string()
    .min(10, { message: "Task description must be at least 10 characters" })
    .max(200),
  date: z.date(),
  isCompleted: z.boolean(),
});
function TaskItem({ title, description, date, isCompleted, id }: Props) {
  const { theme, deleteTask, updateIsComplete } = useGlobalState();

  const { editTask } = useGlobalUpdate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedDate, setEditedDate] = useState(date);
  const [editedCompleted, setEditedCompleted] = useState(isCompleted);
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);

  const handleEdit = async (e: any) => {
    e.preventDefault();
    try {
      const editedTask = {
        id,
        title: editedTitle,
        description: editedDescription,
        date: new Date(editedDate),
        isCompleted: editedCompleted,
      };
      // Validate task using Zod schema
      taskSchema.parse(editedTask);
      await editTask(editedTask);
      setEditModalOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.errors.reduce((acc: any, err: any) => {
            acc[err.path[0]] = err.message;
            return acc;
          }, {})
        );
      } else {
        console.error("Validation error:", error);
      }
    }
  };
  return (
    <TaskItemStyled theme={theme}>
      <h1 className="px-2">{title}</h1>
      <p>{description}</p>
      <p className="date">{formatDate(date)}</p>
      <div className="task-footer">
        {isCompleted ? (
          <button
            className="completed"
            onClick={() => {
              const task = {
                id,
                isCompleted: !isCompleted,
              };
              updateIsComplete(task);
            }}
          >
            Completed
          </button>
        ) : (
          <button
            className="incomplete"
            onClick={() => {
              const task = {
                id,
                isCompleted: !isCompleted,
              };

              updateIsComplete(task);
            }}
          >
            Incomplete
          </button>
        )}
        <button className="edit" onClick={() => setEditModalOpen(true)}>
          {edit}
        </button>
        <button
          className="delete"
          onClick={() => {
            deleteTask(id);
          }}
        >
          {trash}
        </button>
      </div>
      {editModalOpen && (
        <Modal
          content={
            <EditContent onSubmit={handleEdit} theme={theme}>
              <h1>Edit Task</h1>
              <div className="input-control">
                <label htmlFor="editTitle">Title</label>
                <input
                  type="text"
                  id="editTitle"
                  value={editedTitle}
                  name="editTitle"
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                {errors && errors.title && (
                  <span className="error">{errors.title}</span>
                )}
              </div>
              <div className="input-control">
                <label htmlFor="editDescription">Description</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  name="editDescription"
                  rows={4}
                  id="editDescription"
                />
                {errors && errors.description && (
                  <span className="error">{errors.description}</span>
                )}
              </div>
              <div className="input-control">
                <label htmlFor="editDate">Date</label>
                <div>
                  <input
                    className=" bg-slate-400"
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    name="editDate"
                    id="editDate"
                  />
                </div>
                {errors && errors.date && (
                  <span className="error">{errors.date}</span>
                )}
              </div>
              <div className="submit-btn flex justify-end">
                <Button
                  type="submit"
                  name="Save Changes"
                  icon={add}
                  padding={"0.5rem 1rem"}
                  borderRad={"0.8rem"}
                  fw={"500"}
                  fs={"1.2rem"}
                  background={"#5a55ca"}
                ></Button>
              </div>
            </EditContent>
          }
          onOverlayClick={() => setEditModalOpen(false)}
        />
      )}
    </TaskItemStyled>
  );
}
const TaskItemStyled = styled.div`
  padding: 1.2rem 1rem;
  border-radius: 1rem;
  // background-color: ${(props) => props.theme.borderColor2};
  background-color: #ffffff;
  box-shadow: ${(props) => props.theme.shadow7};
  border: 2px solid ${(props) => props.theme.borderColor2};
  height: 16rem;
  display: flex;
  // color: white;
  flex-direction: column;
  gap: 0.5rem;
  .date {
    margin-top: auto;
  }
  > h1 {
    font-size: 1.5rem;
    font-weight: 600;
    background-color: #6762ce;
    color: white;
  }
  p {
    text-wrap: wrap;
  }
  .task-footer {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    button {
      border: none;
      outline: none;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }

      i {
        font-size: 1.4rem;
        color: ${(props) => props.theme.colorGrey2};
        &:hover {
          color: ${(props) => props.theme.colorBlack} !important;
        }
      }
    }

    .edit {
      margin-left: auto;
    }

    .completed,
    .incomplete {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: ${(props) => props.theme.colorDanger};
      border-radius: 30px;
    }

    .completed {
      background: ${(props) => props.theme.colorGreenDark} !important;
    }
  }
`;
const EditContent = styled.form`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
    color: ${(props) => props.theme.colorBlack};
    font-weight: 700;
  }

  color: ${(props) => props.theme.colorGrey1};

  .input-control {
    position: relative;
    margin: 1rem 0;
    font-weight: 400;

    .error {
      color: red;
      font-size: 0.9rem;
      margin-top: 0.1rem;
    }

    @media screen and (max-width: 450px) {
      margin: 0.8rem 0;
    }

    label {
      margin-bottom: 0.3rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);
      color: ${(props) => props.theme.colorBlack};
      opacity: 0.8;

      span {
        color: ${(props) => props.theme.colorGrey3};
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 0.6rem;

      resize: none;
      background-color: ${(props) => props.theme.colorGrey3};
      color: ${(props) => props.theme.colorBlack};
      border-radius: 0.5rem;
    }
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
export default TaskItem;
