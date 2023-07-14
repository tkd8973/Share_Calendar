import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import TodoHead from "./ViewComponent/TodoHead/TodoHead";
import TodoCreate from "./ViewComponent/TodoCreate/TodoCreate";
import TodoItemList from "./ViewComponent/TodoItemList/TodoItemList";
import {
  todos as actionTodos,
  createTodo,
  dayTodolist,
  toggleTodo,
  removeTodo,
} from "../../store/modules/todolist";

const TodoTemplateBlock = styled.div`
  display: flex;
  position: relative;
  width: 25%;
  height: 82vh;
  margin: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.04);
  flex-direction: column;
`;

const TodoList = () => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    id,
    filteredTodos,
    currentDay,
    currentMonth,
    currentYear,
  } = useSelector((state) => ({
    id: state.todolist.id,
    filteredTodos: state.todolist.filteredTodos,
    currentDay: state.date.currentDay,
    currentMonth: state.date.currentMonth,
    currentYear: state.date.currentYear,
  }));

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(
        actionTodos({
          currentDay,
          currentMonth,
          currentYear,
        })
      );
    };

    fetchData();
  }, [dispatch, currentDay, currentMonth, currentYear]);

  const handleToggleAndFetch = (id) => {
    dispatch(toggleTodo({ id }));
    dispatch(
      actionTodos({
        currentDay,
        currentMonth,
        currentYear,
      })
    );
    dispatch(
      dayTodolist({
        currentMonth: currentMonth - 1,
        currentYear,
      })
    );
  };

  const handleRemoveAndFetch = (id) => {
    dispatch(removeTodo({ id }));
    dispatch(
      actionTodos({
        currentDay,
        currentMonth,
        currentYear,
      })
    );
    dispatch(
      dayTodolist({
        currentMonth: currentMonth - 1,
        currentYear,
      })
    );
  };

  const handleCreateToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleCreateChange = (e) => {
    setValue(e.target.value);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const todo = {
      id,
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      text: value,
      done: false,
    };
    dispatch(createTodo({ todo }));
    dispatch(
      actionTodos({
        currentDay,
        currentMonth,
        currentYear,
      })
    );
    dispatch(
      dayTodolist({
        currentMonth: currentMonth - 1,
        currentYear,
      })
    );
    setValue("");
    setOpen(false);
  };

  return (
    <TodoTemplateBlock>
      <TodoHead
        currentDay={currentDay}
        currentMonth={currentMonth}
        currentYear={currentYear}
        filteredTodos={filteredTodos}
      />
      
      <TodoItemList
        todos={filteredTodos?.length ? filteredTodos : []}
        handleToggle={handleToggleAndFetch}
        handleRemove={handleRemoveAndFetch}
      />

      <TodoCreate
        open={open}
        value={value}
        handleChange={handleCreateChange}
        handleSubmit={handleCreateSubmit}
        handleToggle={handleCreateToggle}
        currentDay={currentDay}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </TodoTemplateBlock>
  );
};

export default TodoList;
