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
  todos,
} from "../../store/modules/todolist";
import axios from 'axios';
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
  const [shared, setShared] = useState(false);
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
      try {
        // 데이터를 가져오는 axios 요청
        const response = await axios.get("/calendar/getSchedule/userId=SW");
        const data = response.data;
  
        let transformedTodo;
  
        if (data.shared) {
          // 공유된 일정인 경우
          transformedTodo = {
            id,
            shared: data.shared,
            year: currentYear,
            month: currentMonth,
            day: currentDay,
            text: data.shareScheduleContent,
            done: false,
            userId: data.shareScheduleWriterId,
            LoverId: data.shareScheduleLoverId
          };
        } else {
          // 개인 일정인 경우
          transformedTodo = {
            id,
            shared: data.shared,
            year: currentYear,
            month: currentMonth,
            day: currentDay,
            text: data.myScheduleContent,
            done: false,
            userId: data.writerId
          };
        }
  
        // 가져온 데이터를 Redux 상태로 저장
        dispatch(todos(transformedTodo));
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [dispatch, id, currentYear, currentMonth, currentDay]);
  
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
  

  const handleCreateShareToggle = () => {
    setShared((shared)=>!shared)
  }
  const handleCreateToggle = () => {
    setOpen((prevOpen) => !prevOpen);

  };

  const handleCreateChange = (e) => {
    setValue(e.target.value);
  };
  
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`/calendar/setSchedule/userId=SW`, {
        schedule: value,
        date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`,
        share: shared,
      });
  
      const todo = {
        id,
        shared:shared,
        year: currentYear,
        month: currentMonth,
        day: currentDay,
        text: value,
        done: false,
        userId:"SW"
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
      console.log(response.data); // Schedule create successfully
    } catch (error) {
      console.error(error);
    }
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
        loverId={LoverId} // LoverId를 전달합니다.
      />

      <TodoCreate
        open={open}
        value={value}
        handleChange={handleCreateChange}
        handleSubmit={handleCreateSubmit}
        handleToggle={handleCreateToggle}
        handleShareToggle = {handleCreateShareToggle}
        currentDay={currentDay}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </TodoTemplateBlock>
  );
};

export default TodoList;
