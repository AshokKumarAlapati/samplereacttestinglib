import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskList } from '../TaskList';

describe('TaskList', () => {
  beforeEach(() => {
    render(<TaskList />);
  });

  it('renders the task manager title', () => {
    expect(screen.getByRole('heading', { name: 'Task Manager' })).toBeInTheDocument();
  });

  it('adds a new task when the form is submitted', () => {
    const input = screen.getByRole('textbox', { name: 'New task input' });
    const addButton = screen.getByRole('button', { name: 'Add task' });
    
    fireEvent.change(input, { target: { value: 'New test task' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('New test task')).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('toggles task completion when checkbox is clicked', async () => {
    const input = screen.getByRole('textbox', { name: 'New task input' });
    const addButton = screen.getByRole('button', { name: 'Add task' });
    
    fireEvent.change(input, { target: { value: 'Toggle test task' } });
    fireEvent.click(addButton);
    
    const taskText = screen.getByText('Toggle test task');
    const checkbox = screen.getByRole('checkbox', { 
      name: 'Mark "Toggle test task" as complete'
    });
    
    // Initial state - not completed
    expect(taskText.className).not.toContain('line-through');
    
    // Toggle completion
    fireEvent.click(checkbox);
    expect(taskText.className).toContain('line-through');
    
    // Toggle back
    fireEvent.click(checkbox);
    expect(taskText.className).not.toContain('line-through');
  });

  it('deletes a task when delete button is clicked', () => {
    const input = screen.getByRole('textbox', { name: 'New task input' });
    const addButton = screen.getByRole('button', { name: 'Add task' });
    const taskText = 'Task to delete';
    
    fireEvent.change(input, { target: { value: taskText } });
    fireEvent.click(addButton);
    
    expect(screen.getByText(taskText)).toBeInTheDocument();
    
    const deleteButton = screen.getByRole('button', { 
      name: `Delete "${taskText}"`
    });
    fireEvent.click(deleteButton);
    
    expect(screen.queryByText(taskText)).not.toBeInTheDocument();
  });

  it('does not add empty tasks', () => {
    const addButton = screen.getByRole('button', { name: 'Add task' });
    const taskList = screen.getByRole('list');
    const initialTasks = taskList.children.length;
    
    // Try to add empty task
    fireEvent.click(addButton);
    
    // Verify no new task was added
    expect(taskList.children.length).toBe(initialTasks);
  });

  it('trims whitespace from task text', () => {
    const input = screen.getByRole('textbox', { name: 'New task input' });
    const addButton = screen.getByRole('button', { name: 'Add task' });
    
    fireEvent.change(input, { target: { value: '  Task with spaces  ' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Task with spaces')).toBeInTheDocument();
  });

  it('handles multiple tasks correctly', () => {
    const input = screen.getByRole('textbox', { name: 'New task input' });
    const addButton = screen.getByRole('button', { name: 'Add task' });
    const tasks = ['Task 1', 'Task 2', 'Task 3'];
    
    tasks.forEach(taskText => {
      fireEvent.change(input, { target: { value: taskText } });
      fireEvent.click(addButton);
    });
    
    tasks.forEach(taskText => {
      expect(screen.getByText(taskText)).toBeInTheDocument();
    });
    
    const taskList = screen.getByRole('list');
    expect(taskList.children.length).toBe(tasks.length);
  });
});
