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

const StyledText = styled.div`
  margin-top: 70px;
  text-align: center;
  font-weight: 700;
`;

const TodoItemList = ({ todos = [], handleToggle, handleRemove }) => {
  if (!Array.isArray(todos)) {
    todos = [];
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id} // Add a unique "key" prop here
          todo={todo}
          handleToggle={handleToggle}
          handleRemove={handleRemove}
        />
      ))}
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