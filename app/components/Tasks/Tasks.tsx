"use client";
import { useGlobalState, useGlobalUpdate } from "@/app/context/GlobalProvider";
import React from "react";
import styled from "styled-components";
import CreateContent from "../Modals/CreateContent";
import TaskItem from "../TaskItem/TaskItem";
import { add, plus } from "@/app/utils/icons";
import Modal from "../Modals/Modal";

interface Props {
  title: string;
  tasks: any[];
}

function Tasks({ title, tasks }: Props) {
  const { theme, openModal, modal, closeModal } = useGlobalState();
  return (
    <TaskStyled theme={theme}>
      {modal && (
        <Modal content={<CreateContent />} onOverlayClick={closeModal} />
      )}
      <h1>{title}</h1>
      <button className="btn-rounded" onClick={openModal}>
        {plus}
      </button>
      <div className="tasks grid grid-cols-3 text-wrap">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            description={task.description}
            date={task.date}
            isCompleted={task.isCompleted}
            id={task.id}
          />
        ))}

        <button className="create-task" onClick={openModal}>
          {add}
          Add New Task
        </button>
      </div>
    </TaskStyled>
  );
}
const TaskStyled = styled.main`
  position: relative;
  padding: 2rem;
  width: 100%;
  background-color: ${(props) => props.theme.colorBg2};
  border: 2px solid ${(props) => props.theme.borderColor2};
  border-radius: 1rem;
  height: 100%;

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 1rem;
    background-color: ${(props) => props.theme.colorBg2};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.borderColor2};
    border-radius: 1rem;
  }
  .btn-rounded {
    position: fixed;
    top: 4.9rem;
    right: 5.1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;

    background-color: ${(props) => props.theme.colorBg5};
    border: 2px solid ${(props) => props.theme.borderColor2};
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
    color: ${(props) => props.theme.colorWhite};
    font-size: 1.4rem;

    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: ${(props) => props.theme.colorGrey3};
    }

    @media screen and (max-width: 768px) {
      top: 3rem;
      right: 3.5rem;
    }
  }

  .tasks {
    margin: 2rem 0;
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(250px, 1fr)
    ); /* Divide into three columns */
    gap: 1rem;
  }

  > h1 {
    font-size: clamp(1.5rem, 2vw, 2rem);
    font-weight: 800;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 3rem;
      height: 0.2rem;
      background-color: ${(props) => props.theme.colorPrimaryGreen};
      border-radius: 0.5rem;
    }
  }

  .create-task {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    height: 16rem;
    color: ${(props) => props.theme.colorGrey3};
    font-weight: 600;
    cursor: pointer;
    border-radius: 1rem;
    border: 3px dashed ${(props) => props.theme.colorGrey3};
    transition: all 0.3s ease;

    i {
      font-size: 1.5rem;
      margin-right: 0.2rem;
    }

    &:hover {
      background-color: ${(props) => props.theme.colorGrey5};
      color: ${(props) => props.theme.colorGrey2};
    }
  }
`;

export default Tasks;
