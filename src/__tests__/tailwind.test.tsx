import React from 'react'
import tw from '../tailwind'
import { render } from '@testing-library/react';

describe('tw', () => {
  it('matches snapshot with intrinsic element', () => {
    const Div = tw.div`bg-gray-400`;
    const { asFragment } = render(<Div />);
    expect(asFragment()).toMatchSnapshot();
  })

  it('matches snapshot with function component', () => {
    const TestComp = () => <div>Test</div>
    const TestCompStyled = tw(TestComp)`bg-gray-400`;
    const { asFragment } = render(<TestCompStyled />);
    expect(asFragment()).toMatchSnapshot();
  })

  it('matches snapshot with class component', () => {
    class TestComp extends React.Component {
      render() {
        return <div>Test</div>
      }
    }
    const TestCompStyled = tw(TestComp)`bg-gray-400`;
    const { asFragment } = render(<TestCompStyled />);
    expect(asFragment()).toMatchSnapshot();
  })
})
