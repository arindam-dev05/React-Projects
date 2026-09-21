import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders an input and submits the entered city name', () => {
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'London' } });

    expect(input).toHaveValue('London');

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('London');
  });

  it('calls onSearch with the trimmed value when submitted', () => {
    const onSearch = jest.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  Paris  ' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('Paris');
  });
});
