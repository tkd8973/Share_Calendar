import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import TodoItem from "../TodoItem/TodoItem";


const TodoListBlock = styled.div`
  flex: 1;
  padding: 20px 32px;
  padding-bottom: 48px;
  overflow-y: auto;
`;


const TodoItemList = ({ todos, handleToggle, handleRemove, loverId }) => {
  return (
    <div>
      {todos.map((todo) => {
        if (todo.shared && todo.LoverId === loverId) {
          return (
            <TodoItem
              key={todo.id}
              id={todo.id}
              text={todo.text}
              done={todo.done}
              handleToggle={handleToggle}
              handleRemove={handleRemove}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};


TodoItemList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired,
    })
  ).isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default TodoItemList;
