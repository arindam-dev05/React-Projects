import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnitToggle from '../UnitToggle';

describe('UnitToggle', () => {
  it('renders a unit toggle button', () => {
    render(
      <UnitToggle
        unit="C"
        onToggle={jest.fn()}
        onUnitChange={jest.fn()}
        setUnit={jest.fn()}
      />
    );

    const toggle =
      screen.queryByRole('button', {
        name: /toggle|unit|celsius|fahrenheit/i,
      }) || screen.getByRole('button');

    expect(toggle).toBeInTheDocument();
    expect(toggle.textContent).toMatch(/°?C|°?F|C|F/i);
  });

  it('invokes the unit change handler when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    const onUnitChange = jest.fn();
    const setUnit = jest.fn();

    render(
      <UnitToggle
        unit="C"
        onToggle={onToggle}
        onUnitChange={onUnitChange}
        setUnit={setUnit}
      />
    );

    const toggle =
      screen.queryByRole('button', {
        name: /toggle|unit|celsius|fahrenheit/i,
      }) || screen.getByRole('button');

    await user.click(toggle);

    const callbackWasCalled = [onToggle, onUnitChange, setUnit].some(
      (fn) => fn.mock.calls.length > 0
    );

    expect(callbackWasCalled).toBe(true);
  });
});
