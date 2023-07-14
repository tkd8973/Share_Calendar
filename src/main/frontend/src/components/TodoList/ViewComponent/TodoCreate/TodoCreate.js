import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import AddIcon from '@material-ui/icons/Add';

const CircleButton = styled.div`
  background: #38d9a9;
  &:hover {
    background: #38d9a9;
  }
  &:active {
    background: #20c997;
  }

  z-index: 5;
  cursor: pointer;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translate(-50%, -20%);
  color: white;
  border-radius: 50%;
  border: none;
  outline: none;
  display: flex;
  transition: 0.125s all ease-in;
  ${({ open }) =>
    open &&
    css`
      background: #ff6b6b;
      &:hover {
        background: #ff8787;
      }
      &:active {
        background: #fa5252;
      }
      transform: translate(-50%, -20%) rotate(45deg);
    `};
`;

const InsertFormPositioner = styled.div`
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
`;

const InsertForm = styled.form`
  background: #f8f9fa;
  padding-left: 32px;
  padding-top: 32px;
  padding-right: 32px;
  padding-bottom: 72px;

  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top: 1px solid #e9ecef;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  width: 100%;
  outline: none;
  font-size: 18px;
  box-sizing: border-box;

  /* 스타일 추가: 배경 색상 */
  background-color: white;
`;

const TodoCreate = ({
  open,
  value,
  currentDay,
  currentMonth,
  currentYear,
  handleChange,
  handleSubmit,
  handleToggle
}) => {
  const [userId, setUserId] = useState('');
  const [share, setShare] = useState(false);
  const [schedule, setSchedule] = useState('');

  const formattedDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

  const createSchedule = async () => {
    try {
      const response = await axios.post(`/calendar/setSchedule/userId=${userId}`, {
        date: formattedDate.replace(/-/g, ''),
        share,
        schedule
      });
      console.log(response.data); // Schedule created successfully
      clearForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("Cannot change the selected date");
  };

  const clearForm = () => {
    setUserId('');
    setShare(false);
    setSchedule('');
    handleChange('');
    handleToggle();
  }; 

  return (  
    <>
      {open && (
        <InsertFormPositioner>
          <InsertForm onSubmit={handleSubmit}>
            <Input
              autoFocus
              placeholder="Enter your task and press Enter"
              onChange={handleChange}
              value={value}
            />
            <Input
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Date"
              value={formattedDate}
              onChange={handleDateChange}
              readOnly
            />
            <label>
              Share:
              <input
                type="checkbox"
                checked={share}
                onChange={(e) => setShare(e.target.checked)}
              />
            </label>   
            
            <button type="button" onClick={createSchedule}>Create</button>         
          </InsertForm>
        </InsertFormPositioner>
      )}
      <CircleButton onClick={handleToggle} open={open}>
        <AddIcon />
      </CircleButton>
    </>
  );
};

export default TodoCreate;